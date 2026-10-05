/* Motor de Aula — Tarefa em Paz
 * A IA escreve só o CONTEÚDO (um objeto) e chama TarefaEmPaz.aula({...}).
 * Este arquivo cuida de tudo o resto: telas, navegação, dicas, placar, resumo, cópia, tema.
 * Sem dependências. Funciona sem localStorage (só não retoma de onde parou).
 */
(function () {
  'use strict';
  var VERSAO = '1.0.0';
  var NL = String.fromCharCode(10);

  /* ---------- estilo ---------- */
  var CSS = [
    ':root{--bg:#F3F6F4;--card:#fff;--fg:#1D2A24;--muted:#56665E;--line:#D7E0DA;--accent:#1F7A5A;--accent-fg:#fff;--soft:#E3F1EA;--sol:#F4B63F;--ok:#17653A;--ok-bg:#DDF3E4;--no:#B3261E;--no-bg:#FBE3E1;--hint:#FFF4D6;color-scheme:light}',
    '@media (prefers-color-scheme:dark){:root:not([data-tep="light"]){--bg:#111814;--card:#18221D;--fg:#E6EFEA;--muted:#9DB0A6;--line:#2A3831;--accent:#4CC196;--accent-fg:#0D1A14;--soft:#1E3129;--sol:#F4C65A;--ok:#7FDBA6;--ok-bg:#123A27;--no:#FF9A92;--no-bg:#4A1B19;--hint:#3A3010;color-scheme:dark}}',
    ':root[data-tep="dark"]{--bg:#111814;--card:#18221D;--fg:#E6EFEA;--muted:#9DB0A6;--line:#2A3831;--accent:#4CC196;--accent-fg:#0D1A14;--soft:#1E3129;--sol:#F4C65A;--ok:#7FDBA6;--ok-bg:#123A27;--no:#FF9A92;--no-bg:#4A1B19;--hint:#3A3010;color-scheme:dark}',
    '*{box-sizing:border-box}html,body{margin:0;height:100%}',
    'body{background:var(--bg);color:var(--fg);font:400 19px/1.5 "Nunito",system-ui,-apple-system,"Segoe UI",sans-serif}',
    '.tep{display:grid;grid-template-rows:auto minmax(0,1fr) auto;height:100%;max-width:760px;margin:0 auto;padding-inline:16px}',
    '.tep-top{padding:10px 0 6px;display:flex;flex-direction:column;gap:6px}',
    '.tep-row{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:14px;font-weight:800;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}',
    '.tep-bar{height:10px;border-radius:99px;background:var(--line);overflow:hidden}.tep-bar i{display:block;height:100%;width:0;background:var(--sol);border-radius:99px;transition:width .3s}',
    '.tep-theme{border:2px solid var(--line);background:var(--card);color:var(--fg);border-radius:999px;min-width:44px;min-height:40px;font-size:18px;cursor:pointer}',
    '.tep-main{overflow:auto;min-height:0;padding:8px 0 16px}',
    '.tep h1{font:800 clamp(28px,6vw,38px)/1.1 "Baloo 2",system-ui,sans-serif;margin:6px 0 14px}',
    '.tep h2{font:800 clamp(24px,5vw,32px)/1.15 "Baloo 2",system-ui,sans-serif;margin:4px 0 12px}',
    '.tep p{margin:0 0 12px}',
    '.tep mark{background:var(--sol);color:#2A1E00;padding:0 .2em;border-radius:5px}',
    '.tep-card{background:var(--card);border:2px solid var(--line);border-radius:16px;padding:14px 16px;margin:0 0 12px}',
    '.tep-big{font-size:52px;line-height:1;margin-bottom:8px}',
    '.tep-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:0 0 12px}',
    '.tep-grid .tep-card{margin:0;border-color:var(--accent)}',
    '.tep-grid b{display:block;font-size:20px;margin-bottom:4px}',
    '.tep-steps{list-style:none;padding:0;margin:0 0 12px;display:grid;gap:10px;counter-reset:p}',
    '.tep-steps li{counter-increment:p;display:grid;grid-template-columns:38px 1fr;gap:10px;align-items:start;background:var(--card);border:2px solid var(--line);border-radius:14px;padding:10px 12px}',
    '.tep-steps li::before{content:counter(p);width:34px;height:34px;border-radius:50%;background:var(--accent);color:var(--accent-fg);display:grid;place-items:center;font-weight:800}',
    '.tep-pair{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px}.tep-pair div{background:var(--card);border:2px solid var(--line);border-radius:12px;padding:10px}',
    '.tep-muda{font-size:16px;color:var(--muted);margin:0 0 12px}',
    '.tep-wrong,.tep-right{border-radius:14px;padding:10px 12px;margin:0 0 10px;border:2px solid}',
    '.tep-wrong{background:var(--no-bg);border-color:var(--no)}.tep-right{background:var(--ok-bg);border-color:var(--ok)}',
    '.tep-pocket{font:800 clamp(22px,5vw,28px)/1.25 "Baloo 2",system-ui,sans-serif;background:var(--accent);color:var(--accent-fg);border-radius:18px;padding:16px 18px;margin:0 0 12px}',
    '.tep-table{overflow-x:auto;margin:0 0 12px}.tep-table table{border-collapse:collapse;width:100%;font-size:17px}.tep-table td,.tep-table th{border:2px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}.tep-table th{background:var(--soft)}',
    '.tep-q{font-size:21px;font-weight:700;margin:0 0 14px}',
    '.tep-tag{display:inline-block;font-size:14px;font-weight:800;background:var(--soft);color:var(--accent);border-radius:999px;padding:4px 12px;margin-bottom:8px}',
    '.tep-opts{display:grid;gap:10px}',
    '.tep-opt{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;text-align:left;padding:10px 14px;border-radius:14px;border:2px solid var(--line);background:var(--card);color:var(--fg);font-family:inherit;font-weight:700;font-size:18px;line-height:1.3;cursor:pointer}',
    '.tep-opt .k{flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--accent);font-weight:800}',
    '.tep-opt:disabled{cursor:default}.tep-opt.ok{border-color:var(--ok);background:var(--ok-bg)}.tep-opt.no{border-color:var(--no);background:var(--no-bg)}',
    '.tep-fb{border-radius:14px;padding:12px 14px;margin-top:14px;border:2px solid}',
    '.tep-fb.ok{border-color:var(--ok);background:var(--ok-bg)}.tep-fb.no{border-color:var(--no);background:var(--no-bg)}.tep-fb.hint{border-color:var(--sol);background:var(--hint)}',
    '.tep-cls{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 12px;border:2px solid var(--line);border-radius:14px;background:var(--card);margin-bottom:8px}',
    '.tep-cls.ok{border-color:var(--ok);background:var(--ok-bg)}.tep-cls.no{border-color:var(--no);background:var(--no-bg)}',
    '.tep-tgs{display:flex;gap:6px;flex-wrap:wrap}.tep-tg{min-height:46px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--card);color:var(--fg);font-family:inherit;font-weight:800;font-size:16px;cursor:pointer}',
    '.tep-tg.on{background:var(--accent);border-color:var(--accent);color:var(--accent-fg)}',
    '@media (max-width:520px){.tep-cls{grid-template-columns:1fr}.tep-pair{grid-template-columns:1fr}}',
    '.tep-kw{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}.tep-kw span{background:var(--sol);color:#2A1E00;border-radius:999px;padding:4px 12px;font-weight:800}',
    '.tep-score{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 12px}.tep-score div{background:var(--card);border:2px solid var(--line);border-radius:16px;padding:10px;text-align:center}.tep-score b{display:block;font:800 34px "Baloo 2",system-ui;color:var(--accent)}',
    '.tep textarea{width:100%;min-height:200px;border:2px solid var(--line);border-radius:14px;background:var(--card);color:var(--fg);padding:10px;font:15px/1.45 ui-monospace,Consolas,monospace}',
    '.tep-btn{min-height:52px;padding:0 20px;border-radius:14px;border:2px solid var(--accent);background:var(--accent);color:var(--accent-fg);font-family:inherit;font-weight:800;font-size:18px;cursor:pointer}',
    '.tep-btn.ghost{background:transparent;color:var(--accent)}.tep-btn:disabled{opacity:.4;cursor:not-allowed}',
    '.tep-nav{display:flex;gap:10px;align-items:center;padding:10px 0 calc(10px + env(safe-area-inset-bottom,0px));border-top:2px solid var(--line)}',
    '.tep-need{flex:1;min-width:0;text-align:center;font-size:14px;color:var(--muted)}',
    '.tep button:focus-visible{outline:3px solid var(--sol);outline-offset:2px}',
    '.tep-msg{min-height:26px;font-weight:800;margin-top:10px}',
    '@media (prefers-reduced-motion:reduce){.tep-bar i{transition:none}}'
  ].join('');

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // **negrito** e ==destaque== são os únicos formatos aceitos no conteúdo
  function fmt(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/==(.+?)==/g, '<mark>$1</mark>');
  }
  function plain(s) { return String(s == null ? '' : s).replace(/\*\*|==/g, ''); }
  function arr(x) { return Array.isArray(x) ? x : (x == null || x === '' ? [] : [x]); }
  function slug(s) { return plain(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'aula'; }
  // a IA pode mandar a resposta certa como índice (0, 1…), letra ("B") ou texto da opção
  function idxCerta(q) {
    var o = arr(q.opcoes), c = q.correta;
    if (typeof c === 'number' && c >= 0 && c < o.length) return c;
    if (typeof c === 'string') {
      var t = c.trim();
      if (/^[A-Fa-f]$/.test(t) && o.length > 1) { var k = t.toUpperCase().charCodeAt(0) - 65; if (k < o.length) return k; }
      if (/^\d+$/.test(t) && +t < o.length) return +t;
      for (var i = 0; i < o.length; i++) if (plain(o[i]).trim().toLowerCase() === plain(t).toLowerCase()) return i;
    }
    return 0;
  }
  function store() { try { var k = '__t'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } }

  /* ---------- visuais do Bloco 2 ---------- */
  function visual(v) {
    if (!v || !v.tipo) return '';
    var h = '';
    if (v.tipo === 'caixas') {
      h = '<div class="tep-grid">' + arr(v.itens).map(function (i) { return '<div class="tep-card"><b>' + fmt(i.titulo) + '</b>' + fmt(i.texto) + '</div>'; }).join('') + '</div>';
    } else if (v.tipo === 'passos') {
      h = '<ol class="tep-steps">' + arr(v.itens).map(function (i) { return '<li><span>' + fmt(i) + '</span></li>'; }).join('') + '</ol>';
    } else if (v.tipo === 'contraste') {
      h = arr(v.pares).map(function (p) { return '<div class="tep-pair"><div>' + fmt(p.a) + '</div><div>' + fmt(p.b) + '</div></div><p class="tep-muda">O que muda: ' + fmt(p.muda) + '</p>'; }).join('');
    } else if (v.tipo === 'errado_certo') {
      h = '<div class="tep-wrong">❌ ' + fmt(v.errado) + '</div><div class="tep-right">✅ ' + fmt(v.certo) + '</div>';
    } else if (v.tipo === 'destaque') {
      h = '<div class="tep-pocket">' + fmt(v.texto) + '</div>';
    } else if (v.tipo === 'tabela') {
      var cab = arr(v.cabecalho), lin = arr(v.linhas);
      h = '<div class="tep-table"><table>' + (cab.length ? '<tr>' + cab.map(function (c) { return '<th>' + fmt(c) + '</th>'; }).join('') + '</tr>' : '') +
        lin.map(function (l) { return '<tr>' + arr(l).map(function (c) { return '<td>' + fmt(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
    } else if (v.tipo === 'emoji') {
      h = '<div class="tep-big" aria-hidden="true">' + esc(v.texto) + '</div>';
    }
    return h;
  }

  /* ---------- motor ---------- */
  function aula(A) {
    A = A || {};
    var adulto = A.adulto || 'adulto';
    var personagem = A.personagem || 'um amigo';
    var KEY = 'tep-' + slug(A.titulo) + '-' + (A.data || '');
    var LS = store();

    // monta a lista de telas
    var T = [];
    T.push({ tipo: 'gancho', bloco: '🧭 Missão' });
    arr(A.explicacao).forEach(function (e) { T.push({ tipo: e.tipo === 'checagem' ? 'checagem' : 'explica', bloco: e.tipo === 'checagem' ? '⚡ Checagem rápida' : '📖 A aula', d: e }); });
    var tr = arr(A.treino), de = arr(A.desafio);
    tr.forEach(function (q, i) { T.push({ tipo: 'treino', bloco: '🤝 Treino guiado', n: i + 1, tot: tr.length, d: q }); });
    de.forEach(function (q, i) { T.push({ tipo: q.tipo === 'classificar' ? 'classificar' : 'desafio', bloco: '🏆 Desafio', n: i + 1, tot: de.length, d: q }); });
    T.push({ tipo: 'explique', bloco: '🗣️ Explique' });
    T.push({ tipo: 'fim', bloco: '🎉 Fechamento' });

    var S = { i: 0, r: {}, voz: null, fim: false, msg: '' };
    if (LS) try { var sv = JSON.parse(LS.getItem(KEY) || 'null'); if (sv && typeof sv.i === 'number') { S = sv; S.r = S.r || {}; } } catch (e) {}
    if (S.i < 0 || S.i >= T.length) S.i = 0;
    function save() { if (LS) try { LS.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

    // estrutura da página
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    if (!document.querySelector('meta[name=viewport]')) { var mv = document.createElement('meta'); mv.name = 'viewport'; mv.content = 'width=device-width,initial-scale=1,viewport-fit=cover'; document.head.appendChild(mv); }
    try { var fl = document.createElement('link'); fl.rel = 'stylesheet'; fl.href = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&family=Nunito:wght@400;700;800&display=swap'; document.head.appendChild(fl); } catch (e) {}
    if (!document.title) document.title = plain(A.titulo || 'Aula');
    var root = document.createElement('div'); root.className = 'tep';
    root.innerHTML = '<header class="tep-top"><div class="tep-row"><span id="tep-b"></span><span id="tep-c"></span><button class="tep-theme" id="tep-th" aria-label="Trocar tema claro ou escuro">◐</button></div><div class="tep-bar" role="progressbar" aria-label="Progresso da aula"><i id="tep-p"></i></div></header>' +
      '<main class="tep-main" id="tep-m" tabindex="-1" aria-live="polite"></main>' +
      '<footer class="tep-nav"><button class="tep-btn ghost" id="tep-v">← Voltar</button><span class="tep-need" id="tep-n"></span><button class="tep-btn" id="tep-a">Avançar →</button></footer>';
    document.body.innerHTML = ''; document.body.appendChild(root);
    var $ = function (id) { return document.getElementById(id); };
    try { var tm = LS && LS.getItem('tep-tema'); if (tm) document.documentElement.setAttribute('data-tep', tm); } catch (e) {}
    $('tep-th').onclick = function () {
      var dark = document.documentElement.getAttribute('data-tep') === 'dark' || (!document.documentElement.getAttribute('data-tep') && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
      var nv = dark ? 'light' : 'dark'; document.documentElement.setAttribute('data-tep', nv); if (LS) try { LS.setItem('tep-tema', nv); } catch (e) {}
    };

    /* placar */
    function placar() {
      var t = 0, d = 0, c = 0, nc = 0, errs = [];
      T.forEach(function (s, i) {
        var r = S.r[i];
        if (s.tipo === 'treino') {
          if (r && r.fim && r.ok1) t++;
          if (r && r.fim && !r.ok1) {
            var o = arr(s.d.opcoes), ok = idxCerta(s.d);
            errs.push('- Treino ' + s.n + ': ' + plain(s.d.pergunta) + ' → marcou "' + plain(o[r.t[0]]) + '"' + (r.t[1] === ok ? ', acertou na 2ª tentativa' : '; certa: "' + plain(o[ok]) + '"'));
          }
        } else if (s.tipo === 'desafio') {
          if (r && r.fim && r.ok1) d++;
          if (r && r.fim && !r.ok1) { var o2 = arr(s.d.opcoes); errs.push('- Desafio ' + s.n + ': ' + plain(s.d.pergunta) + ' → marcou "' + plain(o2[r.t[0]]) + '"; certa: "' + plain(o2[idxCerta(s.d)]) + '"'); }
        } else if (s.tipo === 'classificar') {
          if (r && r.fim && r.ok1) d++;
          if (r && r.fim && !r.ok1) {
            var cols = arr(s.d.colunas), bad = [];
            arr(s.d.itens).forEach(function (it, k) { if (r.sel[k] !== it.coluna) bad.push(plain(it.texto) + ' → ' + plain(cols[r.sel[k]]) + ' (certo: ' + plain(cols[it.coluna]) + ')'); });
            errs.push('- Desafio ' + s.n + ': ' + bad.join('; '));
          }
        } else if (s.tipo === 'checagem') { nc++; if (r && r.fim && r.ok1) c++; }
      });
      return { t: t, d: d, c: c, nc: nc, errs: errs };
    }
    function resumo() {
      var p = placar(), L = [];
      L.push('Aula: ' + plain(A.titulo) + (A.materia ? ' (' + plain(A.materia) + ')' : '') + (A.data ? ' · ' + A.data : ''));
      L.push('Treino guiado: ' + p.t + '/' + tr.length + ' de primeira · Desafio: ' + p.d + '/' + de.length);
      if (p.nc) L.push('Checagens rápidas: ' + p.c + '/' + p.nc + ' de primeira');
      L.push(p.errs.length ? 'Itens errados:' : 'Itens errados: nenhum');
      p.errs.forEach(function (e) { L.push(e); });
      L.push('Explicação em voz alta: ' + (S.voz || 'não avaliada'));
      return L.join(NL);
    }

    /* cópia em 3 níveis */
    function copiar(cb) {
      var txt = resumo(), done = false;
      function fim(ok) {
        if (done) return; done = true;
        var ta = $('tep-ta');
        if (!ok && ta) { ta.focus(); ta.select(); try { ta.setSelectionRange(0, ta.value.length); } catch (e) {} }
        S.msg = ok ? '✅ Copiado! Volte ao chat, cole e envie.' : 'Aperte Ctrl+C (no tablet: toque e segure → Copiar).';
        save(); var m = $('tep-msg'); if (m) m.textContent = S.msg; if (cb) cb(ok);
      }
      function velho() {
        var ok = false;
        try { var t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'; t.style.left = '-9999px'; document.body.appendChild(t); t.select(); ok = document.execCommand('copy'); document.body.removeChild(t); } catch (e) { ok = false; }
        fim(ok);
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { fim(true); }, velho);
        else velho();
      } catch (e) { velho(); }
      setTimeout(function () { if (!done) velho(); }, 1500);
    }

    /* telas */
    function opcoes(s, r, liberadas) {
      var o = arr(s.d.opcoes), ok = idxCerta(s.d), h = '<div class="tep-opts">';
      o.forEach(function (txt, k) {
        var c = 'tep-opt', dis = false, mk = '';
        var tentada = r && r.t && r.t.indexOf(k) >= 0;
        if (r && r.fim) { dis = true; if (k === ok) { c += ' ok'; mk = ' ✓'; } else if (tentada) { c += ' no'; mk = ' ✗'; } }
        else if (tentada) { c += ' no'; dis = true; mk = ' ✗'; }
        h += '<button class="' + c + '" data-k="' + k + '"' + (dis || !liberadas ? ' disabled' : '') + '><span class="k">' + String.fromCharCode(65 + k) + '</span><span>' + fmt(txt) + mk + '</span></button>';
      });
      return h + '</div>';
    }
    function tela(s, r) {
      var d = s.d || {}, h = '';
      if (s.tipo === 'gancho') {
        var g = A.gancho || {};
        h = (g.emoji ? '<div class="tep-big" aria-hidden="true">' + esc(g.emoji) + '</div>' : '') + '<h1>' + fmt(g.titulo || A.titulo) + '</h1>' + arr(g.texto).map(function (p) { return '<p>' + fmt(p) + '</p>'; }).join('');
      } else if (s.tipo === 'explica') {
        h = '<h2>' + fmt(d.titulo) + '</h2>' + arr(d.texto).map(function (p) { return '<p>' + fmt(p) + '</p>'; }).join('') + visual(d.visual);
      } else if (s.tipo === 'checagem' || s.tipo === 'treino' || s.tipo === 'desafio') {
        h = (s.n ? '<span class="tep-tag">' + s.n + ' de ' + s.tot + '</span>' : '') + '<p class="tep-q">' + fmt(d.pergunta) + '</p>' + opcoes(s, r, true);
        if (r && r.t && r.t.length) {
          var ok = idxCerta(d), ult = r.t[r.t.length - 1], acertou = ult === ok;
          if (s.tipo === 'treino' && !r.fim) h += '<div class="tep-fb hint" role="status"><b>Quase! Dica:</b> ' + fmt(d.dica || 'Leia de novo com calma e procure a pista principal.') + ' Tente outra vez.</div>';
          else if (acertou) h += '<div class="tep-fb ok" role="status"><b>' + (r.t.length > 1 ? 'Agora sim!' : 'Isso!') + '</b> ' + fmt(d.porque) + '</div>';
          else {
            h += '<div class="tep-fb no" role="status"><b>A resposta certa é "' + fmt(arr(d.opcoes)[ok]) + '".</b> ' + fmt(d.porque) + '</div>';
            if (s.tipo === 'checagem') h += '<div class="tep-fb hint"><b>Veja outro exemplo:</b> ' + fmt(d.outro_exemplo || d.porque) + (r.ack ? '' : '<br><button class="tep-btn ghost" id="tep-ack" style="margin-top:10px">Entendi</button>') + '</div>';
          }
        }
      } else if (s.tipo === 'classificar') {
        var cols = arr(d.colunas), its = arr(d.itens), sel = (r && r.sel) || its.map(function () { return -1; });
        h = '<span class="tep-tag">' + s.n + ' de ' + s.tot + '</span><p class="tep-q">' + fmt(d.pergunta || 'Toque na coluna certa de cada item.') + '</p>';
        its.forEach(function (it, k) {
          var c = 'tep-cls' + (r && r.fim ? (sel[k] === it.coluna ? ' ok' : ' no') : '');
          h += '<div class="' + c + '"><span>' + fmt(it.texto) + (r && r.fim ? (sel[k] === it.coluna ? ' ✓' : ' ✗ (certo: ' + fmt(cols[it.coluna]) + ')') : '') + '</span><div class="tep-tgs">' +
            cols.map(function (cn, j) { return '<button class="tep-tg' + (sel[k] === j ? ' on' : '') + '" data-r="' + k + '" data-j="' + j + '"' + (r && r.fim ? ' disabled' : '') + '>' + fmt(cn) + '</button>'; }).join('') + '</div></div>';
        });
        if (!(r && r.fim)) h += '<button class="tep-btn" id="tep-conf"' + (sel.every(function (x) { return x > -1; }) ? '' : ' disabled') + '>Conferir</button>';
        else h += '<div class="tep-fb ' + (r.ok1 ? 'ok' : 'no') + '" role="status">' + (r.ok1 ? '<b>Acertou tudo!</b> ' : '<b>Confira as marcadas.</b> ') + fmt(d.porque) + '</div>';
      } else if (s.tipo === 'explique') {
        var ex = A.explique || {};
        h = '<h2>Explique para ' + esc(personagem) + '</h2><p class="tep-q">' + fmt(ex.pergunta || ('Como você explicaria o que aprendeu hoje para ' + personagem + '?')) + '</p>' +
          (arr(ex.palavras).length ? '<p>Palavras de apoio:</p><div class="tep-kw">' + arr(ex.palavras).map(function (w) { return '<span>' + fmt(w) + '</span>'; }).join('') + '</div>' : '') +
          '<div class="tep-card"><b>Fale em voz alta para o ' + esc(adulto) + '.</b> Não precisa escrever nada.</div><p><b>' + esc(adulto.charAt(0).toUpperCase() + adulto.slice(1)) + ', toque depois de ouvir:</b></p><div class="tep-opts">' +
          ['Explicou bem sozinho', 'Explicou com ajuda', 'Travou'].map(function (v) { return '<button class="tep-opt' + (S.voz === v ? ' ok' : '') + '" data-voz="' + v + '">' + v + (S.voz === v ? ' ✓' : '') + '</button>'; }).join('') + '</div>';
      } else if (s.tipo === 'fim') {
        var p = placar();
        if (S.fim) h = '<div class="tep-big" aria-hidden="true">🎉</div><h1>Aula concluída!</h1><p>Chame o ' + esc(adulto) + ' para mostrar o resumo.</p>';
        else h = '<h1>' + fmt((A.fechamento && A.fechamento.titulo) || 'Missão cumprida!') + '</h1><div class="tep-score"><div><b>' + p.t + '/' + tr.length + '</b>Treino guiado</div><div><b>' + p.d + '/' + de.length + '</b>Desafio</div></div><p>' + fmt((A.fechamento && A.fechamento.mensagem) || 'Você usou a estratégia até o fim. Isso é o que faz aprender!') + '</p>';
        h += '<p><b>Resumo para o ' + esc(adulto) + ':</b></p><textarea id="tep-ta" readonly aria-label="Resumo da aula">' + esc(resumo()) + '</textarea><button class="tep-btn ghost" id="tep-cp" style="margin-top:10px">Copiar resumo para o ' + esc(adulto) + '</button><div class="tep-msg" id="tep-msg" role="status">' + esc(S.msg || '') + '</div>';
      }
      return h;
    }
    function pode(s, r) {
      if (s.tipo === 'treino' || s.tipo === 'desafio' || s.tipo === 'classificar') return { ok: !!(r && r.fim), why: 'Responda para continuar' };
      if (s.tipo === 'checagem') return { ok: !!(r && r.fim && (r.ok1 || r.ack || r.t[r.t.length - 1] === idxCerta(s.d))), why: 'Responda e veja o exemplo para continuar' };
      if (s.tipo === 'explique') return { ok: !!S.voz, why: 'O ' + adulto + ' toca uma opção para continuar' };
      return { ok: true, why: '' };
    }
    function render() {
      var s = T[S.i], r = S.r[S.i];
      $('tep-m').innerHTML = tela(s, r);
      $('tep-b').textContent = s.bloco;
      $('tep-c').textContent = 'Tela ' + (S.i + 1) + ' de ' + T.length;
      $('tep-p').style.width = Math.round(S.i / (T.length - 1) * 100) + '%';
      $('tep-v').style.visibility = S.i === 0 ? 'hidden' : 'visible';
      var pd = pode(s, r), a = $('tep-a');
      a.style.display = (s.tipo === 'fim' && S.fim) ? 'none' : '';
      a.textContent = s.tipo === 'fim' ? 'Terminei!' : (S.i === 0 ? 'Bora! →' : 'Avançar →');
      a.disabled = !pd.ok; $('tep-n').textContent = pd.ok ? '' : pd.why;
      bind(s);
    }
    function bind(s) {
      var m = $('tep-m');
      Array.prototype.forEach.call(m.querySelectorAll('.tep-opt[data-k]'), function (b) { b.onclick = function () { responder(+b.getAttribute('data-k')); }; });
      Array.prototype.forEach.call(m.querySelectorAll('.tep-tg'), function (b) { b.onclick = function () { classe(+b.getAttribute('data-r'), +b.getAttribute('data-j')); }; });
      Array.prototype.forEach.call(m.querySelectorAll('[data-voz]'), function (b) { b.onclick = function () { S.voz = b.getAttribute('data-voz'); save(); render(); }; });
      var ack = $('tep-ack'); if (ack) ack.onclick = function () { S.r[S.i].ack = true; save(); render(); };
      var cf = $('tep-conf'); if (cf) cf.onclick = conferir;
      var cp = $('tep-cp'); if (cp) cp.onclick = function () { copiar(); };
    }
    function responder(k) {
      var s = T[S.i], ok = idxCerta(s.d), r = S.r[S.i] || (S.r[S.i] = { t: [], fim: false });
      if (r.fim || r.t.indexOf(k) >= 0) return;
      r.t.push(k);
      if (r.t.length === 1) r.ok1 = (k === ok);
      if (s.tipo === 'treino') { if (k === ok || r.t.length >= 2) r.fim = true; }
      else r.fim = true;
      save(); render();
    }
    function classe(k, j) {
      var s = T[S.i], r = S.r[S.i] || (S.r[S.i] = { sel: arr(s.d.itens).map(function () { return -1; }), fim: false });
      if (r.fim) return; r.sel[k] = j; save(); render();
    }
    function conferir() {
      var s = T[S.i], r = S.r[S.i]; if (!r || r.fim) return;
      r.fim = true; r.ok1 = arr(s.d.itens).every(function (it, k) { return r.sel[k] === it.coluna; }); save(); render();
    }
    $('tep-v').onclick = function () { if (S.fim && T[S.i].tipo === 'fim') { S.fim = false; } else if (S.i > 0) S.i--; save(); render(); $('tep-m').scrollTop = 0; };
    $('tep-a').onclick = function () {
      var s = T[S.i]; if (!pode(s, S.r[S.i]).ok) return;
      if (s.tipo === 'fim') { copiar(function () { S.fim = true; save(); render(); }); return; }
      S.i++; save(); render(); $('tep-m').scrollTop = 0;
    };
    render();
    window.TarefaEmPaz._estado = function () { return { S: S, T: T, resumo: resumo() }; };
  }

  /* erro amigável se o conteúdo vier quebrado */
  function seguro(A) {
    try { aula(A); } catch (e) {
      document.body.innerHTML = '<div style="font:18px/1.5 system-ui;max-width:640px;margin:40px auto;padding:16px">⚠️ A aula veio com um problema e não abriu. Volte ao chat e peça: <b>"refaça a aula"</b>.<br><small style="color:#888">' + esc(e && e.message) + '</small></div>';
    }
  }
  window.TarefaEmPaz = { aula: seguro, versao: VERSAO };
})();
