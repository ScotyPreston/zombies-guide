// Gorod Krovi air-valve solver.
// Solution table derived from the community's verified combination list
// (AbsoluteTravesty / kronorium.com) - 30 start/end pairs, 5 valve settings each.
var GK_VALVES = {
 "Armory|Tank Factory": {
  "Armory": 3,
  "Department Store": 2,
  "Infirmary": 3,
  "Dragon Command": 1,
  "Supply Depot": 3
 },
 "Armory|Department Store": {
  "Armory": 1,
  "Supply Depot": 3,
  "Tank Factory": 1,
  "Infirmary": 3,
  "Dragon Command": 2
 },
 "Armory|Dragon Command": {
  "Armory": 3,
  "Department Store": 2,
  "Infirmary": 2,
  "Tank Factory": 2,
  "Supply Depot": 1
 },
 "Armory|Supply Depot": {
  "Armory": 2,
  "Tank Factory": 1,
  "Infirmary": 1,
  "Department Store": 3,
  "Dragon Command": 1
 },
 "Armory|Infirmary": {
  "Armory": 2,
  "Tank Factory": 2,
  "Supply Depot": 1,
  "Dragon Command": 2,
  "Department Store": 2
 },
 "Department Store|Dragon Command": {
  "Department Store": 2,
  "Infirmary": 2,
  "Tank Factory": 3,
  "Armory": 1,
  "Supply Depot": 1
 },
 "Department Store|Supply Depot": {
  "Department Store": 1,
  "Armory": 2,
  "Tank Factory": 1,
  "Infirmary": 3,
  "Dragon Command": 1
 },
 "Department Store|Infirmary": {
  "Department Store": 1,
  "Armory": 2,
  "Tank Factory": 2,
  "Supply Depot": 1,
  "Dragon Command": 3
 },
 "Department Store|Tank Factory": {
  "Department Store": 2,
  "Infirmary": 3,
  "Dragon Command": 1,
  "Supply Depot": 2,
  "Armory": 2
 },
 "Department Store|Armory": {
  "Department Store": 3,
  "Dragon Command": 3,
  "Infirmary": 2,
  "Tank Factory": 2,
  "Supply Depot": 2
 },
 "Dragon Command|Supply Depot": {
  "Dragon Command": 2,
  "Department Store": 2,
  "Infirmary": 2,
  "Tank Factory": 3,
  "Armory": 1
 },
 "Dragon Command|Infirmary": {
  "Dragon Command": 1,
  "Supply Depot": 3,
  "Tank Factory": 3,
  "Armory": 3,
  "Department Store": 2
 },
 "Dragon Command|Tank Factory": {
  "Dragon Command": 3,
  "Infirmary": 1,
  "Department Store": 1,
  "Armory": 1,
  "Supply Depot": 3
 },
 "Dragon Command|Department Store": {
  "Dragon Command": 1,
  "Supply Depot": 2,
  "Armory": 2,
  "Tank Factory": 1,
  "Infirmary": 1
 },
 "Dragon Command|Armory": {
  "Dragon Command": 1,
  "Supply Depot": 3,
  "Tank Factory": 1,
  "Infirmary": 1,
  "Department Store": 1
 },
 "Supply Depot|Infirmary": {
  "Supply Depot": 3,
  "Tank Factory": 3,
  "Armory": 3,
  "Department Store": 3,
  "Dragon Command": 3
 },
 "Supply Depot|Tank Factory": {
  "Supply Depot": 2,
  "Armory": 3,
  "Department Store": 3,
  "Dragon Command": 3,
  "Infirmary": 2
 },
 "Supply Depot|Dragon Command": {
  "Supply Depot": 3,
  "Tank Factory": 3,
  "Armory": 3,
  "Department Store": 2,
  "Infirmary": 3
 },
 "Supply Depot|Department Store": {
  "Supply Depot": 2,
  "Armory": 2,
  "Tank Factory": 1,
  "Infirmary": 3,
  "Dragon Command": 2
 },
 "Supply Depot|Armory": {
  "Supply Depot": 3,
  "Tank Factory": 1,
  "Infirmary": 3,
  "Dragon Command": 2,
  "Department Store": 1
 },
 "Infirmary|Tank Factory": {
  "Infirmary": 3,
  "Dragon Command": 2,
  "Department Store": 1,
  "Armory": 1,
  "Supply Depot": 3
 },
 "Infirmary|Supply Depot": {
  "Infirmary": 3,
  "Dragon Command": 2,
  "Department Store": 1,
  "Armory": 2,
  "Tank Factory": 2
 },
 "Infirmary|Dragon Command": {
  "Infirmary": 2,
  "Tank Factory": 2,
  "Supply Depot": 2,
  "Armory": 3,
  "Department Store": 3
 },
 "Infirmary|Department Store": {
  "Infirmary": 3,
  "Dragon Command": 1,
  "Supply Depot": 3,
  "Tank Factory": 3,
  "Armory": 3
 },
 "Infirmary|Armory": {
  "Infirmary": 2,
  "Tank Factory": 2,
  "Supply Depot": 1,
  "Dragon Command": 2,
  "Department Store": 1
 },
 "Tank Factory|Infirmary": {
  "Tank Factory": 2,
  "Supply Depot": 2,
  "Armory": 3,
  "Department Store": 3,
  "Dragon Command": 3
 },
 "Tank Factory|Supply Depot": {
  "Tank Factory": 1,
  "Infirmary": 3,
  "Dragon Command": 2,
  "Department Store": 1,
  "Armory": 1
 },
 "Tank Factory|Dragon Command": {
  "Tank Factory": 1,
  "Infirmary": 1,
  "Department Store": 1,
  "Armory": 1,
  "Supply Depot": 1
 },
 "Tank Factory|Department Store": {
  "Tank Factory": 1,
  "Infirmary": 3,
  "Dragon Command": 1,
  "Supply Depot": 2,
  "Armory": 3
 },
 "Tank Factory|Armory": {
  "Tank Factory": 1,
  "Infirmary": 1,
  "Department Store": 3,
  "Dragon Command": 1,
  "Supply Depot": 2
 }
};

