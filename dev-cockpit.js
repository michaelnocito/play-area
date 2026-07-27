/* ===========================================================================
   DEV COCKPIT — shared instrument panel for every play-area game and lab.
   ===========================================================================
   This is the implementation of BUILD_PILLARS.md "A. The dev cockpit" and
   GAME_BIBLE.md Part 5. One file, loaded by every game, so the eleven standard
   controls are written once and only the knob list differs per game.

   HOW A GAME USES IT
   ------------------
   In index.html, inside DEV:BEGIN / DEV:END strip markers:

       <script src="../dev-cockpit.js"></script>          // ../ from a game folder
       <script>
       const DC = DevCockpit.mount({
         game: 'deadroot',
         knobs: [
           { key:'grabSlow', label:'Grabber slow %', min:0, max:0.9, step:0.05,
             get:()=>CFG.towers.grabber.slow, set:v=>CFG.towers.grabber.slow=v },
         ],
         toggles: [ { key:'god', label:'God mode', get:()=>godMode, set:v=>godMode=v } ],
         actions: [ { label:'spawn a scav', run:()=>spawnEnemy('scav') } ],
         reset:   () => restartRun(),
       });
       </script>

   THE ELEVEN CONTROLS (each one earns its place from a pillar)
   ------------------------------------------------------------
    1. Every feel number on a slider, live, with its value on screen   `knobs`
    2. One-key NUMBERS DUMP — pasteable line + a downloadable file     `D`
    3. Force-spawn any enemy / force any state                         `actions`
    4. Freeze + single-frame step                                      `P` / `.`
     5. Slow-motion — the same slider, below 1x                        speed row
    6. Reaction readout — telegraph→input in frames, hit or miss       `DC.telegraph()`
    7. No-fail toggle                                                  `toggles`
    8. Instant reset to the rep                                        `R` / `reset`
    9. Hitbox / window / telegraph overlay                             `DC.flags.boxes`
   10. Headless harness hook                                           `window.__DEV`
   11. ACTION SPEED — a live 0.05x..3x slider, plus [ and ]            speed row

   RULES (GAME_BIBLE Part 5, restated because they are easy to break)
   ------------------------------------------------------------------
   - Gated behind ?dev=1 (auto-on for localhost and file://). Players never see it.
   - Nothing in here is load-bearing. Delete the whole block and the game runs
     identically. Knobs write to config the game already reads; they add nothing.
   - Strip DEV:BEGIN..END before any store submission.

   NOTE ON FREEZE / STEP / SPEED: the cockpit wraps requestAnimationFrame while
   it is mounted. That is how freeze, single-frame step, and the speed multiplier
   work in every game without per-game wiring. Games that derive dt from the rAF
   timestamp get slow-motion for free; games on a fixed step get it by reading
   DevCockpit.timeScale, or by the cockpit ticking them repeatedly for speed-up.
   =========================================================================== */
