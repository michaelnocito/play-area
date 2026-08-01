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
    // Physics constants, so the bot can SIMULATE a jump with the game's own numbers instead of
    // guessing at it with hand-tuned linear margins. This is the fix for the long-standing §6
    // ambiguity: every "elite gap death" used to be arguable, because nobody could say whether
    // the jump was actually impossible or the bot just pressed a frame late.
    phys: { GRAVITY, JUMP_V, JUMP_CUT, LOWBAR_TOP, LOWBAR_BOT, PLAYER_H: player.h, SLIDE_H, SLIDE_FRAMES, H },
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
// DevCockpit lives in the repo-root dev-cockpit.js <script>, which the vm never loads — the
// game's `if (DevCockpit.on)` guard then threw a ReferenceError and the whole suite died at
// boot. (This broke when the cockpit landed and went unnoticed because nobody re-ran the
// suite since.) Stub it off: the cockpit is dev-only and stripped before submission anyway.
sandbox.DevCockpit = { on: false, register: noop, set: noop, log: noop };
vm.createContext(sandbox);
vm.runInContext(script, sandbox);
const g = sandbox.__g;

// ---------------------------------------------------------------------------------------
// Jump simulator. Replays the game's exact vertical integration (jump velocity, JUMP_CUT on
// release, gravity, landing test) forward from a hypothetical press, and reports where the
// player would come down.
//
// This exists to kill the §6 ambiguity for good. The old bot decided with hand-tuned linear
// margins like `gapAhead < spd * (5 + reactionFrames * 2) + 6`. Those sat close enough to the
// true physical limit that a level layout a few pixels either side of typical flipped the
// result — so any change that reshuffled the RNG stream changed WHICH bar failed, and a suite
// FAIL could never be read as "the game is unfair" rather than "the bot pressed late".
// Simulating with the real constants makes the bot's timing exactly as good as the physics
// allow, so a remaining failure means the jump is genuinely impossible.
function groundYAt(g, x) {
  for (const s of g.segments) if (s.active && x >= s.x1 && x <= s.x2) return s.y;
  return null;
}
// Returns {landedX, landedY} if the jump comes down safely, or null if it falls or clips a bar.
function simJump(g, startX, spd, holdFrames, horizon = 90) {
  const P = g.phys;
  let x = startX, y = groundYAt(g, x), vy = P.JUMP_V;
  if (y === null) return null;
  for (let i = 0; i < horizon; i++) {
    if (i >= holdFrames && vy < P.JUMP_CUT) vy = P.JUMP_CUT;
    vy += P.GRAVITY;
    y += vy;
    x += spd;
    for (const o of g.lowObs) { // same band test the game runs, at standing height
      if (!o.active) continue;
      if (x + 6 > o.x && x - 6 < o.x + o.w) {
        const top = y - P.PLAYER_H;
        if (top < o.y - P.LOWBAR_BOT && y > o.y - P.LOWBAR_TOP) return null;
      }
    }
    const gY = groundYAt(g, x);
    if (gY !== null && y >= gY && vy >= 0) return { landedX: x, landedY: gY };
    if (y > P.H + 60) return null; // matches die('gap')
  }
  return { landedX: x, landedY: y }; // still airborne at the horizon — not a failure
}
// The nearest thing ahead that must be crossed, as an [startX, endX] span. A jump only counts
// as the right answer if it lands BEYOND endX — without that test the bot happily "solves" a
// gap 60 frames early by hopping on the spot, lands short, and repeats until it runs out of
// roof. That was the cause of the gap deaths, not the physics.
// Scans the WHOLE spawned roof chain, not just the roof underfoot. The earlier version only
// looked at the current segment, so whenever the player stood on a contiguous roof it reported
// "no danger" even with a gap one roof ahead — `clears()` then degenerated into "any safe
// landing", the bot hopped early for no reason, and the real edge arrived while it was still
// recovering. Both failure modes traced back to that single inconsistency.
// includeBars: low hazards are the SLIDE channel's job. Folding them into the jump decision made
// the bot leap every bar, which passed the fairness bars while silently dropping slide coverage
// to zero — the suite stopped testing whether the slide window is reachable at all, which is one
// of the three things it exists to check. simJump still refuses to LAND in a bar either way.
function nextDanger(g, px, spd, horizon = 70, includeBars = false) {
  const limit = px + spd * horizon;
  let best = null;
  const segs = g.segments.filter(s => s.active).sort((a, b) => a.x1 - b.x1);
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i], next = segs[i + 1];
    if (s.x2 < px || s.x2 > limit) continue;
    if (!next) { best = { startX: s.x2, endX: s.x2 + 40 }; break; }   // roof not spawned yet: nominal gap
    if (next.x1 > s.x2 + 2 || next.y < s.y - 8) { best = { startX: s.x2, endX: next.x1 }; break; }
  }
  if (includeBars) for (const o of g.lowObs) {
    if (!o.active) continue;
    if (o.x + o.w < px || o.x > limit) continue;
    if (!best || o.x < best.startX) best = { startX: o.x, endX: o.x + o.w };
  }
  return best;
}
// Where does the CURRENT arc come down? Used for buffered pressing: the game holds a press made
// just before touchdown (jumpBufT / BUFFER_FRAMES) and fires it on landing, which is how a human
// chains a landing straight into the next jump. The bot only ever pressed while grounded, so it
// simply could not play consecutive obstacles that a player handles by buffering.
function simFall(g, px, py, vy0, spd, jumpHeld, horizon = 90) {
  const P = g.phys;
  let x = px, y = py, vy = vy0;
  for (let i = 0; i < horizon; i++) {
    if (!jumpHeld && vy < P.JUMP_CUT) vy = P.JUMP_CUT;
    vy += P.GRAVITY;
    y += vy;
    x += spd;
    const gY = groundYAt(g, x);
    if (gY !== null && y >= gY && vy >= 0) return { landedX: x, frames: i + 1 };
    if (y > P.H + 60) return null;
  }
  return null;
}
// Would simply running forward (no jump) kill us within the horizon?
function simRun(g, startX, spd, horizon = 90) {
  const P = g.phys;
  let x = startX;
  const y = groundYAt(g, x);
  if (y === null) return true;
  for (let i = 0; i < horizon; i++) {
    x += spd;
    const gY = groundYAt(g, x);
    if (gY === null) return true;                 // runs off into a gap
    if (gY < y - 8) return true;                  // steps up: needs a jump
    for (const o of g.lowObs) {                   // standing into a low bar
      if (!o.active) continue;
      if (x + 6 > o.x && x - 6 < o.x + o.w) {
        const top = gY - P.PLAYER_H;
        if (top < o.y - P.LOWBAR_BOT && gY > o.y - P.LOWBAR_TOP) return true;
      }
    }
  }
  return false;
}

