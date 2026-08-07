/* Registers the service worker and offers the Android/desktop "Install" button.
 * Included on every page. Works from the root and from maps/ without knowing which,
 * because every path is resolved relative to this script's own URL.
 */
(function () {
  var self_src = document.currentScript && document.currentScript.src;
  if (!self_src) {
    var tags = document.getElementsByTagName('script');
    for (var i = tags.length - 1; i >= 0; i--) {
      if (/\/pwa\.js(\?|$)/.test(tags[i].src)) { self_src = tags[i].src; break; }
    }
  }
  if (!self_src) return;
  var ROOT = new URL('../', self_src).href;   // js/ -> site root

  if (!('serviceWorker' in navigator)) return;

  // Remember whether a worker was already in charge BEFORE we register. If one was,
  // a later handover means a new version published, and the page should reload to match.
  var hadController = !!navigator.serviceWorker.controller;
  var reloading = false;

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (hadController && !reloading) {
      reloading = true;
      window.location.reload();
      return;
    }
    // First run: the worker has only just taken charge, so the offline button —
    // which needs a controller to be any use — can go in now.
    addSaveButton();
  });

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(ROOT + 'sw.js', { scope: ROOT }).catch(function () {
      /* offline on first run, or unsupported — the site still works, just not offline */
    });
  });

  // ---- "Save for offline" (map pages only) ----
  // The service worker already caches screenshots as you scroll past them, so a map you've
  // read is available offline. This pulls the REST of them down in one go, so the whole map
  // works with no signal. Fetching through fetch() is deliberate: the worker's own fetch
  // handler does the caching, so this can never write to the wrong cache.
  function addSaveButton() {
    if (!document.body.classList.contains('map-page')) return;
    if (!navigator.serviceWorker.controller) return;      // nothing to save into yet
    var bar = document.querySelector('.back-bar');
    if (!bar || bar.querySelector('.offline-btn')) return;

    var mapId = document.body.dataset.map || 'map';
    var flag = 'zg-offline-' + mapId;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'offline-btn';

    var saved = false;
    try { saved = localStorage.getItem(flag) === '1'; } catch (e) {}
    btn.textContent = saved ? '✓ Saved offline' : '⤓ Save for offline';
    if (saved) btn.classList.add('done');
    bar.appendChild(btn);

    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.classList.remove('done');

      var urls = [];
      for (var i = 0; i < document.images.length; i++) {
        var s = document.images[i].currentSrc || document.images[i].src;
        if (s && urls.indexOf(s) === -1) urls.push(s);
      }
      document.querySelectorAll('[data-audio]').forEach(function (a) {
        var u = new URL(a.dataset.audio, location.href).href;
        if (urls.indexOf(u) === -1) urls.push(u);
      });

      var total = urls.length, done = 0, failed = 0, next = 0;
      if (!total) { btn.textContent = '✓ Saved offline'; btn.disabled = false; return; }

      function tick() {
        btn.textContent = 'Saving ' + Math.round((done / total) * 100) + '%';
      }
      function pump() {
        if (next >= urls.length) return Promise.resolve();
        var u = urls[next++];
        return fetch(u).catch(function () { failed++; })
          .then(function () { done++; tick(); return pump(); });
      }
      tick();
      // six at a time — enough to be quick, not enough to choke a phone
      Promise.all([pump(), pump(), pump(), pump(), pump(), pump()]).then(function () {
        btn.disabled = false;
        if (failed) {
          btn.textContent = '⚠ ' + failed + ' missed — tap to retry';
        } else {
          btn.textContent = '✓ Saved offline';
          btn.classList.add('done');
          try { localStorage.setItem(flag, '1'); } catch (e) {}
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSaveButton);
  } else {
    addSaveButton();
  }
  navigator.serviceWorker.ready.then(addSaveButton);

  // ---- Install button (Chrome/Android/desktop). iOS never fires this; it uses Share > Add to Home Screen. ----
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    try { if (sessionStorage.getItem('zg-install-dismissed')) return; } catch (err) {}

    var bar = document.createElement('div');
    bar.className = 'install-bar';
    bar.innerHTML = '<span>Add Zombies Guides to your home screen</span>' +
                    '<button type="button" class="install-yes">Install</button>' +
                    '<button type="button" class="install-no" aria-label="Dismiss">&times;</button>';
    document.body.appendChild(bar);

    bar.querySelector('.install-yes').addEventListener('click', function () {
      bar.remove();
      e.prompt();
    });
    bar.querySelector('.install-no').addEventListener('click', function () {
      bar.remove();
      try { sessionStorage.setItem('zg-install-dismissed', '1'); } catch (err) {}
    });
  });
})();
