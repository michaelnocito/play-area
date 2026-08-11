/* ODD SOCK — SHIRT FEEL-LAB headless harness.  `node shirt-lab-harness.js`
   Guards the LINT BREAKER loop: kick the ball into the wall, dodge what the wall throws
   back, strip the ring, drop. The lab exists to answer one question ("is the kick worth
   chasing?"), and a human can only answer that if the loop underneath it is wired and
   the shrapnel is dodgeable, so both get proved here. */
'use strict';
const path = require('path');
const { load, suite } = require('../harness-lib');

const S = load(path.join(__dirname, 'proto/shirt-test.html'), {
  expose: ['mode', 'keys', 'shirts', 'lint', 'shrap', 'a', 'av', 'kicks', 'missed', 'knocks',
           'bestSweep', 'lintLeft', 'lintTotal', 'depth', 'moveT', 'ringNow', 'stShow',
           'update', 'reset', 'dive', 'rise', 'seedLint', 'launchShirt',
           'ringR', 'bandR', 'sockHW', 'kickArc', 'warn', 'riseSpd',
           'SPAWN_INT', 'RISE_MIN', 'DIVE_T', 'KNOCK_T', 'RING_R', 'RING_LAST', 'BAND_PX',
           'LINT_N', 'LINT_PER_RING', 'SOCK_PX', 'SHRAP_PX', 'SHRAP_VR', 'SHRAP_AV',
           'SWEEP_BASE', 'SWEEP_EDGE', 'SWEEP_SPD', 'SHIRT_TRAVEL', 'AV_MAX', 'CONTACT_PX',
           'RIM', 'angDiff']
});

const t = suite('odd sock — lint breaker');
const DT = 1 / 60;
const BEAT = S.SPAWN_INT;              // the real metronome, before the bench parks it

/* The metronome is the lab's whole point in a human's hands, but in a test it just
   sprays extra balls through every assertion. Park it and feed shirts by hand. */
function bench() { S.reset(); S.mode = 'play'; S.SPAWN_INT = 999; S.update(DT); }
function rising() { return S.shirts.find(s => s.on && !s.deflected && !s.sweeping); }
function sweeping() { return S.shirts.find(s => s.on && s.sweeping); }
function onWall() { return S.lint.filter(L => L.on).length; }
function shards() { return S.shrap.filter(s => s.on && !s.done); }
function settle() { let n = 0; while ((sweeping() || shards().length) && n++ < 600) S.update(DT); }

/** Feed one shirt and meet it at `off` radians from the centre of the swing. */
function meetOne(off) {
  S.launchShirt();
  const sh = rising();
  const stand = () => { S.a = sh.ang + (off || 0); S.av = 0; };
  stand();
  for (let i = 0; i < 500 && !sh.counted; i++) { S.update(DT); stand(); }
  return sh;
}

/* --- the wall is there to be broken ------------------------------------- */
bench();
t.ok('every ring comes seeded with a wall', S.lintTotal === S.LINT_N && S.lintLeft === S.LINT_N,
  S.lintLeft + ' clumps');
t.ok('the wall rides outside the ring you stand on, never on top of it',
  S.bandR() - S.ringR() === S.BAND_PX, S.BAND_PX + 'px out');

/* --- kick → sweep → lint off → shrapnel back ----------------------------- */
bench();
const before = onWall();
meetOne(0.02);
t.ok('a kick throws the shirt onto the wall band', !!sweeping());
let guard = 0;
while (sweeping() && guard++ < 400) S.update(DT);
t.ok('the sweep tears lint off the ring', onWall() < before, (before - onWall()) + ' clumps');
t.ok('every broken clump throws a shard back at you', shards().length === before - onWall(),
  shards().length + ' shards in the air');
/* The read the whole risk layer rests on: debris runs AHEAD of your own ball, so the
   safe move is against your sweep. If shards drifted the other way that lesson inverts. */
{
  const dirs = [];
  for (const off of [-0.2, 0.2]) {
    bench();
    const ball = meetOne(off);
    let n = 0;
    while (!shards().length && n++ < 200) S.update(DT);
    dirs.push({ ball: ball.swDir, shard: Math.sign(shards()[0].av) });
  }
  t.ok('a shard is thrown the way the ball went, both ways round',
    dirs.every(d => d.shard === d.ball) && dirs[0].ball === -dirs[1].ball,
    dirs.map(d => 'ball ' + d.ball + '/shard ' + d.shard).join('  '));
}

/* --- english: where you meet it decides how much of the ring it takes ---- */
bench(); meetOne(0.02); settle();
const centreHit = S.lintTotal - S.lintLeft;
bench(); meetOne(S.kickArc() * 0.97); settle();
const edgeHit = S.lintTotal - S.lintLeft;
t.note('centre hit cleared ' + centreHit + ', edge hit cleared ' + edgeHit + ' of ' + S.lintTotal);
t.ok('catching it at the edge of the swing clears more than a centre hit', edgeHit > centreHit);
t.ok('…but an edge hit is not a whole ring in one shot', edgeHit < S.lintTotal);

