/* Headless harness for jade-fist/proto/duel-test.html — stub the DOM, run the
   real update()/strike()/highAction() logic, assert the reaction budget. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const FILE = path.join(__dirname, 'duel-test.html');
const html = fs.readFileSync(FILE, 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('no script block'); process.exit(1); }

const noop = () => {};
const ctxStub = new Proxy({}, { get: (t, k) => {
  if (k === 'createLinearGradient' || k === 'createRadialGradient')
    return () => ({ addColorStop: noop });
  if (k === 'measureText') return () => ({ width: 10 });
  return typeof k === 'string' ? noop : undefined;
}, set: () => true });
const canvasStub = { width: 0, height: 0, style: {}, getContext: () => ctxStub,
                     getBoundingClientRect: () => ({ left: 0, top: 0, width: 960, height: 540 }) };
const sandbox = {
  document: { getElementById: () => canvasStub, createElement: () => canvasStub },
  addEventListener: noop, removeEventListener: noop,
  innerWidth: 960, innerHeight: 540, devicePixelRatio: 1,
  requestAnimationFrame: noop, performance: { now: () => 0 },
  console, Math, JSON, Date,
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(m[1], sandbox, { filename: 'duel-test.html' });

// top-level let/const live in the context's global LEXICAL scope, not on the
// sandbox object — a second script in the same context can still see them, so
// expose live bindings through getters.
vm.runInContext(`globalThis.__api = {
  get Snd(){return Snd}, get P(){return P}, get E(){return E},
  get mode(){return mode}, set mode(v){mode=v},
  get keys(){return keys}, get hitStop(){return hitStop},
  get dodged(){return dodged}, get taken(){return taken}, get chips(){return chips},
  get counters(){return counters}, get perfects(){return perfects},
  get readyT(){return readyT}, set readyT(v){readyT=v},
  get WINDUP(){return WINDUP}, get WIND_FLOOR(){return WIND_FLOOR},
  get READY_DUR(){return READY_DUR}, set READY_DUR(v){READY_DUR=v},
  get GAP(){return GAP}, get ORDER(){return ORDER},
  update, reset, strike, highAction
};`, sandbox);
const S = sandbox.__api;
S.Snd.ensure = noop; S.Snd.b = noop;

let pass = 0, fail = 0;
const ok = (name, cond, extra) => { (cond ? pass++ : fail++);
  console.log((cond ? '  PASS  ' : '  FAIL  ') + name + (extra ? '   [' + extra + ']' : '')); };

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

console.log('\nJADE FIST duel-test — headless regression');
console.log('windup=' + S.WINDUP + '  floor=' + S.WIND_FLOOR + '  arm=' + S.READY_DUR +
            '  gap=' + S.GAP + '  order=' + S.ORDER.join('/') + '\n');

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

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
process.exit(fail ? 1 : 0);
