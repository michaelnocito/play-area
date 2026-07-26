/* ===========================================================================
   HARNESS LIB — the headless half of the dev cockpit.
   ===========================================================================
   Control 10 of BUILD_PILLARS "A. The dev cockpit": an agent must be able to
   prove a change kept the feel budget without asking a human to play. This is
   the shared plumbing so a per-game harness is thirty lines instead of a
   hundred and fifty.

   USE
   ---
       const { load, expose, suite } = require('../harness-lib');
       const S = load(__dirname + '/index.html', {
         expose: ['P', 'enemies', 'update', 'reset', 'WINDUP']
       });
       const t = suite('rooftop-sprint');
       t.ok('player survives a clean run', ... );
       t.done();                       // exits 1 if anything failed

   WHY IT LOOKS LIKE THIS
   ----------------------
   Top-level let/const in a game script are NOT properties of the vm sandbox
   object; they live in the context's lexical scope. A second runInContext in
   the same context can still see them, so `expose` builds a getter/setter
   bridge rather than reading off the sandbox. This is the single sharpest edge
   in the whole approach and it cost a session to find the first time.
   =========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const noop = () => {};

/* A canvas 2D context that swallows everything and returns something plausible
   for the few calls that are read back. */
function makeCtx() {
  return new Proxy({}, {
    get: (t, k) => {
      if (k === 'createLinearGradient' || k === 'createRadialGradient' || k === 'createPattern')
        return () => ({ addColorStop: noop });
      if (k === 'measureText') return () => ({ width: 10 });
      if (k === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
      return typeof k === 'string' ? noop : undefined;
    },
    set: () => true
  });
}

function makeCanvas(w, h) {
  const ctx = makeCtx();
  return {
    width: w, height: h, style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop },
    getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: w, height: h }),
    addEventListener: noop, removeEventListener: noop, appendChild: noop, focus: noop,
    setAttribute: noop, getAttribute: () => null, remove: noop, click: noop,
    querySelector: () => null, querySelectorAll: () => []
  };
}

/**
 * Load a game's inline <script> into a sandbox and hand back a live API bridge.
 * @param {string} file      path to the .html
 * @param {object} [opt]
 * @param {string[]} [opt.expose]   top-level names to bridge (getter + setter)
 * @param {number} [opt.width]      viewport width  (default 960)
 * @param {number} [opt.height]     viewport height (default 540)
 * @param {number} [opt.script]     which <script> block, if the file has several (default: the biggest)
 * @param {object} [opt.globals]    extra globals to inject before the script runs
 */
