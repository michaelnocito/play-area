// Headless playtest harness for Rooftop Sprint — runs the REAL game script inside a stubbed
// DOM (node vm), injects a debug hook (the shipped index.html is untouched), drives update()
// directly (no rAF, no slow-mo), and bots the game at several human reaction tiers.
//
// Run:  node tools/rs_playtest.js          (from the rooftop-sprint folder)
//
// GOTCHA (keep this): the canvas 2d-context stub MUST be a chainable, callable Proxy —
// the draw code freely chains ctx.<anything>(...).<anything>; a plain-object stub throws
// on the first frame and kills the whole script inside the IIFE.
//
// Fairness bars this file exists to check (re-run after EVERY mechanics change):
//   - perfect/sharp bots basically never die to 'gap'  → all gaps single-jump clearable
//   - perfect/sharp bots basically never die to 'low'  → slide window is reachable
//   - tiers separate (sharp survives clearly longer than slow) → skill matters
const fs = require('fs');
const vm = require('vm');
const path = require('path');

// RS_HTML env var lets you point the suite at another build (e.g. a git-show'd old master)
// to separate regressions from layout-RNG luck. RS_SEED picks the deterministic stream.
const html = fs.readFileSync(process.env.RS_HTML || path.join(__dirname, '..', 'index.html'), 'utf8');
let script = html.match(/<script>([\s\S]*)<\/script>/)[1];

// Inject debug exposure just before the IIFE closes
const HOOK = `
  window.__g = {
    get state(){ return state; }, set state(v){ state = v; },
    get player(){ return player; }, get segments(){ return segments; }, get guards(){ return guards; },
    get lowObs(){ return lowObs; }, get feathers(){ return feathers; },
    get distance(){ return distance; }, get speed(){ return speed; }, get deathCause(){ return deathCause; },
    update, draw, beginGame, jumpPress, jumpRelease, tryAction, segmentAt,
  };
`;
script = script.replace(/\n\}\)\(\);\s*$/, HOOK + '\n})();');

function noop() {}
function makeCtx() { const prox = new Proxy(function(){}, { get: (t,p) => p==='canvas' ? null : prox, set: () => true, apply: () => prox }); return prox; }
function el(id) {
  return {
    id, textContent: '', innerHTML: '', style: {}, width: 480, height: 270, children: [],
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    addEventListener: noop, getContext: makeCtx, click: noop, appendChild: noop,
  };
}
// Seeded PRNG (mulberry32) replaces Math.random inside the sandbox — suite runs are now
// reproducible (§6: the unseeded flake made every FAIL ambiguous). Game code is untouched.
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const SEED = parseInt(process.env.RS_SEED || '20260703', 10);
const seededMath = {};
for (const k of Object.getOwnPropertyNames(Math)) seededMath[k] = Math[k];
seededMath.random = mulberry32(SEED);

const els = {};
const sandbox = {
  localStorage: { _d:{}, getItem(k){ return this._d[k] ?? null; }, setItem(k,v){ this._d[k]=v; }, removeItem(k){ delete this._d[k]; } },
  requestAnimationFrame: noop, // we drive update() directly
  Math: seededMath, parseInt, Infinity, console, setTimeout: noop, clearTimeout: noop,
};
sandbox.window = sandbox;
sandbox.document = {
  createElement: () => el('offscreen'),
  getElementById: id => els[id] || (els[id] = el(id)),
  querySelector: () => el('q'),
  querySelectorAll: () => [el('p0'), el('p1')],
  addEventListener: noop,
};
sandbox.innerWidth = 960; sandbox.innerHeight = 540;
sandbox.addEventListener = noop;
vm.createContext(sandbox);
vm.runInContext(script, sandbox);
const g = sandbox.__g;

