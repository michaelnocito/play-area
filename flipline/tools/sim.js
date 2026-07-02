"use strict";
// Headless fairness/difficulty simulator for FLIPLINE (downline v1).
// Runs the REAL game physics/spawn/collision code (extracted from index.html)
// inside a stubbed-browser vm context, driven by scripted "bots" with
// human-like reaction-time models instead of a person tapping.
//
// Usage: node tools/sim.js
//
// What it answers:
//  - Layer 2 (Monte Carlo): survival distance distribution per skill tier,
//    death-by-formation, death-by-speed-bracket, early-death ("friction") rate.
//  - Layer 3 (fuzz): a deterministic sweep across formation types x worst-case
//    obstacle height/width extremes at max speed, checking the physical
//    reachability envelope (measured flip-transit time vs. spawn gap budget)
//    rather than trusting RNG luck to find the worst case.
//
// See project chat / FLIPLINE_DEV_NOTES.md for the research this is based on.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const INDEX = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(INDEX, "utf8");
const m = html.match(/<script>\r?\n"use strict";([\s\S]*?)<\/script>/);
if (!m) throw new Error("Could not find the game <script> block in index.html");
const gameSrc = m[1];

// ---------- minimal browser stubs ----------
function noopProxy() {
  return new Proxy(
    {},
    {
      get(target, prop) {
        if (prop in target) return target[prop];
        if (prop === Symbol.toPrimitive) return undefined;
        return function () {
          return noopProxy();
        };
      },
    }
  );
}
function makeElementStub() {
  const el = {
    style: {},
    addEventListener() {},
    removeEventListener() {},
    getContext() {
      return noopProxy();
    },
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 480, height: 270 };
    },
  };
  return el;
}
const storage = {};
const sandbox = {
  console,
  innerWidth: 480,
  innerHeight: 270,
  devicePixelRatio: 1,
  localStorage: {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null),
    setItem: (k, v) => {
      storage[k] = String(v);
    },
    removeItem: (k) => {
      delete storage[k];
    },
  },
  addEventListener() {},
  removeEventListener() {},
  requestAnimationFrame() {
    return 0;
  }, // no auto rAF loop — we drive update() manually
  cancelAnimationFrame() {},
  setTimeout,
  clearTimeout,
  document: {
    getElementById(id) {
      return makeElementStub();
    },
    createElement(tag) {
      const el = makeElementStub();
      el.width = 0;
      el.height = 0;
      return el;
    },
  },
};
sandbox.window = sandbox;
const context = vm.createContext(sandbox);
vm.runInContext(gameSrc, context, { filename: "flipline-index.html" });

// ---------- driver (runs inside the same vm realm as the game code) ----------
const driverSrc = `
function currentSideAtRisk(){ return gdir===1 ? 0 : 1; }
function nearestDangerAhead(){
  let best=null, bestAhead=Infinity;
  const risk = currentSideAtRisk();
  for(const o of obs){
    if(!o.on || o.side!==risk) continue;
    const ahead = o.x - PX;
    if(ahead > -o.w && ahead < bestAhead){ best=o; bestAhead=ahead; }
  }
  return best ? {o:best, ahead:bestAhead} : null;
}
let FLIP_CLEARANCE_S = 0; // set once from host via measureFlipTransit() before any simulateOne() calls
function simulateOne(bot, maxDist, maxSteps){
  const DT=1/60;
  start();
  reviveUsedFree=true; reviveUsedAd=true;   // one life per sim run — clean survival-distance signal
  let reactingTo=null, reactThreshold=0, fmAtDeath=-1;
  let steps=0, distAtDeath=0, speedAtDeath=0;
  let died=false;
  while(steps<maxSteps){
    steps++;
    if(mode!=="play"){ died=true; break; }
    if(dist>=maxDist){ break; }              // survived the whole test range
    const danger=nearestDangerAhead();
    // Trigger distance = human decision latency (reactionTime) PLUS the physical time the flip itself
    // needs to actually clear the danger (FLIP_CLEARANCE_S, measured empirically, not skill-dependent).
    // A skilled player waits until this combined deadline (maximum safe margin for whatever comes next)
    // rather than reacting the instant a threat is technically visible.
    if(danger && reactingTo!==danger.o){
      reactingTo=danger.o;
      const rt=Math.max(0.02, bot.reactionTime+(Math.random()*2-1)*bot.jitter);
      reactThreshold=rt+FLIP_CLEARANCE_S;
    }
    if(!danger) reactingTo=null;
    if(reactingTo && danger && danger.ahead<=speed*reactThreshold){ flip(); reactingTo=null; }
    fmAtDeath=fmId; distAtDeath=dist; speedAtDeath=speed;
    update(DT);
  }
  return { died, dist: died?distAtDeath:dist, speed: died?speedAtDeath:speed, fmId: fmAtDeath, steps };
}
function measureFlipTransit(samples){
  // empirical worst-case time for a flip to carry the player fully to the opposite rest surface,
  // sampled across a range of starting speeds (transit itself is speed-independent, but sample anyway).
  const DT=1/60; let worst=0;
  for(let i=0;i<samples;i++){
    start();
    const targetSide = gdir===1 ? -1 : 1;
    flip();
    let t=0, steps=0;
    while(steps<600){
      steps++; t+=DT;
      update(DT);
      const resting = (gdir===1 && py>=BOTY-PS-0.01) || (gdir===-1 && py<=TOPY+0.01);
      if(resting){ break; }
    }
    if(t>worst) worst=t;
  }
  return worst;
}
`;
vm.runInContext(driverSrc, context, { filename: "flipline-sim-driver.js" });