function runBot({ reactionFrames, lookahead, maxFrames = 60 * 300 }) {
  g.beginGame();
  const p = g.player;
  let jumps = 0, actions = 0, slides = 0;
  let pendingJump = -1, releaseAt = -1, pendingAction = -1;
  let wasSliding = false, lastDecide = null;
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
    // GAPS / STEP-UPS / LOW BARS — decided by simulation, not by a tuned margin.
    // Rule: only act when running forward would actually kill us, and then commit to the press
    // that the physics say lands safely. Preferring the reaction-delayed press keeps the tier
    // modelling honest (a slow player really does press later); falling back to pressing now
    // models a player who left it late but is still inside the physically possible window.
    // simRun is gone as a gate. The clears() test is self-limiting on its own: from far away a
    // jump lands short of the obstacle so it reads false, and the FIRST frame it reads true is
    // the physically correct commit point. No tuned margin anywhere in this decision.
    if (pendingJump < 0 && p.onGround) {
      const dz = nextDanger(g, px, spd, 70);
      // A landing must have ROOM, not just contact. simJump reports a landing the instant the
      // feet touch a roof, so clearing a low bar could "succeed" by coming down on the final
      // pixel of that roof — and the very next frame the player is over the gap beyond it. The
      // margin test is what makes a cleared obstacle actually survivable.
      const roomAfter = x => groundYAt(g, x + spd * 4) !== null;
      const clears = r => !!dz && !!r && r.landedX > dz.endX + 4 && roomAfter(r.landedX);
      const delayed = simJump(g, px + spd * reactionFrames, spd, 20);
      const nowSim = simJump(g, px, spd, 20);
      if (process.env.RS_DEBUG) lastDecide = { f, px: px|0, spd: +spd.toFixed(2), dz: dz && {s: dz.startX|0, e: dz.endX|0},
        delayed: delayed && (delayed.landedX|0), now: nowSim && (nowSim.landedX|0), onG: p.onGround };
      if (clears(delayed)) pendingJump = f + reactionFrames;
      else if (clears(nowSim)) pendingJump = f; // already late — press this frame
    } else if (pendingJump < 0 && !p.onGround && p.vy > 0) {
      // Airborne and descending: look at where we'll touch down. If the obstacle after that
      // landing needs a jump almost immediately, press NOW so the game's buffer fires it on
      // touchdown. Without this the bot lands, spends its reaction window, and is already past
      // the launch point — which is exactly the "impossible" gap it kept reporting.
      const land = simFall(g, px, p.y, p.vy, spd, p.jumpHeld);
      if (land) {
        const dz2 = nextDanger(g, land.landedX, spd, 70);
        if (dz2 && dz2.startX - land.landedX < spd * (reactionFrames + 4)) {
          const j = simJump(g, land.landedX, spd, 20);
          if (j && j.landedX > dz2.endX + 4) { g.jumpPress(); jumps++; releaseAt = f + 20; }
        }
      }
    }
    // Leaping a shielded feint must still be validated against the terrain. This trigger used to
    // fire blind, and a feint standing near a roof edge produced a leap that landed INSIDE the
    // next gap — the bot died to a gap it had never been given a chance to read, and the suite
    // logged it as an elite gap death. That single interaction accounted for the last remaining
    // failure on every seed. If the leap isn't survivable, don't take it; the strike logic below
    // is the fallback.
    if (feintBlock !== null && feintBlock < spd * (12 + reactionFrames) && pendingJump < 0 && p.onGround
        && simJump(g, px + spd * reactionFrames, spd, 20))
      pendingJump = f + reactionFrames;
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
        'near', JSON.stringify(near), 'segs', JSON.stringify(segs),
        'decide', JSON.stringify(lastDecide));
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