function GorodValves(container) {
  var NAMES = ["Armory", "Department Store", "Dragon Command", "Infirmary", "Supply Depot", "Tank Factory"];
  function sel(id, label) {
    var s = '<label class="gv-label">' + label + '<select id="' + id + '">';
    s += '<option value="">- pick -</option>';
    NAMES.forEach(function (n) { s += '<option>' + n + '</option>'; });
    return s + '</select></label>';
  }
  container.innerHTML =
    '<div class="gv-form">' + sel('gv-start', 'Valve with the GREEN light') +
    sel('gv-end', 'Valve holding the CYLINDER') + '</div>' +
    '<div id="gv-out" class="gv-out"></div>';
  var a = container.querySelector('#gv-start');
  var b = container.querySelector('#gv-end');
  var out = container.querySelector('#gv-out');
  function render() {
    if (!a.value || !b.value) { out.innerHTML = ''; return; }
    if (a.value === b.value) {
      out.innerHTML = '<div class="callout">The green valve and the cylinder valve can&rsquo;t be the same one &mdash; double-check in game.</div>';
      return;
    }
    var combo = GK_VALVES[a.value + '|' + b.value];
    var html = '<table class="data-table"><thead><tr><th>Valve</th><th>Set to</th></tr></thead><tbody>';
    Object.keys(combo).forEach(function (name) {
      html += '<tr><td><b>' + name + '</b></td><td style="font-size:1.3em"><b>' + combo[name] + '</b></td></tr>';
    });
    html += '<tr><td><b>' + b.value + '</b></td><td>leave it &mdash; take the cylinder once the others are set</td></tr>';
    html += '</tbody></table>';
    out.innerHTML = html;
  }
  a.addEventListener('change', render);
  b.addEventListener('change', render);
}
