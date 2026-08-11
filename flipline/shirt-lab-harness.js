/* ODD SOCK — SHIRT FEEL-LAB headless harness.  `node shirt-lab-harness.js`
   Guards the STATIC KICK loop: kick → charge → dive a ring. The lab exists to
   answer one question ("does the kick feel worth chasing?"), and a human can
   only answer that if the loop underneath it is actually wired, so the wiring
   gets proved here and Mike's session gets spent on feel. */
'use strict';
const path = require('path');
const { load, suite } = require('../harness-lib');

const S = load(path.join(__dirname, 'proto/shirt-test.html'), {
  expose: ['mode', 'keys', 'shirts', 'a', 'av', 'kicks', 'chain', 'missed', 'depth',
           'diveT', 'ringPh', 'stShow', 'update', 'reset', 'dive', 'launchShirt', 'riseTime',
           'SPAWN_INT', 'RISE_MIN', 'DEPTH_RAMP', 'DIVE_T', 'CONTACT_ARC', 'KICKS_PER_RING',
           'SHIRT_TRAVEL', 'AV_MAX', 'NUDGE_ACC', 'LAT_DRAG', 'HITHI', 'TAU', 'angDiff']
});

const t = suite('odd sock — shirt lab');
const DT = 1 / 60;
const BEAT = S.SPAWN_INT;              // the real metronome, before the bench parks it
const step = n => { for (let i = 0; i < n; i++) S.update(DT); };

/* The metronome is the lab's whole point in a human's hands, but in a test it
   just sprays extra shirts through every assertion. Park it and drive by hand. */
function bench() { S.reset(); S.mode = 'play'; S.SPAWN_INT = 999; S.update(DT); }
function inFlight() { return S.shirts.find(s => s.on && !s.deflected); }

/** Launch one shirt, stand the sock exactly on its lane, and let it arrive. */
function meetOne() {
  S.launchShirt();
  const sh = inFlight();
  S.a = sh.ang; S.av = 0;
  for (let i = 0; i < 400 && !sh.counted; i++) { S.update(DT); S.a = sh.ang; S.av = 0; }
  return sh;
}

/* --- the kick itself ----------------------------------------------------- */
bench();
meetOne();
t.ok('swinging into a shirt lands a kick', S.kicks === 1 && S.chain === 1,
  'kicks ' + S.kicks + ' chain ' + S.chain);

/* --- three in a row buys the ring ---------------------------------------- */
bench();
meetOne(); meetOne();
t.ok('two kicks is not enough charge', S.diveT === 0 && S.depth === 0,
  'chain ' + S.chain + '/' + S.KICKS_PER_RING);
meetOne();
t.ok(S.KICKS_PER_RING + ' kicks in a row spends the static on a dive', S.diveT > 0);
t.ok('the dive resets the chain, so the next ring is earned fresh', S.chain === 0);
t.ok('you drop past whatever was still rising', !inFlight());

/* Hit-stop freezes the whole update, dive included, so step to the landing
   rather than assuming DIVE_T worth of frames covers it. */
let guard = 0;
while (S.diveT > 0 && guard++ < 300) S.update(DT);
t.ok('the dive lands inside a beat, hit-stop and all', guard * DT < BEAT,
  (guard * DT).toFixed(2) + 's of a ' + BEAT + 's beat');
t.ok('the dive lands you one ring deeper', S.depth === 1, 'ring ' + (S.depth + 1));
t.ok('the walls wrap cleanly instead of drifting', S.ringPh === 0, 'ringPh ' + S.ringPh);
t.ok('the clock starts again after the dive, not during it', S.diveT === 0);

/* --- a miss costs the charge and nothing else ---------------------------- */
bench();
meetOne();
const before = S.kicks;
S.launchShirt();
const sh = inFlight();
S.a = sh.ang + Math.PI; S.av = 0;                 // stand on the far side and let it go by
for (let i = 0; i < 400 && !sh.counted; i++) { S.update(DT); S.a = sh.ang + Math.PI; S.av = 0; }
t.ok('a shirt that sails past is a miss', S.missed === 1);
t.ok('a miss drains the static back to nothing', S.chain === 0);
t.ok('a miss costs no kicks — it is still practice', S.kicks === before);

/* --- the depth ramp cannot outrun a swing -------------------------------- */
bench();
t.note('rise at ring 1 ' + S.riseTime().toFixed(2) + 's · ramp ×' + S.DEPTH_RAMP + '/ring');
S.depth = 50;
t.ok('the depth ramp floors instead of shrinking forever', S.riseTime() === S.RISE_MIN,
  S.riseTime().toFixed(2) + 's at ring 51');

/* The tightest warning the game can ever give is RISE_MIN, and with lanes
   shuffled the worst swing is half the drum. If that crossing does not fit
   inside the warning, the deep rings are unfair rather than hard. */
bench();
S.a = 0; S.av = 0; S.keys.ArrowRight = true;
let f = 0;
while (f < 600 && Math.abs(S.angDiff(S.a, Math.PI)) > S.CONTACT_ARC) { S.update(DT); f++; }
S.keys.ArrowRight = false;
const cross = f * DT;
t.ok('half a drum is still swingable inside the tightest warning', cross < S.RISE_MIN,
  cross.toFixed(2) + 's to cross vs ' + S.RISE_MIN + 's of rise');
t.note('at ring 1 that crossing uses ' + (100 * cross / S.SHIRT_TRAVEL).toFixed(0) +
       '% of the shirt\'s rise; at the floor it uses ' + (100 * cross / S.RISE_MIN).toFixed(0) + '%');

/* --- GAME_BIBLE Part 5 rule 3: the cockpit is part of the build ---------- */
const DEV = S.__sandbox.__DEV;
t.ok('dev cockpit mounted', !!DEV && DEV.knobs.length === 9, DEV ? DEV.knobs.length + ' knobs' : 'missing');
if (DEV) {
  DEV.set('perring', 5);
  t.ok('a knob writes straight through to the real value', S.KICKS_PER_RING === 5);
  DEV.set('perring', 3);
}

t.done();