// ---------------------------------------------------------------------------------------
// MULTI-SEED GATE. A single seed is one roll of the level generator, and a green single-seed
// run means very little: a change that merely reshuffles rnd() can move a latent failure in or
// out of view. RS-#090 shipped green on the default seed and failed seed 2, which is exactly
// the mistake this exists to make impossible. Running bare now sweeps every seed and reports
// one verdict. Use RS_SEED=<n> to drill into a single one, which skips the sweep.
const SEEDS = [20260703, 2, 3, 77, 1234, 555, 8888, 4242, 31337];
if (!process.env.RS_SEED && !process.env.RS_NO_SWEEP) {
  const { execFileSync } = require('child_process');
  console.log('\n=== MULTI-SEED SWEEP (' + SEEDS.length + ' seeds) ===');
  let failed = 0;
  for (const s of SEEDS) {
    let line = '';
    try {
      const out = execFileSync(process.execPath, [__filename], {
        env: { ...process.env, RS_SEED: String(s), RS_NO_SWEEP: '1' }, encoding: 'utf8',
      });
      line = out.trim().split('\n').pop();
    } catch (e) { line = 'RUN ERROR'; }
    const ok = line.includes('FAIL') === false && line !== 'RUN ERROR';
    if (!ok) failed++;
    console.log('  seed', String(s).padEnd(9), ok ? 'PASS' : 'FAIL  ' + line);
  }
  console.log('\n=== VERDICT ===', failed === 0
    ? 'PASS — fairness holds across all ' + SEEDS.length + ' seeds'
    : 'FAIL — ' + failed + ' of ' + SEEDS.length + ' seeds failed');
  if (failed !== 0) process.exitCode = 1;
}
