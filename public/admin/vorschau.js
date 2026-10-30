// Vorschau im Redaktionssystem: Artikel und Stellen sehen aus wie auf der Website statt wie eine Feldliste.
(function () {
  if (!window.CMS || !window.h || !window.createClass) return;
  var h = window.h;
  function datumVon(v) {
    if (!v) return null;
    var d = v instanceof Date ? v : new Date(String(v).slice(0, 10) + 'T06:00:00');
    return isNaN(d) ? null : d;
  }
  function deDatum(d) { return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function liste(v) { return v && v.toJS ? v.toJS() : (Array.isArray(v) ? v : []); }

  var Artikel = window.createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var g = function (k) { return data.get(k); };
      var text = String(g('body') || '');
      var minuten = g('lesezeit') || Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
      var d = datumVon(g('datum'));
      var bild = g('bild') ? this.props.getAsset(g('bild')) : null;
      var heute = new Date(); heute.setHours(0, 0, 0, 0);
      var hinweis = g('entwurf') ? 'Als Entwurf zurückgehalten: Der Artikel erscheint noch nicht auf der Website.'
        : (d && d > heute ? 'Geplant: geht am ' + deDatum(d) + ' morgens automatisch online.' : null);
      return h('article', { className: 'bv-artikel' },
        hinweis ? h('div', { className: 'bv-hinweis' }, hinweis) : null,
        h('div', { className: 'bv-badge' }, 'Der Chef auf der Baustelle', h('b', {}, 'Teil ' + (g('teil') || '…'))),
        h('h1', {}, g('titel') || 'Titel fehlt noch'),
        g('lead') ? h('p', { className: 'bv-lead' }, g('lead')) : null,
        h('p', { className: 'bv-meta' }, (d ? deDatum(d) + ' · ' : '') + minuten + ' Min. Lesezeit · Domenico Bentivegna'),
        bild ? h('img', { className: 'bv-bild', src: bild.toString(), alt: g('bild_alt') || '' })
          : h('div', { className: 'bv-titelkarte' }, h('span', {}, 'Teil ' + (g('teil') || '…')), g('titel') || ''),
        h('div', { className: 'bv-text' }, this.props.widgetFor('body')),
        g('aufgabe') ? h('aside', { className: 'bv-aufgabe' }, h('b', {}, 'Deine Aufgabe für diese Woche'), h('p', {}, g('aufgabe'))) : null
      );
    }
  });

  var Stelle = window.createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var g = function (k) { return data.get(k); };
      var fakten = [['Umfang', g('umfang')], ['Ort', g('ort')], ['Arbeitsmodell', g('arbeitsmodell')], ['Start', g('start')]].filter(function (f) { return f[1]; });
      return h('article', { className: 'bv-artikel bv-stelle' },
        g('aktiv') === false ? h('div', { className: 'bv-hinweis' }, 'Stelle ist ausgeschaltet und erscheint nicht auf der Karriereseite.') : null,
        h('div', { className: 'bv-badge' }, 'Karriere', h('b', {}, 'Offene Stelle')),
        h('h1', {}, g('titel') || 'Stellentitel fehlt noch'),
        h('div', { className: 'bv-fakten' }, fakten.map(function (f, i) { return h('span', { key: i }, h('small', {}, f[0]), f[1]); })),
        h('div', { className: 'bv-spalten' },
          h('div', {}, h('h2', {}, 'Deine Aufgaben'), h('ul', {}, liste(g('aufgaben')).map(function (a, i) { return h('li', { key: i }, a); }))),
          h('div', {}, h('h2', {}, 'Was du mitbringst'), h('ul', {}, liste(g('anforderungen')).map(function (a, i) { return h('li', { key: i }, a); })))),
        h('div', { className: 'bv-text' }, this.props.widgetFor('body'))
      );
    }
  });

  CMS.registerPreviewTemplate('artikel', Artikel);
  CMS.registerPreviewTemplate('stellen', Stelle);
})();
