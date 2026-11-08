/* @ds-bundle: {"format":4,"namespace":"AgentUI","components":[{"name":"Node"},{"name":"BranchNode"},{"name":"Palette"},{"name":"Inspector"},{"name":"Button"},{"name":"SegmentedControl"},{"name":"Badge"},{"name":"Chip"},{"name":"Input"},{"name":"Switch"},{"name":"Toolbar"},{"name":"Canvas"},{"name":"PageHeader"},{"name":"Card"},{"name":"StatTile"},{"name":"BarChart"},{"name":"Bars"},{"name":"Distribution"},{"name":"DataTable"},{"name":"WorkflowCard"},{"name":"Menu"},{"name":"EmptyState"},{"name":"CommandPalette"},{"name":"ThemeToggle"},{"name":"MiniMap"},{"name":"Chat"}]} */
/* Agent-UI runtime — tiny, dependency-free. Components are CSS classes in bundle.css;
   this script only ships the icon set and DOM builders so consumers do not retype markup. */
(function () {
  var S = 'http://www.w3.org/2000/svg';
  // Line glyphs on a 16px grid, stroke 1.5, currentColor. Original, generic shapes.
  var ICONS = {
    agent:    'M4 3.5l9 4.5-9 4.5v-9z',
    classify: 'M3 4.5h3M3 8h3M3 11.5h3M8 4.5h5M8 8h5M8 11.5h5',
    end:      'M4 4h8v8H4z',
    note:     'M4 3h6l3 3v7H4V3zM10 3v3h3',
    file:     'M4 3h8v10H4zM6 6.5h4M6 9.5h4',
    shield:   'M8 2.5l5 2v3.5c0 2.7-2 4.6-5 5.5-3-.9-5-2.8-5-5.5V4.5l5-2zM6 8l1.5 1.5L10 6.5',
    mcp:      'M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z',
    ifelse:   'M4 3v10M4 3c0 3 8 2 8 5M4 13c0-3 8-2 8-5M12 6.5l-1.5 1.5L12 9.5',
    'while':  'M13 8a5 5 0 1 1-1.5-3.5M13 3v2.5h-2.5',
    approval: 'M6 13V6.5l2-4c.8 0 1.3.6 1.1 1.4L8.7 6H12c.9 0 1.4.8 1.2 1.6l-1 4C12 12.5 11.4 13 10.6 13H6zM3 6.5h3V13H3z',
    transform:'M3 4h3l4 8h3M3 12h3M10 4h3M12 2.5L13.5 4 12 5.5M12 10.5l1.5 1.5-1.5 1.5',
    state:    'M8 8m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M8 2.5v2M8 11.5v2M2.5 8h2M11.5 8h2M4.1 4.1l1.4 1.4M10.5 10.5l1.4 1.4M11.9 4.1l-1.4 1.4M5.5 10.5l-1.4 1.4',
    play:     'M5 3.5l8 4.5-8 4.5v-9z',
    pencil:   'M3 13l.8-3.2L10.5 3l2.5 2.5-6.8 6.8L3 13zM9.5 4l2.5 2.5',
    hand:     'M6.5 9.5V4a1 1 0 0 1 2 0v4M8.5 8V3a1 1 0 0 1 2 0v5M10.5 8V4a1 1 0 0 1 2 0v5.5c0 2.5-1.5 4-4 4H8c-1.2 0-2-.5-2.8-1.6L3.4 9.3a1 1 0 0 1 1.6-1.2l1.5 1.4',
    cursor:   'M4 3l9 4.5-4 1-2 4L4 3z',
    undo:     'M6 5H3.5v2.5M3.5 7.5A5 5 0 1 1 5 11',
    redo:     'M10 5h2.5v2.5M12.5 7.5A5 5 0 1 0 11 11',
    code:     'M6 4.5L2.5 8 6 11.5M10 4.5L13.5 8 10 11.5',
    plus:     'M8 3v10M3 8h10',
    chevron:  'M5 6.5L8 9.5l3-3',
    updown:   'M5.5 6l2.5-2.5L10.5 6M5.5 10l2.5 2.5 2.5-2.5',
    more:     'M4 8h.01M8 8h.01M12 8h.01',
    copy:     'M6 6h7v7H6zM3 10V3h7',
    trash:    'M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.7 8.5h5.6l.7-8.5',
    schema:   'M6 3H4.5v4L3 8l1.5 1v4H6M10 3h1.5v4L13 8l-1.5 1v4H10',
    external: 'M7 3H3v10h10V9M9 3h4v4M13 3L7 9',
    wand:     'M3 13l7-7M10 3l.7 1.6L12.5 5l-1.8.4L10 7l-.7-1.6L7.5 5l1.8-.4L10 3z',
    back:     'M10 3.5L5.5 8 10 12.5',
    chart:    'M2.5 13.5h11M4 11V7M7 11V4M10 11V8.5M13 11V5.5',
    clock:    'M8 8m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0-11 0M8 5v3l2 1.5',
    tokens:   'M3 13V7M6.5 13V3M10 13V9M13.5 13V5',
    arrowup:  'M8 13V3M4 7l4-4 4 4',
    arrowdown:'M8 3v10M4 9l4 4 4-4',
    check:    'M3.5 8.5l3 3 6-7',
    close:    'M4 4l8 8M12 4l-8 8',
    tree:     'M8 3v3M8 6L4 10M8 6l4 4M4 10v3M12 10v3',
    search:   'M7 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M10 10l3.5 3.5',
    sun:      'M8 8m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M12.6 3.4l-1 1M4.4 11.6l-1 1',
    moon:     'M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5z',
    layout:   'M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9zM7 5h2M7 11h2M5 7v2M11 7v2',
    enter:    'M13 4v4H4M6.5 5.5L4 8l2.5 2.5',
    send:     'M8 13V3M4 7l4-4 4 4',
    attach:   'M10.5 5.5l-4.6 4.6a1.5 1.5 0 0 0 2.1 2.1L12.6 7.6a3 3 0 0 0-4.2-4.2L3.8 8'
  };
  var FAMILY = { agent:'agent', classify:'logic', end:'end', start:'end', note:'note', file:'tool', shield:'tool', mcp:'tool', ifelse:'logic', 'while':'logic', approval:'logic', transform:'data', state:'data' };

  function icon(name, size) {
    var svg = document.createElementNS(S, 'svg');
    svg.setAttribute('viewBox', '0 0 16 16'); svg.setAttribute('width', size || 16); svg.setAttribute('height', size || 16);
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round'); svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(S, 'path'); p.setAttribute('d', ICONS[name] || ICONS.agent); svg.appendChild(p);
    return svg;
  }
  function el(tag, cls, attrs) { var e = document.createElement(tag); if (cls) e.className = cls; if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function tile(kind) { var t = el('span', 'aui-node__tile', { 'data-family': FAMILY[kind] || 'agent' }); t.appendChild(icon(kind)); return t; }

  /** Node({ kind, title, meta, branches?, selected? }) → element */
  function Node(o) {
    var n = el('div', 'aui-node', { 'data-kind': o.kind, 'data-selected': o.selected ? 'true' : 'false' });
    var head = el('div', 'aui-node__head'); head.appendChild(tile(o.kind));
    var txt = el('div'); var t = el('div', 'aui-node__title'); t.textContent = o.title; txt.appendChild(t);
    if (o.meta) { var m = el('div', 'aui-node__meta'); m.textContent = o.meta; txt.appendChild(m); }
    head.appendChild(txt); n.appendChild(head);
    if (o.input !== false && o.kind !== 'start') n.appendChild(el('span', 'aui-handle aui-handle--in'));
    if (o.branches && o.branches.length) {
      var wrap = el('div', 'aui-node__branches');
      o.branches.forEach(function (b) { var r = el('div', 'aui-branch'); r.textContent = b; r.appendChild(el('span', 'aui-handle aui-handle--out')); wrap.appendChild(r); });
      n.appendChild(wrap);
    } else if (o.kind !== 'end') { n.appendChild(el('span', 'aui-handle aui-handle--out')); }
    return n;
  }
  /** Palette({ sections: [{ label, items: [{ kind, label }] }] }) */
  function Palette(o) {
    var p = el('div', 'aui-palette', { role: 'list' });
    o.sections.forEach(function (s) {
      var h = el('div', 'aui-palette__section'); h.textContent = s.label; p.appendChild(h);
      s.items.forEach(function (it) { var b = el('button', 'aui-palette__item', { type: 'button', draggable: 'true' }); b.appendChild(tile(it.kind)); var l = el('span'); l.textContent = it.label; b.appendChild(l); p.appendChild(b); });
    });
    return p;
  }
  /** Button({ label?, icon?, variant: solid|soft|outline|ghost|danger, size?: sm|md|lg, pill?, iconOnly? }) */
  function Button(o) {
    var cls = 'aui-btn aui-btn--' + (o.variant || 'soft') + (o.size ? ' aui-btn--' + o.size : '') + (o.pill ? ' aui-btn--pill' : '') + (o.iconOnly ? ' aui-btn--icon' : '');
    var b = el('button', cls, { type: 'button' }); if (o.ariaLabel) b.setAttribute('aria-label', o.ariaLabel);
    if (o.icon) b.appendChild(icon(o.icon)); if (o.label && !o.iconOnly) { var s = el('span'); s.textContent = o.label; b.appendChild(s); }
    if (o.disabled) b.disabled = true; return b;
  }
  function Switch(checked) { var s = el('button', 'aui-switch', { type: 'button', role: 'switch', 'aria-checked': checked ? 'true' : 'false' }); s.addEventListener('click', function () { s.setAttribute('aria-checked', s.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); }); return s; }
  function Badge(label, tone) { var b = el('span', 'aui-badge' + (tone ? ' aui-badge--' + tone : '')); b.textContent = label; return b; }
  function Chip(label, iconName) { var c = el('button', 'aui-chip', { type: 'button' }); if (iconName) c.appendChild(icon(iconName)); var s = el('span'); s.textContent = label; c.appendChild(s); return c; }
  function Segmented(items) { var g = el('div', 'aui-segmented', { role: 'group' }); items.forEach(function (it) { var b = el('button', 'aui-segmented__item', { type: 'button', 'aria-pressed': it.pressed ? 'true' : 'false', 'aria-label': it.label }); b.appendChild(icon(it.icon)); b.addEventListener('click', function () { g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true'); }); g.appendChild(b); }); return g; }
  function Toolbar(items) { var t = el('div', 'aui-toolbar', { role: 'toolbar' }); items.forEach(function (it) { var b = Button({ icon: it.icon, variant: 'ghost', iconOnly: true, ariaLabel: it.label, disabled: it.disabled }); if (it.pressed) b.setAttribute('aria-pressed', 'true'); t.appendChild(b); }); return t; }

  /* ---------------- Data display ---------------- */
  var SN = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, cls) { var e = document.createElementNS(SN, tag); if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); if (cls) e.setAttribute('class', cls); return e; }
  function txt(tag, cls, text) { var e = el(tag, cls); e.textContent = text; return e; }
  var fmtN = function (n) { return Number(n).toLocaleString(); };

  /** PageHeader({ title, sub, actions: [elements] }) */
  function PageHeader(o) { var h = el('div', 'aui-page__head'); var l = el('div'); l.appendChild(txt('div', 'aui-page__title', o.title)); if (o.sub) l.appendChild(txt('div', 'aui-page__sub', o.sub)); h.appendChild(l); var a = el('div', 'aui-page__actions'); (o.actions || []).forEach(function (x) { a.appendChild(x); }); h.appendChild(a); return h; }
  /** SegmentedText(items:[{value,label,pressed}]) — text segments for filters and ranges */
  function SegmentedText(items) { var g = el('div', 'aui-segmented aui-segmented--text', { role: 'group' }); items.forEach(function (it) { var b = el('button', 'aui-segmented__item', { type: 'button', 'aria-pressed': it.pressed ? 'true' : 'false' }); b.textContent = it.label; b.addEventListener('click', function () { g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true'); }); g.appendChild(b); }); return g; }
  /** Card({ title, sub, legend: [[label, cssColor]], body: element, foot?: element }) */
  function Card(o) { var c = el('div', 'aui-card'); var h = el('div', 'aui-card__head'); var l = el('div'); l.appendChild(txt('div', 'aui-card__title', o.title)); if (o.sub) l.appendChild(txt('div', 'aui-card__sub', o.sub)); h.appendChild(l); if (o.legend) { var lg = el('div', 'aui-legend'); o.legend.forEach(function (p) { var i = el('span', 'aui-legend__item'); var sw = el('span', 'aui-legend__swatch'); sw.style.background = p[1]; i.appendChild(sw); i.appendChild(document.createTextNode(p[0])); lg.appendChild(i); }); h.appendChild(lg); } c.appendChild(h); if (o.body) c.appendChild(o.body); if (o.foot) { var f = el('div', 'aui-card__foot'); f.appendChild(o.foot); c.appendChild(f); } return c; }
  /** Sparkline(series, {width,height}) — one hue, area under the line, dot on the last point */
  function Sparkline(series, o) { o = o || {}; var w = o.width || 112, h = o.height || 32, max = Math.max.apply(null, [1].concat(series)); var svg = sv('svg', { width: w, height: h, viewBox: '0 0 ' + w + ' ' + h, 'aria-hidden': 'true' }, 'aui-spark'); var pts = series.map(function (v, i) { return [(i / Math.max(1, series.length - 1)) * w, h - 2 - (v / max) * (h - 6)]; }); var line = pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' '); svg.appendChild(sv('path', { d: 'M0,' + h + ' L' + line.replace(/ /g, ' L') + ' L' + w + ',' + h + ' Z' }, 'aui-spark__area')); svg.appendChild(sv('polyline', { points: line }, 'aui-spark__line')); var last = pts[pts.length - 1]; svg.appendChild(sv('circle', { cx: last[0], cy: last[1], r: 2.5 }, 'aui-spark__dot')); return svg; }
  /** StatTile({ label, icon?, value, unit?, delta?: {text, good}|null, foot?, series? }) */
  function StatTile(o) { var t = el('div', 'aui-tile'); var l = el('div', 'aui-tile__label'); if (o.icon) l.appendChild(icon(o.icon, 14)); l.appendChild(document.createTextNode(o.label)); t.appendChild(l); var r = el('div', 'aui-tile__row'); var v = txt('div', 'aui-tile__value', o.value); if (o.unit) v.appendChild(txt('span', 'aui-tile__unit', o.unit)); r.appendChild(v); if (o.series) r.appendChild(Sparkline(o.series)); t.appendChild(r); var f = el('div', 'aui-tile__foot'); if (o.delta) { var d = el('span', 'aui-delta' + (o.delta.good === true ? ' aui-delta--up' : o.delta.good === false ? ' aui-delta--down' : '')); d.appendChild(icon(o.delta.text.charAt(0) === '-' ? 'arrowdown' : 'arrowup', 12)); d.appendChild(document.createTextNode(o.delta.text)); f.appendChild(d); f.appendChild(document.createTextNode(o.foot || 'vs prior period')); } else { f.appendChild(document.createTextNode(o.foot || '')); } t.appendChild(f); return t; }
  /** BarChart({ days: [{label, segments: [{key, value}]}], keys: [{key, label, cls}], width?, height? }) — stacked bars, rounded data-end, hover tooltip */
  function BarChart(o) { var W = o.width || 560, H = o.height || 170, padL = 28, padB = 22, padT = 20; var days = o.days, keys = o.keys; var tot = function (d) { return d.segments.reduce(function (n, s) { return n + s.value; }, 0); }; var max = Math.max.apply(null, [1].concat(days.map(tot))); var innerW = W - padL - 8, innerH = H - padB - padT, step = innerW / days.length, bw = Math.min(28, step * 0.6); var y = function (v) { return padT + innerH - (v / max) * innerH; }; var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': o.label || 'Bar chart' }, 'aui-chart'); [0, Math.ceil(max / 2), max].forEach(function (tk) { svg.appendChild(sv('line', { x1: padL, x2: W - 8, y1: y(tk), y2: y(tk) }, 'aui-chart__grid')); var t = sv('text', { x: padL - 6, y: y(tk) + 4, 'text-anchor': 'end' }, 'aui-chart__tick'); t.textContent = tk; svg.appendChild(t); }); var tip = null; days.forEach(function (d, i) { var g = sv('g', null, 'aui-chart__col'); var x = padL + i * step + (step - bw) / 2; var acc = 0, segs = d.segments.filter(function (s) { return s.value > 0; }); segs.forEach(function (s, j) { var y1 = y(acc + s.value), y0 = y(acc); acc += s.value; var k = keys.filter(function (k) { return k.key === s.key; })[0]; var gap = j ? 2 : 0; var hh = Math.max(0, y0 - y1 - gap), yy = y1 + gap, r; if (j === segs.length - 1 && hh > 4) { var rr = 4; r = sv('path', { d: 'M' + x + ',' + (yy + hh) + ' V' + (yy + rr) + ' a' + rr + ',' + rr + ' 0 0 1 ' + rr + ',-' + rr + ' h' + (bw - 2 * rr) + ' a' + rr + ',' + rr + ' 0 0 1 ' + rr + ',' + rr + ' V' + (yy + hh) + ' Z' }, 'aui-chart__bar ' + (k && k.cls ? k.cls : '')); } else { r = sv('rect', { x: x, y: yy, width: bw, height: hh }, 'aui-chart__bar ' + (k && k.cls ? k.cls : '')); } g.appendChild(r); }); if (i === 0 || i === days.length - 1 || days.length <= 14 || i % 5 === 0) { var lab = sv('text', { x: padL + i * step + step / 2, y: H - 6, 'text-anchor': 'middle' }, 'aui-chart__tick'); lab.textContent = d.label; g.appendChild(lab); } var hit = sv('rect', { x: padL + i * step, y: padT, width: step, height: innerH }, 'aui-chart__hit'); g.appendChild(hit); g.addEventListener('mouseenter', function () { if (tip) tip.remove(); if (!tot(d)) return; tip = sv('g', { transform: 'translate(' + Math.min(W - 128, Math.max(padL, padL + i * step + step / 2 - 60)) + ',' + 2 + ')' }); var box = sv('rect', { width: 120, height: 14 + 15 * (1 + segs.length), rx: 8 }, 'aui-tip'); tip.appendChild(box); var tt = sv('text', { x: 8, y: 14 }, 'aui-tip__t'); tt.textContent = d.label + ' · ' + tot(d); tip.appendChild(tt); segs.forEach(function (s, j) { var k = keys.filter(function (k) { return k.key === s.key; })[0]; var tv = sv('text', { x: 8, y: 29 + 15 * j }, 'aui-tip__v'); tv.textContent = (k ? k.label : s.key) + ': ' + s.value; tip.appendChild(tv); }); svg.appendChild(tip); }); g.addEventListener('mouseleave', function () { if (tip) { tip.remove(); tip = null; } }); svg.appendChild(g); }); return svg; }
  /** Bars({ rows: [{label, value, display, kind?}] }) — magnitude by category, one hue, direct values */
  function Bars(o) { var w = el('div', 'aui-bars'); var max = Math.max.apply(null, [1].concat(o.rows.map(function (r) { return r.value; }))); o.rows.forEach(function (r) { var row = el('div', 'aui-bar'); if (r.title) row.title = r.title; var l = el('span', 'aui-bar__label'); if (r.kind) l.appendChild(tile(r.kind)); l.appendChild(document.createTextNode(r.label)); row.appendChild(l); var t = el('span', 'aui-bar__track'); var f = el('span', 'aui-bar__fill'); f.style.width = (r.value / max * 100) + '%'; t.appendChild(f); row.appendChild(t); row.appendChild(txt('span', 'aui-bar__v', r.display != null ? r.display : fmtN(r.value))); w.appendChild(row); }); return w; }
  /** Distribution({ groups: [{name, kind?, parts: [{label, value}]}] }) — one stacked bar per group with a key */
  function Distribution(o) { var w = el('div', 'aui-dist'); o.groups.forEach(function (g) { var grp = el('div', 'aui-dist__group'); var n = el('div', 'aui-dist__name'); if (g.kind) n.appendChild(tile(g.kind)); n.appendChild(document.createTextNode(g.name)); grp.appendChild(n); var total = g.parts.reduce(function (s, p) { return s + p.value; }, 0) || 1; var bar = el('div', 'aui-dist__bar'); g.parts.forEach(function (p) { var sg = el('span', 'aui-dist__seg'); sg.style.width = (p.value / total * 100) + '%'; sg.title = p.label + ': ' + p.value; bar.appendChild(sg); }); grp.appendChild(bar); var keys = el('div', 'aui-dist__keys'); g.parts.forEach(function (p) { var k = el('span', 'aui-dist__key'); k.appendChild(el('i')); k.appendChild(document.createTextNode(p.label + ' ')); k.appendChild(txt('b', null, String(p.value))); keys.appendChild(k); }); grp.appendChild(keys); w.appendChild(grp); }); return w; }
  /** DataTable({ columns: [{key, label, num?, cls?}], rows: [{...}], onRow? }) — cells may be strings or elements */
  function DataTable(o) { var t = el('table', 'aui-table' + (o.onRow ? ' aui-table--rows' : '')); var th = el('thead'); var tr = el('tr'); o.columns.forEach(function (c) { var h = txt('th', c.num ? 'is-num' : '', c.label); tr.appendChild(h); }); th.appendChild(tr); t.appendChild(th); var tb = el('tbody'); o.rows.forEach(function (r) { var row = el('tr'); o.columns.forEach(function (c) { var td = el('td', (c.num ? 'is-num ' : '') + (c.cls || '')); var v = r[c.key]; if (v && typeof v === 'object' && v.nodeType) td.appendChild(v); else td.textContent = v == null ? '' : String(v); row.appendChild(td); }); if (o.onRow) row.addEventListener('click', function () { o.onRow(r); }); tb.appendChild(row); }); t.appendChild(tb); return t; }
  /** GraphThumb({ nodes: [{id, x, y, kind}], edges: [{source, target}], width?, height? }) */
  function GraphThumb(o) { var W = o.width || 280, H = o.height || 116; var svg = sv('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' }); if (!o.nodes.length) return svg; var xs = o.nodes.map(function (n) { return n.x; }), ys = o.nodes.map(function (n) { return n.y; }); var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs) + 100, minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys) + 50; var s = Math.min((W - 24) / Math.max(1, maxX - minX), (H - 24) / Math.max(1, maxY - minY), 0.5); var ox = 12 + ((W - 24) - (maxX - minX) * s) / 2, oy = 12 + ((H - 24) - (maxY - minY) * s) / 2; var pos = {}; o.nodes.forEach(function (n) { pos[n.id] = [ox + (n.x - minX) * s, oy + (n.y - minY) * s]; }); var w = 90 * s, h = 44 * s; o.edges.forEach(function (e) { var a = pos[e.source], b = pos[e.target]; if (!a || !b) return; var x1 = a[0] + w, y1 = a[1] + h / 2, x2 = b[0], y2 = b[1] + h / 2, mx = (x1 + x2) / 2; svg.appendChild(sv('path', { d: 'M' + x1 + ',' + y1 + ' C' + mx + ',' + y1 + ' ' + mx + ',' + y2 + ' ' + x2 + ',' + y2 }, 'aui-thumb__edge')); }); o.nodes.forEach(function (n) { var p = pos[n.id]; svg.appendChild(sv('rect', { x: p[0], y: p[1], width: w, height: h, rx: 8 * s + 2 }, 'aui-thumb__node')); var tl = sv('rect', { x: p[0] + 4, y: p[1] + 4, width: h - 8, height: h - 8, rx: 4, 'data-family': FAMILY[n.kind] || 'agent' }, 'aui-thumb__tile'); svg.appendChild(tl); }); return svg; }
  /** WorkflowCard({ name, status: 'draft'|'live', meta, stats: [{v, k}], graph: GraphThumb input, menu?: Menu items }) */
  function WorkflowCard(o) { var c = el('div', 'aui-wfcard', { role: 'link', tabindex: '0' }); var th = el('div', 'aui-wfcard__thumb'); th.appendChild(GraphThumb(o.graph)); c.appendChild(th); var b = el('div', 'aui-wfcard__body'); var row = el('div', 'aui-wfcard__row'); row.appendChild(txt('div', 'aui-wfcard__name', o.name)); row.appendChild(Badge(o.status === 'live' ? 'Live' : 'Draft', o.status === 'live' ? 'success' : undefined)); b.appendChild(row); if (o.meta) b.appendChild(txt('div', 'aui-wfcard__meta', o.meta)); var st = el('div', 'aui-wfcard__stats'); (o.stats || []).forEach(function (s) { var x = el('span', 'aui-stat'); x.appendChild(txt('span', 'aui-stat__v', s.v)); x.appendChild(txt('span', 'aui-stat__k', s.k)); st.appendChild(x); }); b.appendChild(st); c.appendChild(b); if (o.menu) { var m = el('div', 'aui-wfcard__menu'); var btn = Button({ icon: 'more', variant: 'ghost', iconOnly: true, pill: true, size: 'sm', ariaLabel: 'Actions' }); m.appendChild(btn); var menu = Menu(o.menu); menu.hidden = true; m.appendChild(menu); btn.addEventListener('click', function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; }); c.appendChild(m); } return c; }
  /** Menu([{label, icon?, danger?, sep?, onClick?}]) */
  function Menu(items) { var m = el('div', 'aui-menu', { role: 'menu' }); items.forEach(function (it) { if (it.sep) { m.appendChild(el('div', 'aui-menu__sep')); return; } var b = el('button', 'aui-menu__item' + (it.danger ? ' aui-menu__item--danger' : ''), { type: 'button', role: 'menuitem' }); if (it.icon) b.appendChild(icon(it.icon, 14)); b.appendChild(document.createTextNode(it.label)); if (it.onClick) b.addEventListener('click', it.onClick); m.appendChild(b); }); return m; }
  /** EmptyState({ icon, title, sub, action?: element }) */
  function EmptyState(o) { var e = el('div', 'aui-empty'); var i = el('span', 'aui-empty__icon'); i.appendChild(icon(o.icon || 'tree', 18)); e.appendChild(i); e.appendChild(txt('div', 'aui-empty__title', o.title)); if (o.sub) e.appendChild(txt('div', 'aui-empty__sub', o.sub)); if (o.action) e.appendChild(o.action); return e; }


  /* ---------------- Command palette, theme toggle, minimap ---------------- */
  /** CommandPalette({ placeholder?, groups: [{label, items:[{label, icon?|kind?, hint?, onSelect}]}], onClose }) → backdrop element; call .open() / .close() */
  function CommandPalette(o) {
    var back = el('div', 'aui-cmdk-backdrop aui'); var box = el('div', 'aui-cmdk', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Command palette' });
    var row = el('div', 'aui-cmdk__input-row'); row.appendChild(icon('search', 16)); var input = el('input', 'aui-cmdk__input', { type: 'text', placeholder: o.placeholder || 'Type a command or search…', 'aria-label': 'Search commands' }); row.appendChild(input); var esc = el('span', 'kbd'); esc.textContent = 'esc'; row.appendChild(esc); box.appendChild(row);
    var list = el('div', 'aui-cmdk__list', { role: 'listbox' }); box.appendChild(list);
    var foot = el('div', 'aui-cmdk__foot'); [['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']].forEach(function (p) { var s = el('span'); var k = el('span', 'kbd'); k.textContent = p[0]; s.appendChild(k); s.appendChild(document.createTextNode(p[1])); foot.appendChild(s); }); box.appendChild(foot);
    back.appendChild(box);
    var sel = 0, flat = [];
    function render() { var q = input.value.trim().toLowerCase(); list.innerHTML = ''; flat = []; o.groups.forEach(function (g) { var items = g.items.filter(function (it) { return !q || it.label.toLowerCase().indexOf(q) >= 0 || (it.keywords || '').toLowerCase().indexOf(q) >= 0; }); if (!items.length) return; list.appendChild(txt('div', 'aui-cmdk__group', g.label)); items.forEach(function (it) { var b = el('button', 'aui-cmdk__item', { type: 'button', role: 'option', 'aria-selected': flat.length === sel ? 'true' : 'false' }); if (it.kind) b.appendChild(tile(it.kind)); else { var ic = el('span', 'aui-cmdk__icon'); ic.appendChild(icon(it.icon || 'chevron', 16)); b.appendChild(ic); } b.appendChild(txt('span', 'aui-cmdk__label', it.label)); if (it.hint) { var h = el('span', 'aui-cmdk__hint'); if (/^[⌘⇧⌥]/.test(it.hint)) { var k = el('span', 'kbd'); k.textContent = it.hint; h.appendChild(k); } else h.textContent = it.hint; b.appendChild(h); } b.addEventListener('click', function () { close(); it.onSelect && it.onSelect(); }); b.addEventListener('mousemove', function () { var i = flat.indexOf(it); if (i !== sel) { sel = i; render(); } }); list.appendChild(b); flat.push(it); }); }); if (!flat.length) list.appendChild(txt('div', 'aui-cmdk__empty', 'No matches')); var cur = list.querySelector('[aria-selected="true"]'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' }); }
    function close() { back.remove(); o.onClose && o.onClose(); }
    input.addEventListener('input', function () { sel = 0; render(); });
    input.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(flat.length - 1, sel + 1); render(); } else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); render(); } else if (e.key === 'Enter') { e.preventDefault(); var it = flat[sel]; if (it) { close(); it.onSelect && it.onSelect(); } } else if (e.key === 'Escape') { close(); } });
    back.addEventListener('mousedown', function (e) { if (e.target === back) close(); });
    back.open = function (parent) { (parent || document.body).appendChild(back); render(); input.focus(); return back; };
    back.close = close; back.render = render;
    return back;
  }
  /** ThemeToggle() → ghost pill button that flips <html data-theme> and remembers it in localStorage('agent-ui.theme') */
  function ThemeToggle() { var b = el('button', 'aui-btn aui-btn--ghost aui-btn--icon aui-btn--pill aui-theme-toggle', { type: 'button', 'aria-label': 'Toggle theme', title: 'Toggle theme' }); var s = icon('sun'); s.setAttribute('class', 'aui-theme-toggle__sun'); var m = icon('moon'); m.setAttribute('class', 'aui-theme-toggle__moon'); b.appendChild(s); b.appendChild(m); b.addEventListener('click', function () { var root = document.documentElement; var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', next); try { localStorage.setItem('agent-ui.theme', next); } catch (e) {} }); return b; }
  /** MiniMap({ nodes:[{id,x,y,w,h,kind}], viewport:{x,y,w,h} }) → card with the graph at scale and the viewport mask */
  function MiniMap(o) { var c = el('div', 'aui-minimap', { 'aria-hidden': 'true' }); var W = 180, H = 110; var xs = o.nodes.map(function (n) { return n.x; }), ys = o.nodes.map(function (n) { return n.y; }); var minX = Math.min.apply(null, xs.concat([o.viewport ? o.viewport.x : Infinity])), minY = Math.min.apply(null, ys.concat([o.viewport ? o.viewport.y : Infinity])); var maxX = Math.max.apply(null, o.nodes.map(function (n) { return n.x + (n.w || 100); }).concat([o.viewport ? o.viewport.x + o.viewport.w : -Infinity])), maxY = Math.max.apply(null, o.nodes.map(function (n) { return n.y + (n.h || 48); }).concat([o.viewport ? o.viewport.y + o.viewport.h : -Infinity])); var s = Math.min((W - 16) / Math.max(1, maxX - minX), (H - 16) / Math.max(1, maxY - minY)); var ox = 8 + ((W - 16) - (maxX - minX) * s) / 2, oy = 8 + ((H - 16) - (maxY - minY) * s) / 2; var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H }); o.nodes.forEach(function (n) { svg.appendChild(sv('rect', { x: ox + (n.x - minX) * s, y: oy + (n.y - minY) * s, width: (n.w || 100) * s, height: (n.h || 48) * s, rx: 2, 'data-family': FAMILY[n.kind] || 'agent' }, 'aui-minimap__node')); }); if (o.viewport) svg.appendChild(sv('rect', { x: ox + (o.viewport.x - minX) * s, y: oy + (o.viewport.y - minY) * s, width: o.viewport.w * s, height: o.viewport.h * s, rx: 3 }, 'aui-minimap__mask')); c.appendChild(svg); return c; }

  /** Chat({ messages, placeholder?, busy?, empty?, onSend?, onStop?, onNew? }) → column with log + composer; .append(msg), .setBusy(b), .clear() */
  function ChatMessage(m) {
    if (m.role === 'user') { var u = el('div', 'aui-msg aui-msg--user'); u.textContent = m.text; return u; }
    var s = el('div', 'aui-msg aui-msg--step', { 'data-state': m.state || 'done' });
    var row = el('div', 'aui-msg__row'); var ic = el('span', 'aui-msg__icon');
    if (m.state === 'running') { var sp = el('span', 'aui-spinner', { role: 'status', 'aria-label': 'Running' }); ic.appendChild(sp); } else ic.appendChild(icon(m.kind || 'agent'));
    row.appendChild(ic); var nm = el('span'); nm.textContent = m.name || ''; row.appendChild(nm);
    if (m.status) { var st = el('span', 'aui-msg__status', { 'data-state': m.state || 'done' }); st.textContent = m.status; row.appendChild(st); }
    s.appendChild(row);
    if (m.responseId) { var r = el('div', 'aui-msg__resp'); r.appendChild(icon('external', 12)); var rt = el('span'); rt.textContent = m.responseId; r.appendChild(rt); s.appendChild(r); }
    if (m.reply) { var rp = el('div', 'aui-msg__reply'); if (typeof m.reply === 'string') rp.textContent = m.reply; else rp.appendChild(m.reply); s.appendChild(rp); }
    return s;
  }
  function Chat(o) {
    var root = el('div', 'aui-chat'), busy = !!o.busy;
    if (o.onNew) { var top = el('div', 'aui-chat__top'); top.appendChild(Button({ label: 'New chat', icon: 'pencil', variant: 'ghost', size: 'sm' })); top.lastChild.addEventListener('click', o.onNew); root.appendChild(top); }
    var log = el('div', 'aui-chat__log', { role: 'log', 'aria-live': 'polite' }); root.appendChild(log);
    var empty = el('div', 'aui-chat__empty'); var ei = el('span', 'aui-chat__empty-icon'); ei.appendChild(icon('wand', 18)); empty.appendChild(ei);
    var et = el('div', 'aui-chat__empty-title'); et.textContent = (o.empty && o.empty.title) || 'Preview your agent'; empty.appendChild(et);
    var es = el('div', 'aui-chat__empty-sub'); es.textContent = (o.empty && o.empty.sub) || "Prompt the agent as if you're the user."; empty.appendChild(es);
    function sync() { empty.style.display = log.children.length > (log.contains(empty) ? 1 : 0) ? 'none' : ''; if (!log.contains(empty)) log.appendChild(empty); }
    var comp = el('div', 'aui-composer'); var ta = el('textarea', 'aui-composer__input', { rows: '1', placeholder: o.placeholder || 'Send a message…', 'aria-label': 'Message' }); comp.appendChild(ta);
    var bar = el('div', 'aui-composer__bar'); var tools = el('div', 'aui-composer__tools'); var at = el('button', 'aui-composer__attach', { type: 'button', 'aria-label': 'Attach' }); at.appendChild(icon('attach')); tools.appendChild(at); bar.appendChild(tools);
    var send = el('button', 'aui-composer__send', { type: 'button', 'aria-label': 'Send' }); bar.appendChild(send); comp.appendChild(bar); root.appendChild(comp);
    function paint() { send.innerHTML = ''; if (busy) { send.setAttribute('aria-label', 'Stop'); send.removeAttribute('disabled'); send.appendChild(el('span', 'aui-composer__stop')); } else { send.setAttribute('aria-label', 'Send'); if (!ta.value.trim()) send.setAttribute('disabled', ''); else send.removeAttribute('disabled'); send.appendChild(icon('send', 14)); } }
    function submit() { var t = ta.value.trim(); if (!t || busy) return; ta.value = ''; paint(); if (o.onSend) o.onSend(t); }
    ta.addEventListener('input', paint); ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } });
    send.addEventListener('click', function () { if (busy) { if (o.onStop) o.onStop(); } else submit(); });
    root.append = function (m) { var n = ChatMessage(m); log.insertBefore(n, empty); sync(); log.scrollTop = log.scrollHeight; return n; };
    root.setBusy = function (b) { busy = !!b; paint(); };
    root.clear = function () { while (log.firstChild) log.removeChild(log.firstChild); sync(); };
    (o.messages || []).forEach(function (m) { log.appendChild(ChatMessage(m)); }); sync(); paint(); if (typeof requestAnimationFrame === 'function') requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; });
    return root;
  }

  /** edgePath(x1,y1,x2,y2) → the source's smooth-step bezier: horizontal tangents, midpoint control points */
  function edgePath(x1, y1, x2, y2) { var mx = (x1 + x2) / 2; return 'M' + x1 + ',' + y1 + ' C' + mx + ',' + y1 + ' ' + mx + ',' + y2 + ' ' + x2 + ',' + y2; }

  window.AgentUI = { version: '1.0.0', icons: ICONS, family: FAMILY, icon: icon, tile: tile, Node: Node, Palette: Palette, Button: Button, Switch: Switch, Badge: Badge, Chip: Chip, SegmentedControl: Segmented, Toolbar: Toolbar, edgePath: edgePath,
    PageHeader: PageHeader, SegmentedText: SegmentedText, Card: Card, Sparkline: Sparkline, StatTile: StatTile, BarChart: BarChart, Bars: Bars, Distribution: Distribution, DataTable: DataTable, GraphThumb: GraphThumb, WorkflowCard: WorkflowCard, Menu: Menu, EmptyState: EmptyState, CommandPalette: CommandPalette, ThemeToggle: ThemeToggle, MiniMap: MiniMap, Chat: Chat, ChatMessage: ChatMessage };
})();
