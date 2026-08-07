// Samantha Says tracker (Moon): tap a monitor and its colour drops into that monitor's
// column, stacking downward — same behaviour as glitchingqueen.com/simonsays.html.
// Usage: SamanthaSays(el, { mapId: "moon", colors: [{name,css}, ...] })
function SamanthaSays(container, cfg) {
  const key = "zg-samsays-" + cfg.mapId;
  let seq = [];
  try { seq = JSON.parse(localStorage.getItem(key)) || []; } catch (e) {}

  container.innerHTML =
    '<div class="sam-tool">' +
    '  <button type="button" class="sam-reset">RESET</button>' +
    '  <div class="sam-hint">PRESS MONITOR COLOR TO CHOOSE COLOR</div>' +
    '  <div class="sam-monitors"></div>' +
    '  <div class="sam-log"></div>' +
    '  <div class="sam-controls">' +
    '    <button type="button" class="sam-undo">&#8630; Undo last</button>' +
    '    <span class="sam-count"></span>' +
    "  </div>" +
    "</div>";

  const monEl = container.querySelector(".sam-monitors");
  const logEl = container.querySelector(".sam-log");
  const countEl = container.querySelector(".sam-count");

  cfg.colors.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sam-monitor";
    b.style.setProperty("--c", c.css);
    b.setAttribute("aria-label", c.name);
    b.innerHTML = '<span class="sam-screen"></span><span class="sam-stand"></span>';
    b.addEventListener("click", () => { seq.push(i); save(); });
    monEl.appendChild(b);
  });

  container.querySelector(".sam-reset").addEventListener("click", () => {
    if (seq.length && !confirm("Clear the whole sequence?")) return;
    seq = [];
    save();
  });
  container.querySelector(".sam-undo").addEventListener("click", () => {
    seq.pop();
    save();
  });

  function save() {
    try { localStorage.setItem(key, JSON.stringify(seq)); } catch (e) {}
    render();
  }

  function render() {
    logEl.innerHTML = "";
    seq.forEach((ci) => {
      const row = document.createElement("div");
      row.className = "sam-row";
      cfg.colors.forEach((c, i) => {
        const cell = document.createElement("span");
        cell.className = "sam-cell" + (i === ci ? " on" : "");
        if (i === ci) cell.style.setProperty("--c", c.css);
        row.appendChild(cell);
      });
      logEl.appendChild(row);
    });
    countEl.textContent = seq.length ? seq.length + " in sequence" : "";
  }
  render();
}

// Simon Says tracker: tap in the combination the game shows you, round by round.
// Saved in localStorage so it survives a reload mid-match.
// Usage: SimonTracker(containerEl, { mapId: "spaceland", pads: [{label,color,text?}] })
function SimonTracker(container, cfg) {
  const key = "zg-simon-" + cfg.mapId;
  let rounds = [];
  try { rounds = JSON.parse(localStorage.getItem(key)) || []; } catch (e) {}
  if (!rounds.length) rounds = [[]];

  // Two layouts: "wheel" (circular, pads have pos: top/right/bottom/left — mirrors the in-game panel)
  // or the default 2x2 grid of pads.
  const wheel = cfg.pads.every(p => p.pos);
  container.innerHTML =
    (wheel ? '<div class="simon-wheel"><div class="simon-hub"><span></span></div></div>' : '<div class="simon-pads"></div>') +
    '<div class="simon-controls">' +
    '  <button type="button" class="simon-btn" data-act="undo">&#8630; Undo</button>' +
    '  <button type="button" class="simon-btn" data-act="round">+ New round</button>' +
    '  <button type="button" class="simon-btn danger" data-act="clear">Clear</button>' +
    "</div>" +
    '<div class="simon-log"></div>';

  const padsEl = container.querySelector(wheel ? ".simon-wheel" : ".simon-pads");
  const logEl = container.querySelector(".simon-log");

  cfg.pads.forEach((p, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.style.setProperty("--pad", p.color);
    if (wheel) {
      b.className = "simon-wedge pos-" + p.pos;
      b.innerHTML = '<span class="wedge-label"><b>' + (p.text || "") + "</b><small>" + p.label + "</small></span>";
    } else {
      b.className = "simon-pad";
      b.innerHTML = "<span>" + (p.text || "") + "</span><small>" + p.label + "</small>";
    }
    b.addEventListener("click", () => { rounds[rounds.length - 1].push(i); save(); });
    padsEl.appendChild(b);
  });

  container.querySelector('[data-act="undo"]').addEventListener("click", () => {
    const cur = rounds[rounds.length - 1];
    if (cur.length) cur.pop();
    else if (rounds.length > 1) rounds.pop();
    save();
  });
  container.querySelector('[data-act="round"]').addEventListener("click", () => {
    if (rounds[rounds.length - 1].length) { rounds.push([]); save(); }
  });
  container.querySelector('[data-act="clear"]').addEventListener("click", () => {
    if (!confirm("Clear the saved combination?")) return;
    rounds = [[]];
    save();
  });

  function save() {
    try { localStorage.setItem(key, JSON.stringify(rounds)); } catch (e) {}
    render();
  }

  function render() {
    logEl.innerHTML = "";
    rounds.forEach((r, ri) => {
      const row = document.createElement("div");
      row.className = "simon-row";
      let html = "<b>R" + (ri + 1) + "</b>";
      if (!r.length) html += '<i class="simon-empty">tap the pads above as the game shows them</i>';
      r.forEach(i => {
        const p = cfg.pads[i];
        html += '<span class="simon-chip" style="--pad:' + p.color + '">' + (p.text || p.label) + "</span>";
      });
      row.innerHTML = html;
      logEl.appendChild(row);
    });
  }
  render();
}