/* --- SHRAPNEL FAIRNESS — the gate that decides if this is hard or unfair --
   A shard is only honest if, standing directly under it on the TIGHTEST ring, you can
   still swing clear before it crosses. Warning is BAND_PX/SHRAP_VR; the arc you have to
   clear is your half-width plus the shard's. */
{
  S.reset(); S.depth = S.RING_LAST; S.ringNow = S.RING_R[S.RING_LAST];
  const warnS = S.BAND_PX / S.SHRAP_VR;
  const need = S.sockHW() + S.SHRAP_PX / S.ringR();
  // measured, not modelled: how far a standing start actually swings in that time
  S.mode = 'play'; S.a = 0; S.av = 0; S.keys.ArrowRight = true;
  let f = 0; while (f * DT < warnS) { S.update(DT); f++; }
  S.keys.ArrowRight = false;
  const swung = Math.abs(S.angDiff(S.a, 0));
  t.note('tightest ring: r=' + S.ringR().toFixed(0) + 'px, danger arc ' + need.toFixed(3) +
         ' rad, warning ' + warnS.toFixed(2) + 's, swing covers ' + swung.toFixed(3) + ' rad');
  t.ok('a shard is dodgeable from directly under it, even on the tightest ring',
    swung > need, swung.toFixed(2) + ' rad swung vs ' + need.toFixed(2) + ' needed');
  t.ok('the tightest ring really is tighter to dodge on than the first',
    S.SHRAP_PX / S.ringR() > S.SHRAP_PX / (S.RIM * S.RING_R[0]),
    ((S.RIM * S.RING_R[0]) / S.ringR()).toFixed(2) + '× the angular width');
}

/* --- a shard that catches you costs a ring ------------------------------- */
bench();
meetOne(0.02);
{
  let n = 0;
  while (!shards().length && n++ < 200) S.update(DT);      // the sweep has to reach a clump first
  const shard = shards()[0];
  t.ok('the sweep does throw a shard', !!shard);
  n = 0;
  while (shard && shard.on && !shard.done && n++ < 400) { S.a = shard.ang; S.av = 0; S.update(DT); }
}
t.ok('standing in a shard gets you hit', S.knocks === 1, S.knocks + ' hits');
t.ok('…but on ring 1 there is nowhere to be knocked back to, so the wall returns instead',
  S.depth === 0 && S.lintLeft === S.lintTotal, S.lintLeft + '/' + S.lintTotal + ' back up');

/* --- stripping the ring opens the way down ------------------------------- */
bench();
let balls = 0;
while (S.lintLeft > 0 && balls++ < 40) { meetOne(S.kickArc() * 0.97); settle(); }
t.ok('the ring can actually be stripped', S.lintLeft === 0, balls + ' balls');
t.ok('the last clump opens the way down', S.moveT > 0 && S.depth === 1);
t.ok('you drop past everything still in the air', !rising() && !sweeping() && !shards().length);

guard = 0;
while (S.moveT > 0 && guard++ < 300) S.update(DT);
t.ok('the dive lands inside a beat', guard * DT < BEAT, (guard * DT).toFixed(2) + 's of a ' + BEAT + 's beat');
t.ok('the dive lands you on a genuinely tighter ring', S.ringNow === S.RING_R[1],
  (S.RIM * S.RING_R[0]).toFixed(0) + 'px → ' + S.ringR().toFixed(0) + 'px');
t.ok('the new ring arrives with a fresh wall', S.lintLeft === S.LINT_N + S.LINT_PER_RING);

/* --- knocked back: the ring above, and its wall, both come back ---------- */
S.lintLeft = 3;
S.rise();
guard = 0;
while (S.moveT > 0 && guard++ < 300) S.update(DT);
t.ok('a knockback puts you back on the wider ring', S.depth === 0 && S.ringNow === S.RING_R[0]);
t.ok('…and the wall you had already stripped is back up', S.lintLeft === S.LINT_N);
t.ok('the knockback is quicker than the dive — it is a shove, not a ceremony',
  S.KNOCK_T < S.DIVE_T, S.KNOCK_T + 's vs ' + S.DIVE_T + 's');

/* --- a miss costs a ball and nothing else -------------------------------- */
bench();
const wall = onWall();
S.launchShirt();
const shM = rising();
for (let i = 0; i < 500 && !shM.counted; i++) { S.update(DT); S.a = shM.ang + Math.PI; S.av = 0; }
t.ok('a shirt that sails past is a miss', S.missed === 1);
t.ok('a rising shirt cannot strip the wall on its way out — only a kick does that',
  onWall() === wall, onWall() + ' still up');

/* --- the warning shrinks with the ring, but never past the floor --------- */
bench();
const w1 = S.warn();
S.depth = S.RING_LAST; S.ringNow = S.RING_R[S.RING_LAST];
t.note('warning: ring 1 ' + w1.toFixed(2) + 's → ring ' + (S.RING_LAST + 1) + ' ' + S.warn().toFixed(2) + 's');
t.ok('a tighter ring is a shorter climb, so the warning shrinks on its own', S.warn() < w1);
t.ok('…but never under the floor that keeps it swingable', S.warn() >= S.RISE_MIN);

/* --- GAME_BIBLE Part 5 rule 3: the cockpit is part of the build ---------- */
const DEV = S.__sandbox.__DEV;
t.ok('dev cockpit mounted', !!DEV && DEV.knobs.length === 15, DEV ? DEV.knobs.length + ' knobs' : 'missing');
if (DEV) {
  DEV.set('lintn', 12);
  t.ok('a knob writes straight through, and reseeds the wall it changed',
    S.LINT_N === 12 && S.lintTotal === 12);
  DEV.set('lintn', 9);
}

t.done();