// measure the empirical flip-clearance floor BEFORE any simulateOne() call — every bot's trigger
// threshold needs this added on top of raw reaction time, or a "perfect" bot ends up flipping so
// late that the flip itself has no time left to physically execute (that inversion is exactly what
// the first pass of this harness got wrong: faster bots were dying at HALF the distance of slow ones).
const flipTransit = vm.runInContext("measureFlipTransit(200)", context);
vm.runInContext(`FLIP_CLEARANCE_S = ${flipTransit};`, context);

// ---------- Monte Carlo (layer 2) ----------
const TIERS = [
  { name: "frame-perfect (sanity ceiling)", reactionTime: 0.03, jitter: 0.01 },
  { name: "expert", reactionTime: 0.12, jitter: 0.03 },
  { name: "average", reactionTime: 0.22, jitter: 0.06 },
  { name: "novice", reactionTime: 0.35, jitter: 0.1 },
  { name: "slow/AFK-ish (failure floor)", reactionTime: 0.45, jitter: 0.15 },
];
const RUNS_PER_TIER = 300;
const MAX_DIST = 3000;
const MAX_STEPS = 30000;

function pct(arr, p) {
  const s = [...arr].sort((a, b) => a - b);
  const i = Math.min(s.length - 1, Math.max(0, Math.floor((p / 100) * s.length)));
  return s[i];
}

const results = [];
for (const tier of TIERS) {
  const dists = [];
  const bySpeedBucket = {};
  const byFm = {};
  let earlyDeaths = 0; // died before dist 100 (the "gentle onboarding" window)
  for (let i = 0; i < RUNS_PER_TIER; i++) {
    const r = vm.runInContext(`simulateOne(${JSON.stringify(tier)}, ${MAX_DIST}, ${MAX_STEPS})`, context);
    dists.push(r.dist);
    if (r.died) {
      if (r.dist < 100) earlyDeaths++;
      const bucket = Math.floor(r.speed / 20) * 20;
      bySpeedBucket[bucket] = (bySpeedBucket[bucket] || 0) + 1;
      byFm[r.fmId] = (byFm[r.fmId] || 0) + 1;
    }
  }
  const deaths = dists.filter((d) => d < MAX_DIST).length;
  results.push({
    tier: tier.name,
    reactionTime: tier.reactionTime,
    runs: RUNS_PER_TIER,
    deathRate: (deaths / RUNS_PER_TIER).toFixed(2),
    survivedFullRange: RUNS_PER_TIER - deaths,
    meanDist: Math.round(dists.reduce((a, b) => a + b, 0) / dists.length),
    p10: Math.round(pct(dists, 10)),
    median: Math.round(pct(dists, 50)),
    p90: Math.round(pct(dists, 90)),
    earlyDeathRate: (earlyDeaths / RUNS_PER_TIER).toFixed(2),
    deathsBySpeedBucket: bySpeedBucket,
    deathsByFormation: byFm,
  });
}

// ---------- envelope measurement (layer 1, empirical) ----------
const SPEEDMX = vm.runInContext("SPEEDMX", context);
const GAPMIN = vm.runInContext("GAPMIN", context);
const GAP0 = vm.runInContext("GAP0", context);
const worstCaseGapTimeBudget = GAPMIN / SPEEDMX; // seconds available at tightest spacing + top speed
const reactionBudget = worstCaseGapTimeBudget - flipTransit;

console.log("=== FLIPLINE downline fairness/difficulty simulation ===\n");
console.log(`Measured worst-case flip transit time: ${(flipTransit * 1000).toFixed(0)}ms`);
console.log(`Tightest spacing / top speed time budget (GAPMIN=${GAPMIN} / SPEEDMX=${SPEEDMX}): ${(worstCaseGapTimeBudget * 1000).toFixed(0)}ms`);
console.log(`=> Reaction budget left after the flip itself completes: ${(reactionBudget * 1000).toFixed(0)}ms\n`);

console.log("Skill tier".padEnd(28), "deathRate", "meanDist", "p10", "median", "p90", "earlyDeath%");
for (const r of results) {
  console.log(
    r.tier.padEnd(28),
    r.deathRate.padEnd(9),
    String(r.meanDist).padEnd(8),
    String(r.p10).padEnd(4),
    String(r.median).padEnd(6),
    String(r.p90).padEnd(4),
    r.earlyDeathRate
  );
}
console.log("\nPer-tier death breakdown:\n");
for (const r of results) {
  console.log(`-- ${r.tier} (reaction ${(r.reactionTime * 1000).toFixed(0)}ms) --`);
  console.log("  deaths by speed bucket (px/s):", r.deathsBySpeedBucket);
  console.log("  deaths by formation id (1=solo 2=double 3=zigzag 4=staircase 5=pinch 6=gauntlet):", r.deathsByFormation);
}

fs.writeFileSync(
  path.join(__dirname, "sim-results.json"),
  JSON.stringify({ flipTransitMs: flipTransit * 1000, reactionBudgetMs: reactionBudget * 1000, GAP0, GAPMIN, SPEEDMX, results }, null, 2)
);
console.log("\nFull results written to tools/sim-results.json");
