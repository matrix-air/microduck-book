/* 一人一鸭 · 图解页渲染器 vrender.js
   纯浏览器 JS，无依赖；数据来自同目录 vdata.js。
   用法：在 vhead.html(CSS) + vbody.html(容器) 之后、</body> 前内联引入，加载即渲染。 */

/* ---------- 工具 ---------- */
function set(id, html){ document.getElementById(id).innerHTML = html; }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function arrow(){ return '<span class="arrow">→</span>'; }
function fnode(t, d){
  return '<div class="fnode"><b>' + esc(t) + '</b><span>' + esc(d) + '</span></div>';
}
function frow(nodes){
  var h = "";
  for (var i = 0; i < nodes.length; i++){
    if (i > 0) h += arrow();
    h += nodes[i];
  }
  return '<div class="frow">' + h + '</div>';
}

/* ---------- 头部：九位分身 chips ---------- */
function rChips(){
  var h = "";
  for (var i = 0; i < AVATARS.length; i++){
    h += '<span class="chip"><span class="dot" style="background:' + PAL[i % PAL.length] + '"></span>'
       + esc(AVATARS[i][0]) + ' · ' + esc(AVATARS[i][1]) + '</span>';
  }
  set("chips", h);
}

/* ---------- 目录 toc ---------- */
function rToc(){
  var secs = [
    ["sec-spine","① 全书一图"],["sec-funnel","② 产品漏斗"],["sec-wings","③ 三翼飞轮"],
    ["sec-city","④ 单城开城"],["sec-gates","⑤ 四闸口"],["sec-rank","⑥ 段位"],
    ["sec-risk","⑦ 底线"],["sec-road","⑧ 路线图"]];
  var h = "";
  for (var i = 0; i < secs.length; i++) h += '<a href="#' + secs[i][0] + '">' + secs[i][1] + '</a>';
  set("toc", h);
}

/* ---------- ① 八环脉络 d-spine ---------- */
function rSpine(){
  var h = "";
  for (var i = 0; i < SPINE.length; i++){
    var r = SPINE[i];
    h += '<div class="srow"><div class="snum" style="background:' + r[3] + '">'
       + (r[0] > 0 ? r[0] : "↺") + '</div>'
       + '<div class="fnode"><b>' + esc(r[1]) + '</b><span>' + esc(r[2]) + '</span></div></div>';
  }
  set("d-spine", h);
}

/* ---------- ② 产品漏斗 d-funnel ---------- */
function rFunnel(){
  var h = "";
  for (var i = 0; i < FUNNEL.length; i++){
    var f = FUNNEL[i];
    h += '<div class="fbar" style="background:' + f[3] + ';width:' + f[2] + '%;min-width:280px">'
       + '<b>' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span></div>';
  }
  set("d-funnel", h);
}

/* ---------- ③ 三翼飞轮 d-wheel（手工 SVG） ---------- */
function rWheel(){
  var C = 240, R = 142;
  function pt(a){ var t = a * Math.PI / 180; return [C + R * Math.cos(t), C + R * Math.sin(t)]; }
  function f(n){ return Math.round(n * 100) / 100; }
  function arc(a1, a2){
    var p1 = pt(a1), p2 = pt(a2);
    return '<path d="M' + f(p1[0]) + ' ' + f(p1[1]) + ' A' + R + ' ' + R + ' 0 0 1 '
         + f(p2[0]) + ' ' + f(p2[1])
         + '" fill="none" stroke="#9aa3b0" stroke-width="2" opacity=".7" marker-end="url(#mArrow)"/>';
  }
  var s = '<svg id="wheel-svg" viewBox="0 0 480 480" width="480" height="480" style="max-width:100%;height:auto" role="img" aria-label="三翼飞轮">'
        + '<defs><marker id="mArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">'
        + '<path d="M0 0L10 5L0 10Z" fill="#9aa3b0"/></marker></defs>'
        /* 虚线环 */
        + '<circle cx="240" cy="240" r="142" fill="none" stroke="#9aa3b0" stroke-width="1.5" stroke-dasharray="4 7" opacity=".55"/>'
        /* 三段圆弧箭头（节点 -90/30/150，各留 ±40°） */
        + arc(-50, -10) + arc(70, 110) + arc(190, 230)
        /* 中心圆：开源内核 */
        + '<circle cx="240" cy="240" r="66" style="fill:var(--card)" stroke="#16a34a" stroke-width="2"/>'
        + '<text x="240" y="237" text-anchor="middle" font-size="16" font-weight="600" style="fill:var(--fg)">开源内核</text>'
        + '<text x="240" y="257" text-anchor="middle" font-size="11" style="fill:var(--mut)">复刻权 · 不变量</text>';
  var angs = [-90, 30, 150];
  for (var i = 0; i < WHEEL.length; i++){
    var w = WHEEL[i], p = pt(angs[i]);
    var subs = w[1].split("，");
    s += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="66" fill="' + w[2] + '"/>'
       + '<text x="' + f(p[0]) + '" y="' + (f(p[1]) - 14) + '" text-anchor="middle" font-size="14" font-weight="600" fill="#fff">' + esc(w[0]) + '</text>';
    if (subs.length >= 2){
      s += '<text x="' + f(p[0]) + '" y="' + (f(p[1]) + 6) + '" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.9)">' + esc(subs[0]) + '</text>'
         + '<text x="' + f(p[0]) + '" y="' + (f(p[1]) + 24) + '" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.9)">' + esc(subs.slice(1).join("，")) + '</text>';
    } else {
      s += '<text x="' + f(p[0]) + '" y="' + (f(p[1]) + 6) + '" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.9)">' + esc(w[1]) + '</text>';
    }
  }
  s += '</svg>';
  set("d-wheel", s);
}

