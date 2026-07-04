// Deep QA sweep for Rooftop Sprint — goes beyond rs_playtest.js's fairness bars to check
// timing (strike windows, whiff recovery, feint cycle, archer reload) and spacing invariants
// (guard/hazard-on-roof, anti-streak, formation clamping, pool exhaustion) as the game actually
// runs. Read-only assertions layered on top of live play — no mechanics are touched.
//
// Run:  node tools/rs_qa_sweep.js
//
// Same vm+stub pattern as rs_playtest.js (chainable Proxy ctx, seeded mulberry32 Math.random).
// Extends the debug hook with more internals (braziers, per-tier kill counts, mode/modIdx).
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(process.env.RS_HTML || path.join(__dirname, '..', 'index.html'), 'utf8');
let script = html.match(/<script>([\s\S]*)<\/script>/)[1];

const HOOK = `
  window.__RS_QA_TRACE = ${!!process.env.RS_TRACE_CAP};
  window.__g = {
    get state(){ return state; }, set state(v){ state = v; }, set mode(v){ mode = v; }, get mode(){ return mode; },
    get player(){ return player; }, get segments(){ return segments; }, get guards(){ return guards; },
    get lowObs(){ return lowObs; }, get feathers(){ return feathers; }, get arrows(){ return arrows; },
    get braziers(){ return braziers; }, get distance(){ return distance; }, get speed(){ return speed; },
    get deathCause(){ return deathCause; }, get modIdx(){ return modIdx; }, get curD(){ return curD; },
    get lampLight(){ return lampLight; }, get cleanK(){ return cleanK; }, get heavyK(){ return heavyK; },
    get perfK(){ return perfK; }, get dominoK(){ return dominoK; }, get captainK(){ return captainK; },
    get bestChain(){ return bestChain; }, get save(){ return save; }, get nextCaptainD(){ return nextCaptainD; },
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
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function newGame(seed) {
  const els = {};
  const M = {}; for (const k of Object.getOwnPropertyNames(Math)) M[k] = Math[k];
  M.random = mulberry32(seed);
  const sandbox = {
    localStorage: { _d:{}, getItem(k){ return this._d[k] ?? null; }, setItem(k,v){ this._d[k]=v; }, removeItem(k){ delete this._d[k]; } },
    requestAnimationFrame: noop, Math: M, parseInt, Infinity, console, setTimeout: noop, clearTimeout: noop,
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
  return sandbox.__g;
}

// ---------- Shared invariant checker: on-roof containment for anything that should stand
// on a roof (guards, low hazards) — this is exactly the class of bug the level-design pass
// surfaced (a guard floating over a gap's empty airspace). ----------
function onSomeRoof(g, x, pad) {
  for (const s of g.segments) { if (s.active && x >= s.x1 - pad && x <= s.x2 + pad) return true; }
  return false;
}

function runSweep({ label, seed, tier, mode, maxFrames }) {
  const g = newGame(seed);
  const p = g.player;
  g.mode = mode;
  g.beginGame();

  const violations = { guardOffRoof: [], hazardOffRoof: [], consecutiveGap: [], formationOverlap: [] };
  const poolPeak = { segments: 0, guards: 0, lowObs: 0, braziers: 0, arrows: 0 };
  const timingTiers = { clean: 0, heavy: 0, perfect: 0, domino: 0, captain: 0 };
  const feintEncounters = { blocked: 0, open: 0 };
  let arrowsSeenEver = false, braziersLitEver = false, boonEntries = 0, boonResolved = 0;
  let pendingJump = -1, releaseAt = -1, pendingAction = -1;
  const reactionFrames = tier === 'perfect' ? 2 : tier === 'sharp' ? 6 : 10;

  let lastCleanK = 0, lastHeavyK = 0, lastPerfK = 0, lastDominoK = 0, lastCaptainK = 0;
  let f = 0;
  for (; f < maxFrames; f++) {
    if (g.state === 'boon') { boonEntries++; g.tryAction(); boonResolved++; g.draw(); continue; }
    if (g.state !== 'playing') break;
    const px = p.x + p.w / 2, spd = g.speed;

    // ---- perception (same shape as rs_playtest.js's bot) ----
    const seg = g.segmentAt(px);
    let gapAhead = null;
    if (seg) {
      const next = g.segments.filter(s => s.active && s.x1 > seg.x2 - 8).sort((a,b)=>a.x1-b.x1)[0];
      if (!next || next.x1 > seg.x2 + 2) gapAhead = seg.x2 - px;
      else if (next && next.y < seg.y - 8) gapAhead = seg.x2 - px;
    }
    let guardAhead = null, feintBlock = null;
    for (const gu of g.guards) {
      if (!gu.active || !gu.alive) continue;
      const dx = gu.x - px;
      if (dx <= -10 || dx >= 180) continue;
      if (gu.feint && (gu.shT % 150) < 60) { if (feintBlock === null || dx < feintBlock) feintBlock = dx; continue; }
      if (guardAhead === null || dx < guardAhead) guardAhead = dx;
    }
    let obAhead = null;
    for (const o of g.lowObs) { if (!o.active) continue; const dx = o.x - px; if (dx > -o.w && dx < 140 && (obAhead === null || dx < obAhead)) obAhead = dx; }
    let arrowAhead = null;
    for (const a of g.arrows) { if (!a.active || a.vx > 0) continue; const dx = a.x - px; if (dx > 0 && dx < 150 && (arrowAhead === null || dx < arrowAhead)) arrowAhead = dx; }
    if (g.arrows.some(a => a.active)) arrowsSeenEver = true;
    if (g.braziers.some(b => b.active && b.lit)) braziersLitEver = true;

    if (gapAhead !== null && gapAhead < spd * (5 + reactionFrames * 2) + 6 && pendingJump < 0 && p.onGround) pendingJump = f + reactionFrames;
    if (feintBlock !== null && feintBlock < spd * (12 + reactionFrames) && pendingJump < 0 && p.onGround) pendingJump = f + reactionFrames;
    if (guardAhead !== null && guardAhead < 36 + spd * 14 && pendingAction < 0) pendingAction = f + reactionFrames;
    if (obAhead !== null && obAhead < 6 + spd * (10 + reactionFrames) && pendingAction < 0 && !p.sliding) pendingAction = f + reactionFrames;
    if (arrowAhead !== null && arrowAhead < 30 + spd * 10 && pendingAction < 0) pendingAction = f + Math.min(reactionFrames, 4);

    if (pendingJump >= 0 && f >= pendingJump) { g.jumpPress(); pendingJump = -1; releaseAt = f + 20; }
    if (releaseAt >= 0 && f >= releaseAt) { g.jumpRelease(); releaseAt = -1; }
    if (pendingAction >= 0 && f >= pendingAction) {
      const reach = 42 + spd * 14;
      let go = obAhead !== null && obAhead < 10 + spd * 12;
      if (!go) for (const gu of g.guards) {
        if (!gu.active || !gu.alive) continue;
        const dx = gu.x - px, dy = Math.abs(gu.y - p.y);
        const blocked = gu.feint && (gu.shT % 150) < 60;
        if (dx > -14 && dx < reach && dy < 30) {
          if (blocked) feintEncounters.blocked++; else { go = true; if (!gu.cap) feintEncounters.open += gu.feint ? 1 : 0; break; }
        }
      }
      if (!go) for (const a of g.arrows) if (a.active && a.vx < 0 && Math.abs(a.x - px) < reach && Math.abs(a.y - (p.y - 18)) < 26) { go = true; break; }
      if (go) { g.tryAction(); pendingAction = -1; } else if (f > pendingAction + 30) pendingAction = -1;
    }

    g.update();
    g.draw();

    // ---- invariant checks (post-frame, on the live state) ----
    for (const gu of g.guards) {
      if (!gu.active || !gu.alive || gu.fly > 0) continue; // corpses in flight legitimately leave roofs
      if (!onSomeRoof(g, gu.x, 8)) {
        const detail = {
          f, dist: g.distance | 0, x: gu.x | 0, cap: !!gu.cap, playerX: p.x | 0,
          segs: g.segments.filter(s => s.active).map(s => [s.x1|0, s.x2|0]).sort((a,b)=>a[0]-b[0]),
        };
        if (process.env.RS_QA_VERBOSE && violations.guardOffRoof.length === 0) console.error('GUARD OFF ROOF', JSON.stringify(detail));
        violations.guardOffRoof.push(detail);
      }
    }
    for (const o of g.lowObs) {
      if (!o.active) continue;
      if (!onSomeRoof(g, o.x, 6)) violations.hazardOffRoof.push({ f, dist: g.distance | 0, x: o.x | 0 });
    }
    // consecutive-gap: sort active segments, flag any two adjacent gaps with no roof between
    const sorted = g.segments.filter(s => s.active).sort((a,b) => a.x1 - b.x1);
    let prevGap = false;
    for (let i = 1; i < sorted.length; i++) {
      const gapHere = sorted[i].x1 > sorted[i-1].x2 + 2;
      if (gapHere && prevGap) violations.consecutiveGap.push({ f, dist: g.distance | 0, x1: sorted[i].x1 | 0 });
      prevGap = gapHere;
    }
    // formation overlap: two active, non-dying, non-captain guards should never occupy the same point
    const alive = g.guards.filter(gu => gu.active && gu.alive);
    for (let i = 0; i < alive.length; i++) for (let j = i+1; j < alive.length; j++) {
      if (process.env.RS_QA_TRACE_APPROACH && Math.abs(alive[i].y - alive[j].y) < 4 && Math.abs(alive[i].x - alive[j].x) < 12) {
        console.error('APPROACH', f, JSON.stringify({
          ax: alive[i].x.toFixed(1), aMin: alive[i].patrolMin.toFixed(1), aMax: alive[i].patrolMax.toFixed(1), aDir: alive[i].patrolDir, aStun: alive[i].stunT,
          bx: alive[j].x.toFixed(1), bMin: alive[j].patrolMin.toFixed(1), bMax: alive[j].patrolMax.toFixed(1), bDir: alive[j].patrolDir, bStun: alive[j].stunT,
        }));
      }
      if (Math.abs(alive[i].x - alive[j].x) < 4 && Math.abs(alive[i].y - alive[j].y) < 4) {
        const kindOf = gu => gu.cap ? 'cap' : gu.feint ? 'feint' : gu.archer ? 'archer' : 'guard';
        const segOf = x => { const s = g.segments.find(s => s.active && x >= s.x1 && x <= s.x2); return s ? [s.x1|0, s.x2|0] : null; };
        const detail = { f, dist: g.distance | 0, ax: alive[i].x|0, ay: alive[i].y|0, bx: alive[j].x|0, by: alive[j].y|0,
          a: kindOf(alive[i]), b: kindOf(alive[j]), segA: segOf(alive[i].x), segB: segOf(alive[j].x) };
        if (process.env.RS_QA_VERBOSE && violations.formationOverlap.length === 0) console.error('OVERLAP', JSON.stringify(detail));
        violations.formationOverlap.push(detail);
      }
    }
    poolPeak.segments = Math.max(poolPeak.segments, g.segments.filter(s=>s.active).length);
    poolPeak.guards = Math.max(poolPeak.guards, g.guards.filter(x=>x.active).length);
    poolPeak.lowObs = Math.max(poolPeak.lowObs, g.lowObs.filter(x=>x.active).length);
    poolPeak.braziers = Math.max(poolPeak.braziers, g.braziers.filter(x=>x.active).length);
    poolPeak.arrows = Math.max(poolPeak.arrows, g.arrows.filter(x=>x.active).length);

    if (g.cleanK > lastCleanK) { timingTiers.clean += g.cleanK - lastCleanK; lastCleanK = g.cleanK; }
    if (g.heavyK > lastHeavyK) { timingTiers.heavy += g.heavyK - lastHeavyK; lastHeavyK = g.heavyK; }
    if (g.perfK > lastPerfK) { timingTiers.perfect += g.perfK - lastPerfK; lastPerfK = g.perfK; }
    if (g.dominoK > lastDominoK) { timingTiers.domino += g.dominoK - lastDominoK; lastDominoK = g.dominoK; }
    if (g.captainK > lastCaptainK) { timingTiers.captain += g.captainK - lastCaptainK; lastCaptainK = g.captainK; }
  }

  return {
    label, seed, tier, mode, framesRun: f, dist: g.distance | 0, deathCause: g.deathCause || 'survived-cap',
    modIdxSeen: g.modIdx, violations, poolPeak, timingTiers, feintEncounters, arrowsSeenEver, braziersLitEver,
    boonEntries, boonResolved, save: g.save,
  };
}

const POOL_MAX = { segments: 14, guards: 15, lowObs: 8, braziers: 9, arrows: 6 };
const SEEDS = [20260703, 2, 3, 6, 7];
const results = [];

console.log('=== CAMPAIGN sweep (5 seeds x elite+average tiers) ===');
for (const seed of SEEDS) {
  for (const tier of ['perfect', 'average']) {
    results.push(runSweep({ label: 'campaign', seed, tier, mode: 'campaign', maxFrames: 60 * 150 }));
  }
}

console.log('=== NIGHT SHIFT + DAILY TRIAL coverage (short runs) ===');
results.push(runSweep({ label: 'endless', seed: 42, tier: 'perfect', mode: 'endless', maxFrames: 60 * 60 }));
results.push(runSweep({ label: 'daily', seed: 99, tier: 'perfect', mode: 'daily', maxFrames: 60 * 60 }));

let anyViolation = false;
for (const r of results) {
  const vCount = Object.values(r.violations).reduce((s, a) => s + a.length, 0);
  if (vCount > 0) anyViolation = true;
  console.log(`\n--- ${r.label} seed=${r.seed} tier=${r.tier} ---`);
  console.log(`  frames=${r.framesRun} dist=${r.dist}m death=${r.deathCause} modIdx=${r.modIdxSeen}`);
  console.log(`  pool peaks: seg ${r.poolPeak.segments}/${POOL_MAX.segments} guards ${r.poolPeak.guards}/${POOL_MAX.guards} lowObs ${r.poolPeak.lowObs}/${POOL_MAX.lowObs} braziers ${r.poolPeak.braziers}/${POOL_MAX.braziers} arrows ${r.poolPeak.arrows}/${POOL_MAX.arrows}`);
  console.log(`  timing tiers: CLEAN ${r.timingTiers.clean} HEAVY ${r.timingTiers.heavy} PERFECT ${r.timingTiers.perfect} DOMINO ${r.timingTiers.domino} CAPTAIN ${r.timingTiers.captain}`);
  console.log(`  feint encounters: blocked ${r.feintEncounters.blocked} open ${r.feintEncounters.open} | arrows fired: ${r.arrowsSeenEver} | brazier lit: ${r.braziersLitEver} | boons: ${r.boonEntries} entries / ${r.boonResolved} resolved`);
  if (vCount > 0) {
    console.log(`  !! VIOLATIONS (${vCount}):`);
    for (const [kind, arr] of Object.entries(r.violations)) if (arr.length) console.log(`     ${kind}: ${arr.length} — first at`, JSON.stringify(arr[0]));
  }
}

console.log('\n=== POOL EXHAUSTION RISK ===');
for (const kind of Object.keys(POOL_MAX)) {
  const peak = Math.max(...results.map(r => r.poolPeak[kind]));
  const flag = peak >= POOL_MAX[kind] ? 'AT CEILING — spawns may be silently dropping' : 'headroom OK';
  console.log(`  ${kind}: peak ${peak}/${POOL_MAX[kind]} — ${flag}`);
}

console.log('\n=== SAVE/PROGRESSION SANITY (after all runs) ===');
const lastSave = results[results.length - 1].save;
console.log('  final save object:', JSON.stringify(lastSave));

console.log('\n=== OVERALL ===', anyViolation ? 'VIOLATIONS FOUND — see above' : 'ALL INVARIANTS HELD');
