// Attack of the Radioactive Thing — chemical compound solver.
// Logic and data ported from ZombieSlaya Mr.'s own solver
// (zombieslayamr.com/pages/aotrt/aotrt_chemical.html), used with credit.
// The 12 columns per ingredient are the game's 12 possible value sets
// (top + left numbers already summed).

var AOTRT = {
  oNumbers: [2, 4, 5, 6, 8, 9, 11, 15],
  acetOk: [10, 15, 12, 8, 9],
  glycOk: [14, 4, 11, 12, 18, 10, 13, 9],
  acetMap: { 10: [0], 15: [1, 3], 12: [2, 5, 6, 8, 9], 9: [4, 11], 8: [7, 10] },
  glycMap: { 14: [1], 4: [2], 11: [3, 4], 12: [5], 18: [6], 10: [7, 8], 13: [9], 9: [10, 11] },
  ingredients: {
    "Racing Fuel":                [5, 6, 6, 6, 6, 8, 11, 13, 14, 14, 14, 16],
    "Insect Repellent":           [11, 9, 15, 7, 16, 12, 7, 14, 10, 15, 6, 3],
    "Vodka":                      [11, 12, 4, 4, 11, 6, 16, 9, 16, 11, 16, 11],
    "Baking Soda":                [18, 10, 13, 12, 14, 10, 6, 16, 11, 13, 11, 8],
    "Detergent":                  [16, 14, 11, 8, 13, 13, 16, 10, 16, 8, 6, 9],
    "Food Coloring":              [15, 10, 16, 13, 17, 11, 12, 11, 12, 11, 6, 13],
    "Drain Opener":               [14, 9, 10, 14, 15, 11, 7, 9, 6, 8, 16, 13],
    "Quarters":                   [7, 10, 11, 12, 12, 13, 9, 9, 4, 5, 12, 8],
    "Glass Cleaner":              [7, 15, 7, 10, 10, 18, 8, 13, 13, 10, 16, 7],
    "Nail Polish Remover":        [5, 6, 9, 14, 9, 11, 17, 8, 9, 5, 9, 7],
    "Pennies":                    [14, 13, 17, 13, 5, 11, 14, 7, 8, 11, 7, 14],
    "Pool Cleaner":               [10, 14, 16, 7, 17, 16, 16, 3, 11, 15, 10, 16],
    "Plant Food":                 [11, 9, 10, 3, 13, 17, 13, 10, 13, 11, 7, 16],
    "Paint":                      [16, 12, 13, 4, 8, 10, 15, 5, 3, 7, 5, 8],
    "Vinegar":                    [6, 11, 18, 16, 10, 6, 11, 2, 7, 5, 6, 11],
    "Ice":                        [14, 10, 8, 9, 3, 13, 2, 7, 6, 10, 10, 13],
    "Bleach":                     [16, 13, 15, 13, 5, 11, 6, 7, 4, 10, 7, 10],
    "Powdered Milk":              [4, 8, 7, 12, 12, 8, 2, 10, 10, 15, 7, 10],
    "Fat":                        [8, 8, 10, 12, 12, 14, 12, 12, 15, 16, 10, 5],
    "Motor Oil":                  [7, 7, 11, 9, 14, 9, 9, 8, 11, 15, 9, 8],
    "Wheel Cleaner":              [11, 13, 6, 12, 13, 10, 13, 10, 8, 6, 13, 10],
    "Table Salt":                 [17, 16, 8, 12, 16, 8, 8, 8, 9, 7, 15, 7],
    "Acetaldehyde":               [10, 15, 12, 15, 9, 12, 12, 8, 12, 12, 8, 9],
    "Glycerol":                   [11, 14, 4, 11, 11, 12, 18, 10, 10, 13, 9, 9],
    "Methylbenzene":              [10, 15, 10, 17, 11, 10, 12, 10, 17, 7, 8, 12],
    "Nitrated Glycerol Solution": [5, 7, 13, 11, 12, 13, 10, 8, 16, 9, 14, 13],
    "Mixed Acid Solution":        [12, 11, 14, 16, 12, 15, 16, 5, 13, 5, 8, 8],
    "Hexamine":                   [10, 8, 15, 11, 6, 5, 11, 6, 12, 14, 8, 8],
    "Phenolsulfonic Acid":        [12, 12, 17, 9, 4, 8, 10, 14, 15, 17, 13, 9],
    "Phenol":                     [17, 14, 13, 11, 7, 13, 11, 4, 8, 8, 10, 7],
    "Aldehyde Sludge":            [11, 8, 15, 4, 15, 11, 8, 18, 10, 11, 7, 12],
    "Formaldehyde":               [6, 12, 9, 9, 13, 12, 13, 11, 10, 13, 14, 11],
    "Dinitro":                    [12, 11, 13, 8, 13, 9, 9, 10, 12, 15, 7, 12]
  },
  compounds: {
    "3,4 Di-Nitroxy-Methyl-Propane": [
      ["Vodka", "Pennies"],
      ["Racing Fuel", "Quarters"],
      ["Formaldehyde", "Acetaldehyde", "Detergent"],
      ["Aldehyde Sludge", "Nail Polish Remover"]],
    "1,3,5 Tera-Nitra-Phenol": [
      ["Motor Oil", "Insect Repellent", "Wheel Cleaner"],
      ["Phenol", "Drain Opener"],
      ["Phenolsulfonic Acid", "Detergent"]],
    "3-Methyl 2,4 Di-Nitrobenzene": [
      ["Drain Opener", "Paint", "Detergent"],
      ["Methylbenzene", "Baking Soda", "Vinegar", "Detergent"],
      ["Dinitro", "Racing Fuel"]],
    "Octa-Hydro 2,5 Nitro 3,4,7 Para-Zokine": [
      ["Racing Fuel", "Quarters"],
      ["Formaldehyde", "Glass Cleaner"],
      ["Hexamine", "Vinegar", "Plant Food", "Detergent"]],
    "2,4 Propane 3,5 Tetra-Nitrite": [
      ["Fat", "Vodka"],
      ["Detergent", "Drain Opener", "Ice"],
      ["Glycerol", "Mixed Acid Solution"],
      ["Nitrated Glycerol Solution", "Baking Soda"]]
  }
};