(function (global) {
  'use strict';

  var Q = new URLSearchParams(global.location ? global.location.search : '');
  var host = (global.location && global.location.hostname) || '';
  var ON = Q.has('dev') || host === 'localhost' || host === '127.0.0.1' ||
           (global.location && global.location.protocol === 'file:');

  /* ---- rAF interception: the engine behind freeze / step / speed ---------- */
  var rafReal = global.requestAnimationFrame ? global.requestAnimationFrame.bind(global) : null;
  var frozen = false;      // P
  var stepOnce = 0;        // . — release exactly one frame
  var speed = 1;           // 0.05 .. 3, the ACTION SPEED slider
  var frameNo = 0;         // monotonic frame counter, the unit of the reaction readout
  var virtualNow = 0;      // scaled clock handed to games that read the rAF timestamp
  var lastReal = null;

  var ticking = false;     // inside a tick burst — see the re-entrancy note below
  var queuedCb = null;

  function installRAF() {
    if (!rafReal || global.requestAnimationFrame.__dc) return;

    function patched(cb) {
      // RE-ENTRANCY. Nearly every loop here is `function frame(t){ rAF(frame); ... }`,
      // so the game re-registers from inside its own callback. If we tick it four
      // times for 4x speed, four registrations come back and the loop grows 4^n.
      // While a burst is running we capture the registration instead of scheduling
      // it, then schedule exactly one at the end.
      if (ticking) { queuedCb = cb; return 0; }
      return rafReal(function (t) {
        if (lastReal === null) lastReal = t;
        var realDt = t - lastReal;
        lastReal = t;

        var ticks, scale;
        if (frozen && stepOnce <= 0) {
          ticks = 1; scale = 0;              // held: dt of 0, so nothing moves but the game still draws
        } else if (frozen) {
          stepOnce--; ticks = 1; scale = 1;  // one honest frame
        } else if (speed > 1) {
          ticks = Math.max(1, Math.round(speed));   // fixed-step games need extra ticks
          scale = speed / ticks;
        } else {
          ticks = 1; scale = speed;          // slow-mo comes free to any dt-from-timestamp game
        }

        ticking = true; queuedCb = null;
        for (var i = 0; i < ticks; i++) {
          virtualNow += realDt * scale;
          if (scale > 0) frameNo++;   // a held frame is not a frame; the reaction readout counts game frames
          cb(virtualNow);
        }
        ticking = false;
        if (queuedCb) { var n = queuedCb; queuedCb = null; patched(n); }
      });
    }
    patched.__dc = true;
    global.requestAnimationFrame = patched;
  }

  /* ---- reaction readout -------------------------------------------------- */
  // DC.telegraph('sweep')  when a tell starts
  // DC.input('down', true) when the player answers; logs frames elapsed + verdict
  var pending = {};        // name -> frame the telegraph began
  var reactions = [];      // newest last, capped

  /* ---- the panel --------------------------------------------------------- */
  var CSS_PANEL = 'position:fixed;top:8px;left:8px;z-index:99999;font:12px/1.45 ui-monospace,Menlo,Consolas,monospace;' +
    'color:#dfe6ea;background:rgba(12,14,18,0.93);border:1px solid #3d4a58;border-radius:8px;padding:10px 12px;' +
    'width:246px;max-height:94vh;overflow-y:auto;display:none;box-shadow:0 6px 22px rgba(0,0,0,.55)';
  var CSS_TAB = 'position:fixed;top:8px;left:8px;z-index:100000;font:bold 12px ui-monospace,monospace;color:#dfe6ea;' +
    'background:rgba(12,14,18,0.88);border:1px solid #3d4a58;border-radius:8px;padding:6px 10px;cursor:pointer';
  var CSS_BTN = 'display:block;width:100%;margin:3px 0;padding:6px;font:11px ui-monospace,monospace;color:#dfe6ea;' +
    'background:#1d2530;border:1px solid #3d4a58;border-radius:6px;cursor:pointer;text-align:left';

  function dec(step) { return step < 0.1 ? 2 : step < 1 ? 1 : 0; }

  function mount(cfg) {
    cfg = cfg || {};
    var knobs = cfg.knobs || [];
    var toggles = cfg.toggles || [];
    var actions = cfg.actions || [];
    var name = cfg.game || 'game';

    // The API object exists whether or not the cockpit is on, so game code can
    // call DC.telegraph()/DC.flags without guarding every call site.
    var api = {
      on: ON,
      flags: { boxes: false, noFail: false },
      get frame() { return frameNo; },
      get timeScale() { return frozen ? 0 : speed; },
      telegraph: function () {},
      input: function () {},
      dump: function () { return ''; },
      reset: cfg.reset || function () {}
    };
    if (!ON) return api;

    installRAF();

    api.telegraph = function (label) { pending[label || 'tell'] = frameNo; };
    api.input = function (label, landed) {
      var k = label || 'tell';
      if (pending[k] == null) return;
      var frames = frameNo - pending[k];
      delete pending[k];
      reactions.push({ what: k, frames: frames, ok: !!landed });
      if (reactions.length > 6) reactions.shift();
      paintReactions();
    };

    /* ---- numbers dump: the handoff from Mike's hands to the next chat ---- */
    function dumpLine() {
      var parts = knobs.map(function (k) {
        var v = k.get();
        return k.key + '=' + (typeof v === 'number' ? +v.toFixed(3) : v);
      });
      toggles.forEach(function (t) { if (t.get()) parts.push(t.key || t.label); });
      if (speed !== 1) parts.push('speed=' + speed);
      return 'TUNING ' + name + ' | ' + parts.join(' | ');
    }
    function dumpFile() {
      var lines = [
        '# ' + name + ' tuning dump',
        '# Paste this whole file into the next chat. It is the handoff.',
        '',
        dumpLine(),
        ''
      ];
      if (reactions.length) {
        lines.push('# reaction readout (frames from telegraph to input)');
        reactions.forEach(function (r) {
          lines.push('#   ' + r.what + ': ' + r.frames + 'f ' + (r.ok ? 'LANDED' : 'missed'));
        });
        lines.push('');
      }
      lines.push('# knob\tvalue\tmin\tmax\tstep');
      knobs.forEach(function (k) {
        lines.push(k.key + '\t' + k.get() + '\t' + k.min + '\t' + k.max + '\t' + k.step);
      });
      return lines.join('\n');
    }
    api.dump = function (quiet) {
      var line = dumpLine();
      var body = dumpFile();
      global.__DEV_DUMP = body;                       // harness / console reads this
      try { global.localStorage.setItem('devdump:' + name, body); } catch (e) {}
      if (quiet) return line;
      try { global.console.log('%c' + line, 'color:#7ce8a8'); } catch (e) {}
      try { global.navigator.clipboard.writeText(body); } catch (e) {}
      try {
        var a = global.document.createElement('a');
        a.href = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
        a.download = name + '-tuning.txt';
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      } catch (e) {}
      flash('numbers dumped → clipboard + ' + name + '-tuning.txt');
      return line;
    };

    /* ---- DOM ------------------------------------------------------------- */
    var doc = global.document;
    var wrap = doc.createElement('div'); wrap.id = 'devCockpit'; wrap.style.cssText = CSS_PANEL;
    var tab = doc.createElement('button'); tab.textContent = '⚙ DEV'; tab.style.cssText = CSS_TAB;

    var html = '<div style="font-weight:bold;letter-spacing:1px;color:#7ce8a8;margin-bottom:2px">DEV COCKPIT' +
      '<span style="float:right;opacity:.55;font-weight:normal">` close</span></div>' +
      '<div style="opacity:.5;font-size:10px;margin-bottom:7px">P freeze · . step · [ ] speed · R reset · D dump</div>';

    knobs.forEach(function (k, i) {
      html += '<label style="display:block;margin:6px 0 1px">' + k.label + ': <b id="dcv' + i + '"></b></label>' +
        '<input type="range" id="dck' + i + '" min="' + k.min + '" max="' + k.max + '" step="' + k.step + '" style="width:100%">';
    });

    // ACTION SPEED is a continuous slider first, presets second. The presets jump
    // between known points; the slider does the actual job, which is creeping a
    // fight down until you can see what it is doing. It scales time, not the
    // numbers underneath, so nothing about the tuning changes while you look.
    html += '<div style="margin:9px 0 3px;color:#7ce8a8">Action speed: <b id="dcSpeedV">1.00x</b></div>' +
      '<input type="range" id="dcSpeedS" min="0.05" max="3" step="0.05" value="1" style="width:100%">' +
      '<div id="dcSpeed"></div>' +
      '<div style="opacity:.5;font-size:10px">[ and ] nudge it a notch either way</div>';
    html += '<div id="dcFreeze" style="margin:6px 0;opacity:.75"></div>';
    html += '<label style="display:block;margin:7px 0 2px"><input type="checkbox" id="dcBoxes"> Hitbox / window overlay</label>';
    toggles.forEach(function (t, i) {
      html += '<label style="display:block;margin:2px 0"><input type="checkbox" id="dct' + i + '"> ' + t.label + '</label>';
    });
    html += '<div style="margin:9px 0 3px;color:#7ce8a8">Reactions</div><div id="dcReact" style="font-size:11px;opacity:.85">—</div>';
    html += '<div style="margin:9px 0 3px;color:#7ce8a8">Actions</div>';
    html += '<button id="dcDump" style="' + CSS_BTN + 'color:#7ce8a8">D — dump the numbers</button>';
    html += '<button id="dcReset" style="' + CSS_BTN + '">R — reset to the rep</button>';
    actions.forEach(function (a, i) {
      html += '<button id="dca' + i + '" style="' + CSS_BTN + '">' + a.label + '</button>';
    });
    wrap.innerHTML = html;
    doc.body.appendChild(tab); doc.body.appendChild(wrap);

    var toast = doc.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:12px;left:50%;transform:translateX(-50%);z-index:100001;' +
      'font:12px ui-monospace,monospace;color:#0b0f14;background:#7ce8a8;padding:6px 12px;border-radius:6px;display:none';
    doc.body.appendChild(toast);
    var toastT = null;
    function flash(msg) {
      toast.textContent = msg; toast.style.display = 'block';
      clearTimeout(toastT); toastT = setTimeout(function () { toast.style.display = 'none'; }, 1800);
    }

    function paintReactions() {
      var el = doc.getElementById('dcReact'); if (!el) return;
      el.innerHTML = reactions.length ? reactions.map(function (r) {
        return '<div>' + r.what + ' <b>' + r.frames + 'f</b> ' +
          '<span style="color:' + (r.ok ? '#7ce8a8' : '#e8776a') + '">' + (r.ok ? 'landed' : 'missed') + '</span></div>';
      }).join('') : '—';
    }
    function paintFreeze() {
      var el = doc.getElementById('dcFreeze'); if (!el) return;
      el.innerHTML = 'frame <b>' + frameNo + '</b> · ' +
        (frozen ? '<span style="color:#e8c76a">FROZEN — . steps one frame</span>' : 'running');
    }
    function paintSpeed() {
      var sv = doc.getElementById('dcSpeedV'), ss = doc.getElementById('dcSpeedS');
      if (sv) sv.textContent = speed.toFixed(2) + 'x';
      if (ss && Math.abs(+ss.value - speed) > 1e-6) ss.value = speed;
      var row = doc.getElementById('dcSpeed'); if (!row) return;
      row.innerHTML = '';
      [0.1, 0.25, 0.5, 1, 2].forEach(function (m) {
        var b = doc.createElement('button');
        b.textContent = m + 'x';
        b.style.cssText = 'padding:4px 7px;margin:0 4px 4px 0;font:11px ui-monospace,monospace;border-radius:5px;' +
          'cursor:pointer;border:1px solid #3d4a58;color:#dfe6ea;background:' + (speed === m ? '#2e5c46' : '#1d2530');
        b.onclick = function () { setSpeed(m); };
        row.appendChild(b);
      });
    }
    function setSpeed(m) {
      speed = Math.max(0.05, Math.min(3, Math.round(m * 100) / 100));
      if (cfg.speed && cfg.speed.set) cfg.speed.set(m);   // let the game drive it if it can
      paintSpeed();
    }

    function refresh() {
      knobs.forEach(function (k, i) {
        var s = doc.getElementById('dck' + i), v = doc.getElementById('dcv' + i);
        s.value = k.get(); v.textContent = (+k.get()).toFixed(dec(k.step));
      });
      toggles.forEach(function (t, i) { doc.getElementById('dct' + i).checked = !!t.get(); });
      doc.getElementById('dcBoxes').checked = api.flags.boxes;
      paintSpeed(); paintFreeze(); paintReactions();
    }

    knobs.forEach(function (k, i) {
      doc.getElementById('dck' + i).oninput = function (e) {
        k.set(+e.target.value);
        doc.getElementById('dcv' + i).textContent = (+e.target.value).toFixed(dec(k.step));
      };
    });
    toggles.forEach(function (t, i) {
      doc.getElementById('dct' + i).onchange = function (e) { t.set(e.target.checked); };
    });
    actions.forEach(function (a, i) {
      doc.getElementById('dca' + i).onclick = function () { a.run(); };
    });
    doc.getElementById('dcSpeedS').oninput = function (e) { setSpeed(+e.target.value); };
    doc.getElementById('dcBoxes').onchange = function (e) { api.flags.boxes = e.target.checked; };
    doc.getElementById('dcDump').onclick = function () { api.dump(); };
    doc.getElementById('dcReset').onclick = function () { api.reset(); flash('reset'); };

    var open = false;
    function toggle() {
      open = !open;
      wrap.style.display = open ? 'block' : 'none';
      tab.style.display = open ? 'none' : 'block';
      if (open) refresh();
    }
    tab.onclick = toggle;

    // Repaint the live readouts a few times a second while the panel is open.
    setInterval(function () { if (open) { paintFreeze(); } }, 120);

    /* ---- keys: work whether or not the panel is open --------------------- */
    global.addEventListener('keydown', function (e) {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      var k = e.key;
      if (k === '`' || k === '~') { e.preventDefault(); toggle(); return; }
      if (k === 'P' || k === 'p') { frozen = !frozen; paintFreeze(); flash(frozen ? 'FROZEN' : 'running'); e.preventDefault(); return; }
      if (k === '.' || k === '>') { if (frozen) { stepOnce++; flash('step'); } e.preventDefault(); return; }
      if (k === 'R') { api.reset(); flash('reset'); e.preventDefault(); return; }
      if (k === 'D') { api.dump(); e.preventDefault(); return; }
      // [ and ] dial the action speed without opening the panel — the control
      // you reach for most, so it should not cost a click.
      if (k === '[') { setSpeed(speed - 0.05); flash('speed ' + speed.toFixed(2) + 'x'); e.preventDefault(); return; }
      if (k === ']') { setSpeed(speed + 0.05); flash('speed ' + speed.toFixed(2) + 'x'); e.preventDefault(); return; }
    }, true);

    // Harness hook — a node/headless run drives the game through this.
    global.__DEV = {
      knobs: knobs, api: api,
      set: function (key, v) { knobs.forEach(function (k) { if (k.key === key) k.set(v); }); },
      get: function (key) { var r; knobs.forEach(function (k) { if (k.key === key) r = k.get(); }); return r; },
      dump: function () { return api.dump(true); },
      freeze: function (v) { frozen = !!v; },
      step: function (n) { stepOnce += (n || 1); },
      speed: setSpeed,
      reactions: reactions
    };

    return api;
  }

  global.DevCockpit = { mount: mount, get on() { return ON; }, get frame() { return frameNo; },
                        get timeScale() { return frozen ? 0 : speed; } };
})(typeof window !== 'undefined' ? window : globalThis);
