/* JADE FIST duel lab — headless feel harness.  `node duel-harness.js`
   JF-#067: rebuilt on the shared ../../harness-lib.js so every game's harness
   boots the same way (and loads the dev cockpit, so __DEV is reachable here).
   The assertions are unchanged from the JF-#065 pass. */
'use strict';
const path = require('path');
const { load, suite } = require('../../harness-lib');

const S = load(path.join(__dirname, 'duel-test.html'), {
  expose: ['Snd', 'P', 'E', 'mode', 'keys', 'hitStop', 'dodged', 'taken', 'chips',
           'counters', 'perfects', 'readyT', 'WINDUP', 'WIND_FLOOR', 'READY_DUR',
           'GAP', 'ORDER', 'update', 'reset', 'strike', 'highAction']
});
const noop = () => {};
S.Snd.ensure = noop; S.Snd.b = noop;

const t = suite('jade fist duel lab');
const ok = (n, c, e) => t.ok(n, c, e);

const run = () => S.update();
const settle = () => { let g = 0; while (S.hitStop > 0 && g++ < 60) run(); };
function answer(line){
  if (line === 'high') S.highAction();
  else if (line === 'sweep'){ S.keys.ArrowDown = true; run(); }
  else S.strike(-1);
}
function toWindup(line, maxG){
  let g = 0;
  while (g++ < (maxG || 6000)){
    if (S.E.st === 1 && S.E.atk === line) return true;
    if (S.E.st === 1){                       // answer whatever else comes so nothing lands free
      const l = S.E.atk;
      while (S.E.stT < 23 && S.E.st === 1) run();
      answer(l);
      let f = 0; while (!(S.E.st === 2 && S.E.hitDone) && S.E.st !== 5 && f++ < 200) run();
      settle(); S.keys.ArrowDown = false;
    } else run();
  }
  return false;
}

t.note('windup=' + S.WINDUP + '  floor=' + S.WIND_FLOOR + '  arm=' + S.READY_DUR +
       '  gap=' + S.GAP + '  order=' + S.ORDER.join('/'));

// --- 1. every line is dodgeable at a 23-frame (≈380ms) CHOICE reaction ---
const RT = 23;
for (const line of S.ORDER){
  S.reset(); S.mode = 'play';
  if (!toWindup(line)) { ok(line + ' reachable', false); continue; }
  const wind = S.E.wind, d0 = S.dodged;
  S.readyT = 0;                              // measure the dodge, not a counter
  while (S.E.stT < RT && S.E.st === 1) run();
  answer(line);
  let f = 0; while (!(S.E.st === 2 && S.E.hitDone) && f++ < 200) run();
  settle(); S.keys.ArrowDown = false;
  ok(line + ' dodged at a ' + RT + 'f reaction', S.dodged === d0 + 1, 'windup ' + wind + 'f, armed=' + (S.readyT > 0));
}

// --- 2. the latest reaction that still saves you (should be ~the impact frame) ---
for (const line of S.ORDER){
  let latest = -1, wind = 0;
  for (let rt = 1; rt < 40; rt++){
    S.reset(); S.mode = 'play';
    if (!toWindup(line)) break;
    wind = S.E.wind; if (rt >= wind) break;
    S.readyT = 0;                            // measure the dodge, not a counter
    while (S.E.stT < rt && S.E.st === 1) run();
    const d0 = S.dodged; answer(line);
    let f = 0; while (!(S.E.st === 2 && S.E.hitDone) && f++ < 200) run();
    settle(); S.keys.ArrowDown = false;
    if (S.dodged === d0 + 1) latest = rt;
  }
  ok(line + ' still dodgeable to the last frame', latest >= wind - 2,
     'latest ' + latest + 'f of a ' + wind + 'f windup');
}

// --- 3. guessing early must NOT save you ---
S.reset(); S.mode = 'play'; toWindup('mid');
while (S.E.stT < 4) run();
const dG = S.dodged; S.strike(-1);
let f1 = 0; while (!(S.E.st === 2 && S.E.hitDone) && f1++ < 200) run(); settle();
ok('guessing at frame 4 loses', S.dodged === dG, 'anticipation is not rewarded');

// --- 4. sweep is armored: punching into it gets you swept ---
S.reset(); S.mode = 'play'; toWindup('sweep');
while (S.E.stT < RT) run();
const t0 = S.taken; S.strike(1); settle();
ok('punching into the sweep gets you swept', S.taken === t0 + 1);

// --- 5. unarmed strike into a mid windup is a chip that does not stop the swing ---
S.reset(); S.mode = 'play'; toWindup('mid');
while (S.E.stT < S.E.wind * 0.5) run();
const c0 = S.chips; S.strike(1); settle();
const chipped = S.chips === c0 + 1;
const tk = S.taken;
let f2 = 0; while (!(S.E.st === 2 && S.E.hitDone) && f2++ < 200) run(); settle();
ok('unarmed strike chips and the swing still lands', chipped && S.taken === tk + 1);

// --- 6. the dodge->counter loop closes at the SHIPPED 110f arm window ---
S.reset(); S.mode = 'play'; S.READY_DUR = 110;
let cyc = 0, closed = 0, g = 0;
while (g++ < 8000 && cyc < 6){
  if (S.E.st !== 1){ run(); continue; }
  const l = S.E.atk;
  if (S.readyT > 0 && l !== 'sweep'){
    while (S.E.stT / S.E.wind < 0.72 && S.E.st === 1) run();
    const c = S.counters;
    if (l === 'high') S.highAction(); else S.strike(1);
    settle();
    if (S.counters === c + 1) closed++;
  } else {
    while (S.E.stT < RT && S.E.st === 1) run();
    answer(l);
  }
  let f = 0; while (!(S.E.st === 2 && S.E.hitDone) && S.E.st !== 5 && f++ < 200) run();
  settle(); S.keys.ArrowDown = false; cyc++;
  let h = 0; while (S.E.st !== 0 && S.E.st !== 1 && h++ < 400) run();
}
ok('dodge->counter closes at the shipped 110f arm', closed >= 2,
   closed + ' counters landed over ' + cyc + ' attacks; taken=' + S.taken);

// --- 7. JF-#067: the cockpit is wired and non-load-bearing ---
const DEV = S.__sandbox.__DEV;
ok('dev cockpit mounted with the lab numbers on knobs', !!DEV && DEV.knobs.length >= 4);
if (DEV){
  const before = S.WINDUP;
  DEV.set('windup', S.WIND_FLOOR + 6);
  ok('a cockpit knob writes straight through to the real number', S.WINDUP === S.WIND_FLOOR + 6);
  DEV.set('windup', before);
  ok('the numbers dump is one pasteable line', /^TUNING jade-fist-duel \|/.test(DEV.dump()));
}

t.done();