function AotrtSolver(container) {
  var state = { o: -1, colIdx: -1, tvColor: "", possibleO: [] };

  function esc(s) { return String(s); }

  function html() {
    var compOpts = Object.keys(AOTRT.compounds)
      .map(function (c) { return '<option>' + c + '</option>'; }).join('');
    return '' +
      '<div class="chem-step" id="chem-s1">' +
      '<h2>Step 1 &mdash; your O number</h2>' +
      '<div class="gv-form">' +
      '<label class="gv-label">M number (the little room by the pool)' +
      '<input type="number" id="chem-m" inputmode="numeric"></label>' +
      '<label class="gv-label">The number on the TOP line of Elvira\'s function TV' +
      '<input type="number" id="chem-tv" inputmode="numeric"></label>' +
      '<label class="gv-label" id="chem-o-wrap" style="display:none">Couldn\'t narrow it down &mdash; enter your &Phi; (O) number from the boards' +
      '<input type="number" id="chem-o" inputmode="numeric"></label>' +
      '</div>' +
      '<button class="xref" id="chem-go1">Work it out</button>' +
      '<div id="chem-out1" class="gv-out"></div>' +
      '</div>' +
      '<div class="chem-step" id="chem-s2" style="display:none">' +
      '<h2>Step 2 &mdash; one board reading</h2>' +
      '<p class="blurb">On the chem board <b>outside the TV Station</b>, viewed in <b>your colour</b>: find <b>Acetaldehyde</b> and add its <b>top + left</b> numbers together.</p>' +
      '<div class="gv-form">' +
      '<label class="gv-label">Acetaldehyde (top + left added)' +
      '<input type="number" id="chem-acet" inputmode="numeric"></label>' +
      '<label class="gv-label" id="chem-glyc-wrap" style="display:none">Still ambiguous &mdash; add Glycerol\'s top + left too' +
      '<input type="number" id="chem-glyc" inputmode="numeric"></label>' +
      '</div>' +
      '<button class="xref" id="chem-go2">Next</button>' +
      '<div id="chem-out2" class="gv-out"></div>' +
      '</div>' +
      '<div class="chem-step" id="chem-s3" style="display:none">' +
      '<h2>Step 3 &mdash; the compound</h2>' +
      '<p class="blurb">Pick the compound the <b>battery-powered radio</b> named:</p>' +
      '<div class="gv-form"><label class="gv-label">Bomb compound' +
      '<select id="chem-comp"><option>- pick -</option>' + compOpts + '</select></label></div>' +
      '<div id="chem-out3" class="gv-out"></div>' +
      '<button class="xref" id="chem-reset">Start over</button>' +
      '</div>';
  }

  container.innerHTML = html();
  var $ = function (id) { return container.querySelector('#' + id); };

  $('chem-go1').addEventListener('click', function () {
    var m = Number($('chem-m').value);
    var tv = Number($('chem-tv').value);
    var out = $('chem-out1');
    if (!m || !tv) { out.innerHTML = '<div class="callout">Both numbers are needed.</div>'; return; }
    var range = [tv - 1, tv + 1, tv + 3];
    state.possibleO = [];
    range.forEach(function (v) {
      if (v % m === 0 && AOTRT.oNumbers.indexOf(v / m) !== -1) state.possibleO.push(v / m);
    });
    var manual = Number($('chem-o').value);
    if (state.possibleO.length === 0 && !manual) {
      out.innerHTML = '<div class="callout">Those numbers don\'t work out &mdash; double-check M and the TV number.</div>'; return;
    }
    if (state.possibleO.length > 1 && !manual) {
      $('chem-o-wrap').style.display = '';
      out.innerHTML = '<div class="callout">Two possibilities &mdash; check a &Phi; board and type your O number above, then press again.</div>'; return;
    }
    if (manual) {
      if (state.possibleO.length && state.possibleO.indexOf(manual) === -1) {
        out.innerHTML = '<div class="callout">That O number doesn\'t fit your M and TV numbers.</div>'; return;
      }
      state.o = manual;
    } else {
      state.o = state.possibleO[0];
    }
    var pos = range.indexOf(state.o * m);
    state.tvColor = ["TOP", "MIDDLE", "BOTTOM"][pos] || "?";
    out.innerHTML = '<div class="callout"><b>O = ' + state.o + '</b> &middot; view the chem boards in the colour of the <b>' + state.tvColor + ' line</b> on Elvira\'s TV.</div>';
    $('chem-s2').style.display = '';
  });

  $('chem-go2').addEventListener('click', function () {
    var a = Number($('chem-acet').value);
    var out = $('chem-out2');
    if (AOTRT.acetOk.indexOf(a) === -1) {
      out.innerHTML = '<div class="callout">Acetaldehyde is always one of ' + AOTRT.acetOk.join(', ') + ' &mdash; re-add the top + left numbers (make sure you\'re in the right colour).</div>'; return;
    }
    var candidates = AOTRT.acetMap[a];
    if (candidates.length === 1) {
      state.colIdx = candidates[0];
    } else {
      var g = Number($('chem-glyc').value);
      if (!g) { $('chem-glyc-wrap').style.display = ''; out.innerHTML = '<div class="callout">Need one more reading &mdash; add Glycerol\'s numbers above, then press again.</div>'; return; }
      if (AOTRT.glycOk.indexOf(g) === -1) {
        out.innerHTML = '<div class="callout">Glycerol is always one of ' + AOTRT.glycOk.join(', ') + ' &mdash; re-check it.</div>'; return;
      }
      var both = candidates.filter(function (i) { return AOTRT.glycMap[g].indexOf(i) !== -1; });
      if (both.length !== 1) { out.innerHTML = '<div class="callout">Those two readings don\'t match a known game &mdash; re-check both in the right colour.</div>'; return; }
      state.colIdx = both[0];
    }
    out.innerHTML = '<div class="callout">Got it &mdash; your game\'s value set is locked in.</div>';
    $('chem-s3').style.display = '';
  });

  $('chem-comp').addEventListener('change', function () {
    var name = $('chem-comp').value;
    var out = $('chem-out3');
    if (!AOTRT.compounds[name]) { out.innerHTML = ''; return; }
    var rows = AOTRT.compounds[name].map(function (recipe, idx) {
      var sum = -state.o;
      recipe.forEach(function (ing) { sum += AOTRT.ingredients[ing][state.colIdx]; });
      var num = String(sum); if (num.length < 2) num = '0' + num;
      return '<tr><td><b>Mix ' + (idx + 1) + '</b><br><small>' + recipe.join(' + ') + '</small></td>' +
             '<td style="font-size:1.3em"><b>' + num + '</b></td></tr>';
    }).join('');
    out.innerHTML = '<table class="data-table"><thead><tr><th>Recipe</th><th>Punch in</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="callout">Do the mixes in order &mdash; each one\'s output feeds the next. A wrong number <b>explodes and drops you to 1 HP</b>, so read twice, punch once.</div>';
  });

  $('chem-reset').addEventListener('click', function () {
    state = { o: -1, colIdx: -1, tvColor: "", possibleO: [] };
    container.innerHTML = html();
    AotrtSolver(container);
  });
}
