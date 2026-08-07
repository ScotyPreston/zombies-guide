// Shared behavior for map guide pages: tab switching + checkable steps saved in localStorage.
// Page must set: <body class="map-page" data-map="spaceland">
(function () {
  const mapId = document.body.dataset.map || "map";
  const storeKey = "zg-progress-" + mapId;

  // ---- Tabs ----
  const btns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  function showTab(id) {
    btns.forEach(b => b.classList.toggle("active", b.dataset.tab === id));
    panels.forEach(p => p.classList.toggle("active", p.id === "tab-" + id));
    try { sessionStorage.setItem("zg-tab-" + mapId, id); } catch (e) {}
  }
  btns.forEach(b => b.addEventListener("click", () => showTab(b.dataset.tab)));
  // Inline audio-cue buttons: <button class="sound-btn" data-audio="../audio/x.mp3">
  document.querySelectorAll("[data-audio]").forEach(btn => {
    let audio = null;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!audio) {
        audio = new Audio(btn.dataset.audio);
        audio.addEventListener("ended", () => btn.classList.remove("playing"));
        audio.addEventListener("error", () => {
          btn.classList.remove("playing");
          btn.textContent = "⚠ Clip unavailable";
        });
      }
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        btn.classList.remove("playing");
        return;
      }
      audio.currentTime = 0;
      audio.play();
      btn.classList.add("playing");
    });
  });

  // Cross-reference buttons: <button class="xref" data-goto="wonder">…</button>
  document.querySelectorAll("[data-goto]").forEach(el =>
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      showTab(el.dataset.goto);
      window.scrollTo(0, 0);
    })
  );

  let startTab = null;
  try { startTab = sessionStorage.getItem("zg-tab-" + mapId); } catch (e) {}
  // A page can mark which tab to land on with data-default; otherwise it's the first pill.
  const defaultBtn = document.querySelector(".tab-btn[data-default]") || btns[0];
  if (startTab && document.getElementById("tab-" + startTab)) showTab(startTab);
  else if (defaultBtn) showTab(defaultBtn.dataset.tab);

  // ---- Checkable steps ----
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(storeKey)) || {}; } catch (e) {}

  // Check-off is a main-quest progress feature only
  const steps = document.querySelectorAll("#tab-main .steps > li");
  steps.forEach((li, i) => {
    const key = li.id || "s" + i;
    if (!li.id) li.id = key;
    if (progress[key]) li.classList.add("done");
    li.addEventListener("click", (ev) => {
      if (ev.target.closest("a, button, audio")) return; // don't toggle when tapping a link/button inside
      li.classList.toggle("done");
      progress[key] = li.classList.contains("done");
      try { localStorage.setItem(storeKey, JSON.stringify(progress)); } catch (e) {}
    });
  });

  // ---- Full-screen map viewer ----
  // <button class="map-open" data-full="../img/x/map.jpg" data-title="…"><img …></button>
  const openers = document.querySelectorAll(".map-open");
  if (openers.length) {
    const ZOOMS = [100, 150, 220, 320, 450];
    let zi = 0;

    const viewer = document.createElement("div");
    viewer.className = "map-viewer";
    viewer.innerHTML =
      '<div class="mv-bar">' +
        '<button class="mv-close" aria-label="Close map">&#10005;</button>' +
        '<span class="mv-title"></span>' +
        '<button class="mv-out" aria-label="Zoom out">&minus;</button>' +
        '<button class="mv-in" aria-label="Zoom in">+</button>' +
      "</div>" +
      '<div class="mv-scroll"><img alt=""></div>';
    document.body.appendChild(viewer);

    const scroll = viewer.querySelector(".mv-scroll");
    const img = viewer.querySelector("img");
    const title = viewer.querySelector(".mv-title");

    function applyZoom() {
      img.style.setProperty("--mv-width", ZOOMS[zi] + "%");
      viewer.querySelector(".mv-out").disabled = zi === 0;
      viewer.querySelector(".mv-in").disabled = zi === ZOOMS.length - 1;
    }
    function zoom(dir) {
      // keep whatever is in the middle of the screen roughly in the middle
      const cx = (scroll.scrollLeft + scroll.clientWidth / 2) / Math.max(scroll.scrollWidth, 1);
      const cy = (scroll.scrollTop + scroll.clientHeight / 2) / Math.max(scroll.scrollHeight, 1);
      zi = Math.min(ZOOMS.length - 1, Math.max(0, zi + dir));
      applyZoom();
      requestAnimationFrame(() => {
        scroll.scrollLeft = cx * scroll.scrollWidth - scroll.clientWidth / 2;
        scroll.scrollTop = cy * scroll.scrollHeight - scroll.clientHeight / 2;
      });
    }
    function close() {
      viewer.classList.remove("open");
      document.body.style.overflow = "";
    }

    openers.forEach(btn => btn.addEventListener("click", () => {
      const inner = btn.querySelector("img");
      img.src = btn.dataset.full || (inner && inner.src) || "";
      title.textContent = btn.dataset.title || "";
      zi = 0;
      applyZoom();
      scroll.scrollTop = 0;
      scroll.scrollLeft = 0;
      viewer.classList.add("open");
      document.body.style.overflow = "hidden"; // don't scroll the page behind it
    }));

    viewer.querySelector(".mv-close").addEventListener("click", close);
    viewer.querySelector(".mv-in").addEventListener("click", () => zoom(1));
    viewer.querySelector(".mv-out").addEventListener("click", () => zoom(-1));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && viewer.classList.contains("open")) close();
    });
  }

  const reset = document.querySelector(".reset-progress");
  if (reset) reset.addEventListener("click", () => {
    if (!confirm("Clear all checked-off steps for this map?")) return;
    progress = {};
    try { localStorage.removeItem(storeKey); } catch (e) {}
    steps.forEach(li => li.classList.remove("done"));
  });
})();
