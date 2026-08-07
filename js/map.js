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
  if (startTab && document.getElementById("tab-" + startTab)) showTab(startTab);
  else if (btns.length) showTab(btns[0].dataset.tab);

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

  const reset = document.querySelector(".reset-progress");
  if (reset) reset.addEventListener("click", () => {
    if (!confirm("Clear all checked-off steps for this map?")) return;
    progress = {};
    try { localStorage.removeItem(storeKey); } catch (e) {}
    steps.forEach(li => li.classList.remove("done"));
  });
})();
