/* ODD SOCK — SHIRT FEEL-LAB headless harness.  `node shirt-lab-harness.js`
   Guards the LINT BREAKER loop: kick the ball into the wall, strip the ring, drop.
   The lab exists to answer one question ("is the kick worth chasing?"), and a human
   can only answer that if the loop underneath it is actually wired, so the wiring
   gets proved here and Mike's session gets spent on feel. */
'use strict';
const path = require('path');
const { load, suite } = require('../harness-lib');

const S = load(path.join(__dirname, 'proto/shirt-test.html'), {
  expose: ['mode', 'keys', 'shirts', 'lint', 'a', 'av', 'kicks', 'missed', 'bestSweep',
           'lintLeft', 'lintTotal', 'depth', 'diveT', 'ringPh', 'stShow',
           'update', 'reset', 'dive', 'seedLint', 'launchShirt', 'riseTime',
           'SPAWN_INT', 'RISE_MIN', 'DEPTH_RAMP', 'DIVE_T', 'CONTACT_ARC', 'LINT_N',
           'LINT_PER_RING', 'LINT_HW', 'SWEEP_BASE', 'SWEEP_EDGE', 'SWEEP_SPD',
           'SHIRT_TRAVEL', 'AV_MAX', 'HITHI', 'angDiff']
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

/** Feed one shirt and meet it at `off` radians from the centre of the swing. */
function meetOne(off) {
  S.launchShirt();
  const sh = rising();
  const stand = () => { S.a = sh.ang + (off || 0); S.av = 0; };
  stand();
  for (let i = 0; i < 400 && !sh.counted; i++) { S.update(DT); stand(); }
  return sh;
}
/** Run a swept shirt out to the end of its arc. */
function letSweep() { for (let i = 0; i < 400 && sweeping(); i++) S.update(DT); }

/* --- the wall is there to be broken ------------------------------------- */
bench();
t.ok('ring 1 comes seeded with a wall', S.lintTotal === S.LINT_N && S.lintLeft === S.LINT_N,
  S.lintLeft + ' clumps');
t.ok('the clumps are spread, not stacked',
  new Set(S.lint.filter(L => L.on).map(L => L.ang.toFixed(3))).size === S.LINT_N);

/* --- kick → the shirt sweeps → lint comes off ---------------------------- */
bench();
const before = onWall();
meetOne(0.02);
t.ok('a kick throws the shirt onto the wall band', !!sweeping());
letSweep();
t.ok('the sweep tears lint off the ring', onWall() < before,
  (before - onWall()) + ' clumps off a centre hit');
t.ok('a kick counts as a kick', S.kicks === 1);

/* --- english: where you meet it decides how much of the ring it takes ---- */
bench();
meetOne(0.02); letSweep();
const centreHit = S.lintTotal - S.lintLeft;
bench();
meetOne(S.CONTACT_ARC * 0.97); letSweep();
const edgeHit = S.lintTotal - S.lintLeft;
t.note('centre hit cleared ' + centreHit + ', edge hit cleared ' + edgeHit +
       ' of ' + S.lintTotal);
t.ok('catching it at the edge of the swing clears more than a centre hit',
  edgeHit > centreHit);
t.ok('…but an edge hit is not a whole ring in one shot', edgeHit < S.lintTotal);

/* --- the shirt leaves the wall the way it was hit ------------------------ */
/* Read swDir out on the spot — shirts come from a 5-slot pool, so holding the object
   across a bench() reset hands you whatever the next run put in that slot. */
bench();
const dirL = meetOne(-0.2).swDir;     // sock stands anticlockwise of the shirt…
bench();
const dirR = meetOne(0.2).swDir;      // …and the mirror of that
t.ok('the shirt is thrown away from the side you caught it', dirL === 1, 'swDir ' + dirL);
t.ok('…and mirrored when you catch it on the other side', dirR === -dirL, dirL + ' vs ' + dirR);

/* --- stripping the ring opens the way down ------------------------------- */
bench();
let balls = 0;
while (S.lintLeft > 0 && balls++ < 40) { meetOne(S.CONTACT_ARC * 0.97); letSweep(); }
t.ok('the ring can actually be stripped', S.lintLeft === 0, balls + ' balls');
t.ok('the last clump opens the way down', S.diveT > 0);
t.ok('you drop past everything still in the air', !rising() && !sweeping());

let guard = 0;
while (S.diveT > 0 && guard++ < 300) S.update(DT);
t.ok('the dive lands inside a beat', guard * DT < BEAT, (guard * DT).toFixed(2) + 's of a ' + BEAT + 's beat');
t.ok('the dive lands you one ring deeper', S.depth === 1, 'ring ' + (S.depth + 1));
t.ok('the walls wrap cleanly instead of drifting', S.ringPh === 0, 'ringPh ' + S.ringPh);
t.ok('the new ring arrives with a thicker wall', S.lintLeft === S.LINT_N + S.LINT_PER_RING,
  S.lintLeft + ' clumps on ring 2');

/* --- a miss costs a ball and nothing else -------------------------------- */
bench();
const wall = onWall();
S.launchShirt();
const sh = rising();
for (let i = 0; i < 400 && !sh.counted; i++) { S.update(DT); S.a = sh.ang + Math.PI; S.av = 0; }
t.ok('a shirt that sails past is a miss', S.missed === 1);
t.ok('a rising shirt cannot strip the wall on its way out — only a kick does that',
  onWall() === wall, onWall() + ' still up');

/* --- the depth ramp cannot outrun a swing -------------------------------- */
bench();
t.note('rise at ring 1 ' + S.riseTime().toFixed(2) + 's · ramp ×' + S.DEPTH_RAMP + '/ring');
S.depth = 50;
t.ok('the depth ramp floors instead of shrinking forever', S.riseTime() === S.RISE_MIN,
  S.riseTime().toFixed(2) + 's at ring 51');

/* The tightest warning the game can ever give is RISE_MIN, and with lanes shuffled
   the worst swing is half the drum. If that crossing does not fit inside the
   warning, the deep rings are unfair rather than hard. */
bench();
S.a = 0; S.av = 0; S.keys.ArrowRight = true;
let f = 0;
while (f < 600 && Math.abs(S.angDiff(S.a, Math.PI)) > S.CONTACT_ARC) { S.update(DT); f++; }
S.keys.ArrowRight = false;
const cross = f * DT;
t.ok('half a drum is still swingable inside the tightest warning', cross < S.RISE_MIN,
  cross.toFixed(2) + 's to cross vs ' + S.RISE_MIN + 's of rise');

/* --- GAME_BIBLE Part 5 rule 3: the cockpit is part of the build ---------- */
const DEV = S.__sandbox.__DEV;
t.ok('dev cockpit mounted', !!DEV && DEV.knobs.length === 14, DEV ? DEV.knobs.length + ' knobs' : 'missing');
if (DEV) {
  DEV.set('lintn', 12);
  t.ok('a knob writes straight through, and reseeds the wall it changed',
    S.LINT_N === 12 && S.lintTotal === 12);
  DEV.set('lintn', 9);
}

t.done();