/* ---------- ③ 家长翼五级梯子 d-parent ---------- */
function rParent(){
  var nodes = [];
  for (var i = 0; i < PARENT.length; i++) nodes.push(fnode(PARENT[i][0], PARENT[i][1]));
  set("d-parent", frow(nodes));
}

/* ---------- ④ 七大舱 d-cabins ---------- */
function rCabins(){
  var h = "";
  for (var i = 0; i < CABINS.length; i++){
    var c = CABINS[i];
    h += '<div class="dcard"><b>' + esc(c[0]) + ' ' + esc(c[1]) + '</b>'
       + '<div class="die">' + esc(c[2]) + '</div></div>';
  }
  set("d-cabins", h);
}

/* ---------- ④ W-6 倒排 d-wplan ---------- */
function rWplan(){
  var nodes = [];
  for (var i = 0; i < WPLAN.length; i++) nodes.push(fnode(WPLAN[i][0], WPLAN[i][1]));
  set("d-wplan", frow(nodes));
}

/* ---------- ④ 单城账速览 d-cityacc（口径取自 CABINS 数据） ---------- */
function rCityAcc(){
  var cost = CABINS[5][2].split(" · ");  /* ["成本 10–14 万", "保本 85% 满班"] */
  var crew = CABINS[3][2].split(" · ");  /* [.., "班组 11 人"] */
  var post = CABINS[4][2].split(" · ");  /* ["NPS 48h 回收>80%", ..] */
  var acc = [
    ["单城成本", cost[0]],
    ["保本线", cost[1]],
    ["班组规模", crew[1]],
    ["营后 NPS", post[0]]];
  var h = '<div class="glabel"><b>单城账速览</b></div><div class="frow">';
  for (var i = 0; i < acc.length; i++){
    if (i > 0) h += arrow();
    h += fnode(acc[i][0], acc[i][1]);
  }
  set("d-cityacc", h + '</div>');
}

/* ---------- ⑤ 四闸口 d-gates ---------- */
function rGates(){
  var h = "";
  for (var i = 0; i < GATES.length; i++){
    var g = GATES[i];
    h += '<div class="gwrap">'
       + '<div class="glabel"><b style="color:' + g[3] + '">' + esc(g[0]) + '</b>'
       + '<span style="color:var(--mut);font-size:12px">目标线 ' + g[2] + '%</span></div>'
       + '<div class="track"><div class="goal" style="left:' + g[2] + '%"></div></div>'
       + '<div class="gdie">' + esc(g[1]) + '</div></div>';
  }
  set("d-gates", h);
}

/* ---------- ⑤ 扩张节奏 d-expand ---------- */
function rExpand(){
  var nodes = [];
  for (var i = 0; i < EXPAND.length; i++) nodes.push(fnode(EXPAND[i][0], EXPAND[i][1]));
  set("d-expand", frow(nodes));
}

/* ---------- ⑥ 七级段位 d-ladder ---------- */
function rLadder(){
  var h = "";
  for (var i = 0; i < LADDER.length; i++){
    var l = LADDER[i];
    h += '<div class="lrow" style="background:' + l[2] + '">' + esc(l[0]) + '<small>' + esc(l[1]) + '</small></div>';
  }
  set("d-ladder", h);
}

/* ---------- ⑥ 三轨成长 d-tracks ---------- */
function rTracks(){
  var h = '<div class="frow">';
  for (var i = 0; i < TRACKS.length; i++){
    var t = TRACKS[i];
    h += '<div class="fnode" style="border-left:4px solid ' + t[3] + ';flex:1;min-width:220px">'
       + '<b style="color:' + t[3] + '">' + esc(t[0]) + '</b>'
       + '<span>' + esc(t[1]) + '</span>'
       + '<span style="display:block">' + esc(t[2]) + '</span></div>';
  }
  set("d-tracks", h + '</div>');
}

/* ---------- ⑥ 晋升通道 d-promo ---------- */
function rPromo(){
  var nodes = [];
  for (var i = 0; i < PROMO.length; i++) nodes.push(fnode(PROMO[i][0], PROMO[i][1]));
  set("d-promo", frow(nodes));
}

/* ---------- ⑦ 四季现金流 d-seasons ---------- */
function rSeasons(){
  var nodes = [];
  for (var i = 0; i < SEASONS.length; i++) nodes.push(fnode(SEASONS[i][0], SEASONS[i][1]));
  set("d-seasons", frow(nodes));
}

/* ---------- ⑦ 五坑预案 d-traps ---------- */
function rTraps(){
  var h = "";
  for (var i = 0; i < TRAPS.length; i++){
    var t = TRAPS[i];
    h += '<div class="dcard"><b>' + esc(t[0]) + ' ' + esc(t[1]) + '</b>'
       + '<div class="die">坑：' + esc(t[2]) + '</div>'
       + '<div class="plan">✔ ' + esc(t[3]) + '</div></div>';
  }
  set("d-traps", h);
}

/* ---------- ⑧ 路线图 d-road ---------- */
function rRoad(){
  var h = "";
  for (var i = 0; i < ROAD.length; i++){
    h += '<li><b>' + esc(ROAD[i][0]) + '</b><span>' + esc(ROAD[i][1]) + '</span></li>';
  }
  set("d-road", h);
}

/* ---------- 统一渲染（脚本置于 body 尾部，直接执行） ---------- */
rChips();
rToc();
rSpine();
rFunnel();
rWheel();
rParent();
rCabins();
rWplan();
rCityAcc();
rGates();
rExpand();
rLadder();
rTracks();
rPromo();
rSeasons();
rTraps();
rRoad();