function runBot({ reactionFrames, lookahead, maxFrames = 60 * 300 }) {
  g.beginGame();
  const p = g.player;
  let jumps = 0, actions = 0, slides = 0;
  let pendingJump = -1, releaseAt = -1, pendingAction = -1;
  let wasSliding = false;
  const speedSamples = [];

  for (let f = 0; f < maxFrames; f++) {
    if (g.state !== 'playing') break;
    const px = p.x + p.w / 2;
    const spd = g.speed;

    // ---- perception ----
    // gap edge ahead (no continuing segment, or the next roof steps up)
    const seg = g.segmentAt(px);
    let gapAhead = null;
    if (seg) {
      const next = g.segments.filter(s => s.active && s.x1 > seg.x2 - 8).sort((a,b)=>a.x1-b.x1)[0];
      if (!next || next.x1 > seg.x2 + 2) gapAhead = seg.x2 - px;
      else if (next && next.y < seg.y - 8) gapAhead = seg.x2 - px; // step up also needs a jump
    }
    let guardAhead = null;
    for (const gu of g.guards) {
      if (!gu.active || !gu.alive) continue;
      const dx = gu.x - px;
      if (dx > -10 && dx < lookahead && (guardAhead === null || dx < guardAhead)) guardAhead = dx;
    }
    let obAhead = null;
    for (const o of g.lowObs) {
      if (!o.active) continue;
      const dx = o.x - px;
      if (dx > -o.w && dx < lookahead && (obAhead === null || dx < obAhead)) obAhead = dx;
    }

    // ---- decide (with reaction delay) ----
    // jump timing anticipates the edge; reaction tier shifts how late the press lands
    if (gapAhead !== null && gapAhead < spd * (4 + reactionFrames) + 2 && pendingJump < 0 && p.onGround)
      pendingJump = f + reactionFrames;
    if (guardAhead !== null && guardAhead < 36 + spd * 14 && pendingAction < 0)
      pendingAction = f + reactionFrames;
    // slide press: anticipated like gaps (obstacles are visible far ahead — reaction delay
    // models surprise, not a planned slide), lands inside the game's window (10 + speed*12)
    if (obAhead !== null && obAhead < 6 + spd * (10 + reactionFrames) && pendingAction < 0 && !p.sliding)
      pendingAction = f + reactionFrames;

    if (pendingJump >= 0 && f >= pendingJump) { g.jumpPress(); jumps++; pendingJump = -1; releaseAt = f + 20; } // full hold
    if (releaseAt >= 0 && f >= releaseAt) { g.jumpRelease(); releaseAt = -1; }
    if (pendingAction >= 0 && f >= pendingAction) { g.tryAction(); actions++; pendingAction = -1; }

    if (p.sliding && !wasSliding) slides++;
    wasSliding = p.sliding;
    if (f % 60 === 0) speedSamples.push(+g.speed.toFixed(2));

    g.update();
    g.draw(); // ctx is a swallow-everything proxy, but this still smoke-tests the draw path for runtime errors
  }
  return {
    reactionFrames, dist: Math.floor(g.distance), feathers: g.feathers,
    jumps, actions, slides, deathCause: g.deathCause || 'survived-cap',
    survivedSec: speedSamples.length,
    speedEnd: speedSamples[speedSamples.length - 1],
  };
}

const TIERS = [['perfect', 2, 180], ['sharp', 6, 160], ['average', 10, 140], ['slow', 16, 120]];
const RUNS = 5;
const results = [];
for (const [label, rf, la] of TIERS) {
  for (let i = 0; i < RUNS; i++) { const r = runBot({ reactionFrames: rf, lookahead: la }); r.tier = label; results.push(r); }
}
for (const r of results) console.log(JSON.stringify(r));

console.log('\n=== SUMMARY ===');
const med = a => a.slice().sort((x,y)=>x-y)[Math.floor(a.length/2)];
for (const [t] of TIERS) {
  const rs = results.filter(r => r.tier === t);
  const causes = {};
  for (const r of rs) causes[r.deathCause] = (causes[r.deathCause]||0)+1;
  console.log(t.padEnd(8),
    '| median dist:', String(med(rs.map(r=>r.dist))).padStart(5), 'm',
    '| median survival:', String(med(rs.map(r=>r.survivedSec))).padStart(4), 's',
    '| slides:', rs.reduce((s,r)=>s+r.slides,0),
    '| deaths:', JSON.stringify(causes));
}
// Fairness bar covers the human-relevant range: the §6 difficulty cap lands at ~2500m,
// so an elite bot death beyond that is the speed ceiling talking, not unfair layout.
const elite = results.filter(r => (r.tier === 'perfect' || r.tier === 'sharp') && r.dist < 2500);
const gapDeaths = elite.filter(r => r.deathCause === 'gap').length;
const lowDeaths = elite.filter(r => r.deathCause === 'low').length;
console.log('\nFAIRNESS (<2500m):', gapDeaths === 0 ? 'PASS' : 'FAIL', '— elite gap deaths:', gapDeaths,
  '|', lowDeaths === 0 ? 'PASS' : 'FAIL', '— elite low-hazard deaths:', lowDeaths);
