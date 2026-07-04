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
    get lowObs(){ return lowObs; }, get feathers(){ return feathers; }, get arrows(){ return arrows; },
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
    if (g.state === 'boon') { g.tryAction(); g.draw(); continue; } // pick the right-hand boon and move on
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
    let guardAhead = null, feintBlock = null;
    for (const gu of g.guards) {
      if (!gu.active || !gu.alive) continue;
      const dx = gu.x - px;
      if (dx <= -10 || dx >= lookahead) continue;
      if (gu.feint && (gu.shT % 150) < 60) { // shielded feint: the read is LEAP, not press
        if (feintBlock === null || dx < feintBlock) feintBlock = dx;
        continue;
      }
      if (guardAhead === null || dx < guardAhead) guardAhead = dx;
    }
    let obAhead = null;
    for (const o of g.lowObs) {
      if (!o.active) continue;
      const dx = o.x - px;
      if (dx > -o.w && dx < lookahead && (obAhead === null || dx < obAhead)) obAhead = dx;
    }
    let arrowAhead = null; // incoming archer arrows — deflect with a fast press
    for (const a of g.arrows) {
      if (!a.active || a.vx > 0) continue;
      const dx = a.x - px;
      if (dx > 0 && dx < 150 && (arrowAhead === null || dx < arrowAhead)) arrowAhead = dx;
    }

    // ---- decide (with reaction delay) ----
    // jump timing anticipates the edge; reaction tier shifts how late the press lands
    // Trigger margin includes reactionFrames TWICE: once for the decide-to-jump lookahead, once
    // more so the reactionFrames-long delay before the press itself can't run the bot past the
    // edge (§6: a bot that decides right at the edge and then waits `reactionFrames` more frames
    // before pressing can overshoot solid ground — bot-timing artifact, not a game bug; verified
    // 2026-07-03 that every failing gap here is trivially clearable by a press at the true edge).
    if (gapAhead !== null && gapAhead < spd * (5 + reactionFrames * 2) + 6 && pendingJump < 0 && p.onGround)
      pendingJump = f + reactionFrames;
    if (feintBlock !== null && feintBlock < spd * (12 + reactionFrames) && pendingJump < 0 && p.onGround)
      pendingJump = f + reactionFrames; // leap the shielded feint like a hazard (needs a full-arc lead, not a last-instant hop)
    if (guardAhead !== null && guardAhead < 36 + spd * 14 && pendingAction < 0)
      pendingAction = f + reactionFrames;
    // slide press: anticipated like gaps (obstacles are visible far ahead — reaction delay
    // models surprise, not a planned slide), lands inside the game's window (10 + speed*12)
    if (obAhead !== null && obAhead < 6 + spd * (10 + reactionFrames) && pendingAction < 0 && !p.sliding)
      pendingAction = f + reactionFrames;
    if (arrowAhead !== null && arrowAhead < 30 + spd * 10 && pendingAction < 0)
      pendingAction = f + Math.min(reactionFrames, 4); // reflex read — capped, even slow players flinch fast

    if (pendingJump >= 0 && f >= pendingJump) { g.jumpPress(); jumps++; pendingJump = -1; releaseAt = f + 20; } // full hold
    if (releaseAt >= 0 && f >= releaseAt) { g.jumpRelease(); releaseAt = -1; }
    if (pendingAction >= 0 && f >= pendingAction) {
      // whiff recovery punishes flails, so the bot only swings when something is really in reach
      // (a strikeable guard, a deflectable arrow, or a hazard inside the slide window)
      const reach = 42 + spd * 14;
      let go = obAhead !== null && obAhead < 10 + spd * 12;
      if (!go) for (const gu of g.guards) {
        if (!gu.active || !gu.alive) continue;
        const dx = gu.x - px, dy = Math.abs(gu.y - p.y);
        if (dx > -14 && dx < reach && dy < 30 && !(gu.feint && (gu.shT % 150) < 60)) { go = true; break; }
      }
      if (!go) for (const a of g.arrows) {
        if (a.active && a.vx < 0 && Math.abs(a.x - px) < reach && Math.abs(a.y - (p.y - 18)) < 26) { go = true; break; }
      }
      if (go) { g.tryAction(); actions++; pendingAction = -1; }
      else if (f > pendingAction + 30) pendingAction = -1; // stale intent — drop it
    }

    if (p.sliding && !wasSliding) slides++;
    wasSliding = p.sliding;
    if (f % 60 === 0) speedSamples.push(+g.speed.toFixed(2));

    g.update();
    g.draw(); // ctx is a swallow-everything proxy, but this still smoke-tests the draw path for runtime errors
    if (process.env.RS_DEBUG && g.state !== 'playing' && g.state !== 'boon') {
      // death forensics: what was around the player when it ended
      const near = g.guards.filter(x => x.active && Math.abs(x.x - p.x) < 120)
        .map(x => ({ dx: (x.x - p.x) | 0, alive: x.alive, kind: x.cap ? 'cap' : x.feint ? 'feint' : x.archer ? 'archer' : 'guard', shT: x.shT, stunT: x.stunT }));
      const segs = g.segments.filter(s => s.active).map(s => ({ x1: s.x1 | 0, x2: s.x2 | 0, y: s.y, gapBefore: s.gapBefore | 0 })).sort((a, b) => a.x1 - b.x1);
      console.error('DEBUG death', g.deathCause, 'tier', reactionFrames, 'dist', g.distance | 0, 'px', p.x | 0, 'py', p.y | 0, 'onG', p.onGround,
        'near', JSON.stringify(near), 'segs', JSON.stringify(segs));
    }
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