function load(file, opt) {
  opt = opt || {};
  const html = fs.readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(m => m[1])
    .filter(s => s.trim().length);
  if (!blocks.length) throw new Error('no inline <script> in ' + file);
  const src = opt.script != null ? blocks[opt.script]
    : blocks.reduce((a, b) => (b.length > a.length ? b : a));

  const W = opt.width || 960, H = opt.height || 540;
  const el = makeCanvas(W, H);
  const store = {};

  const sandbox = Object.assign({
    document: {
      getElementById: () => el, createElement: () => makeCanvas(W, H),
      querySelector: () => el,
      // A real page returns nodes here, and boot code indexes straight into the
      // result (`querySelectorAll('#overlay p')[0].innerHTML = ...`). An empty
      // array throws before a single test runs, so hand back stubs.
      querySelectorAll: () => Array.from({ length: 8 }, () => makeCanvas(W, H)),
      addEventListener: noop, removeEventListener: noop,
      body: { appendChild: noop, style: {} },
      documentElement: { style: {}, clientWidth: W, clientHeight: H },
      readyState: 'complete', hidden: false
    },
    location: { search: '', hostname: 'localhost', protocol: 'http:', href: 'http://localhost/' },
    navigator: { userAgent: 'harness', maxTouchPoints: 0, clipboard: { writeText: noop } },
    localStorage: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: k => { delete store[k]; }, clear: () => { for (const k in store) delete store[k]; }
    },
    addEventListener: noop, removeEventListener: noop, dispatchEvent: noop,
    innerWidth: W, innerHeight: H, devicePixelRatio: 1,
    requestAnimationFrame: noop, cancelAnimationFrame: noop,
    setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
    performance: { now: () => 0 },
    matchMedia: () => ({ matches: false, addEventListener: noop, addListener: noop }),
    URL: { createObjectURL: () => 'blob:', revokeObjectURL: noop },
    Blob: function () {},
    AudioContext: function () { return new Proxy({}, { get: () => () => ({}) }); },
    webkitAudioContext: function () { return new Proxy({}, { get: () => () => ({}) }); },
    // A vm context already has the JS intrinsics (Math, JSON, Promise, typed
    // arrays...). Only host objects have to be supplied, and a game reaching for
    // one of these and finding it missing throws at parse-and-run, not in a test.
    URLSearchParams, TextEncoder, TextDecoder, structuredClone, queueMicrotask,
    crypto: { getRandomValues: a => a, randomUUID: () => 'harness' },
    fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve({}), text: () => Promise.resolve('') }),
    Image: function () { return makeCanvas(1, 1); },
    Audio: function () { return { play: noop, pause: noop, addEventListener: noop, volume: 1 }; },
    Event: function () {}, CustomEvent: function () {},
    ResizeObserver: function () { return { observe: noop, disconnect: noop }; },
    IntersectionObserver: function () { return { observe: noop, disconnect: noop }; },
    MutationObserver: function () { return { observe: noop, disconnect: noop }; },
    screen: { width: W, height: H, orientation: { type: 'landscape-primary', addEventListener: noop } },
    history: { pushState: noop, replaceState: noop },
    alert: noop, prompt: () => null, confirm: () => false,
    console
  }, opt.globals || {});
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;

  vm.createContext(sandbox);

  // Local <script src="..."> files run first, in document order, exactly as the
  // browser would. This is how the harness gets the shared dev cockpit, which
  // means __DEV is reachable from tests. Remote URLs are skipped.
  [...html.matchAll(/<script[^>]*\ssrc=["']([^"']+)["'][^>]*>/g)]
    .map(m => m[1])
    .filter(s => !/^(https?:)?\/\//.test(s))
    .forEach(rel => {
      const p = path.resolve(path.dirname(file), rel);
      if (!fs.existsSync(p)) return;
      vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: p });
    });

  vm.runInContext(src, sandbox, { filename: file });

  if (opt.expose && opt.expose.length) {
    const body = opt.expose.map(n =>
      `get ${n}(){return typeof ${n}==='undefined'?undefined:${n}}, ` +
      `set ${n}(v){try{${n}=v}catch(e){}}`).join(', ');
    vm.runInContext('globalThis.__api = {' + body + '};', sandbox);
  } else {
    vm.runInContext('globalThis.__api = {};', sandbox);
  }
  const api = sandbox.__api;
  Object.defineProperty(api, '__sandbox', { value: sandbox, enumerable: false });
  Object.defineProperty(api, '__eval', {
    value: expr => vm.runInContext(expr, sandbox), enumerable: false
  });
  return api;
}

/** Bridge more names after the fact, when a test turns out to need them. */
function expose(api, names) {
  const body = names.map(n =>
    `get ${n}(){return typeof ${n}==='undefined'?undefined:${n}}, ` +
    `set ${n}(v){try{${n}=v}catch(e){}}`).join(', ');
  api.__eval('Object.assign(globalThis.__api, {' + body + '});');
  return api;
}

/** Tiny pass/fail reporter so every game's harness prints the same way. */
function suite(name) {
  let pass = 0, fail = 0;
  console.log('\n' + name.toUpperCase() + ' — headless feel harness\n');
  return {
    ok(label, cond, extra) {
      cond ? pass++ : fail++;
      console.log((cond ? '  PASS  ' : '  FAIL  ') + label + (extra ? '   [' + extra + ']' : ''));
      return !!cond;
    },
    note(msg) { console.log('        ' + msg); },
    /** Report a measured number alongside the budget it has to respect. */
    budget(label, actual, max, unit) {
      const okd = actual <= max;
      return this.ok(label, okd, actual + (unit || '') + ' of ' + max + (unit || ''));
    },
    done() {
      console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
      process.exit(fail ? 1 : 0);
    }
  };
}

module.exports = { load, expose, suite, makeCanvas, makeCtx };
