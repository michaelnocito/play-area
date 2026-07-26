/* ODD SOCK (flipline) — headless feel harness.  `node flipline-harness.js`
   Guards the two arcs the whole game is made of: the downline flip and the
   upline glide. Both are pure kinematics, so a bad tuning session fails here
   instead of in Mike's hands. */
'use strict';
const path = require('path');
const { load, suite } = require('../harness-lib');

const S = load(path.join(__dirname, 'index.html'), {
  expose: ['GRAV', 'FLIPKICK', 'SPEED0', 'SPEEDMX', 'RAMP', 'GLIDE_LIFT', 'GLIDE_GRAV',
           'GLIDE_VMAX', 'WALL', 'VH', 'HMIN', 'HMAX', 'SKY_HMAX', 'SKY_GAPMIN',
           'GAP0', 'GAPMIN', 'devNoFail', 'mode']
});

const t = suite('odd sock');

/* --- the downline flip: ceiling-to-floor has to be crossable ------------- */
const span = S.VH - S.WALL * 2;                       // inner height, wall to wall
const crossT = Math.sqrt(2 * span / S.GRAV);          // seconds to fall the full span
t.note('span=' + span + 'px  cross=' + (crossT * 1000).toFixed(0) + 'ms at ' +
       S.SPEED0 + '-' + S.SPEEDMX + 'px/s');

t.ok('a flip crosses the lane in under half a second', crossT < 0.5,
  (crossT * 1000).toFixed(0) + 'ms');
t.ok('the flip kick is a snap, not a launch', S.FLIPKICK < S.GRAV / 8,
  'kick ' + S.FLIPKICK + ' vs gravity ' + S.GRAV);

/* At top speed the world still has to give you a flip's worth of warning
   before the tightest spacing arrives. */
const warnAtMax = S.GAPMIN / S.SPEEDMX;
t.ok('the tightest spacing still leaves time for a flip at top speed',
  warnAtMax > crossT, (warnAtMax * 1000).toFixed(0) + 'ms of warning');

/* --- the upline glide: the arc has to clear a floor jut ------------------ */
const apex = (S.GLIDE_LIFT * S.GLIDE_LIFT) / (2 * S.GLIDE_GRAV);
t.note('glide apex ' + apex.toFixed(0) + 'px vs tallest floor jut ' + S.SKY_HMAX + 'px');
t.ok('the glide clears the tallest floor jut', apex > S.SKY_HMAX,
  apex.toFixed(0) + 'px vs ' + S.SKY_HMAX + 'px');
t.ok('the glide does not clear the whole lane (it is a hop, not flight)',
  apex < span, apex.toFixed(0) + 'px vs a ' + span + 'px lane');

/* SKY_GAPMIN carries the comment "GAPMIN > max jump reach (~219px@cap) so you
   never land ON a jut". An uncancelled glide at top speed actually travels
   further than that, so either the 219 is stale or it was measured with the
   second-tap cancel included. Reported rather than asserted: which number is
   wrong is Mike's call, and a naive kinematic model is not evidence enough to
   fail a build over. */
const reach = (2 * S.GLIDE_LIFT / S.GLIDE_GRAV) * S.SPEEDMX;
t.note('CHECK: an uncancelled glide at top speed carries ' + reach.toFixed(0) +
       'px, but SKY_GAPMIN is ' + S.SKY_GAPMIN + 'px and its comment assumes ' +
       '~219px. If the 219 is stale you can land on a jut at cap speed.');

/* --- GAME_BIBLE Part 5 rule 3 -------------------------------------------- */
t.ok('no-fail is off by default', S.devNoFail === false);
const DEV = S.__sandbox.__DEV;
t.ok('dev cockpit mounted', !!DEV && DEV.knobs.length === 6);
if (DEV) {
  DEV.set('grav', 5000);
  t.ok('a knob writes straight through to the real value', S.GRAV === 5000);
  DEV.set('grav', 4200);
  t.ok('the numbers dump is one pasteable line', /^TUNING odd-sock \|/.test(DEV.dump()));
}

t.done();
