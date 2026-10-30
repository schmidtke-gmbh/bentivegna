# Erzeugt public/admin/oberflaeche.css: Gestaltung des Redaktionssystems im Bentivegna-Look
# (Farben, Schrift, Gruppen und Symbole in der Seitenleiste). Aufruf: python3 scripts/cms-oberflaeche.py
import os, re, urllib.parse
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
LUCIDE = ROOT + 'node_modules/lucide-static/icons/'

def icon(name):
    svg = open(LUCIDE + name + '.svg').read()
    svg = re.sub(r'<!--.*?-->', '', svg, flags=re.S)
    svg = re.sub(r'\s+', ' ', svg).replace('currentColor', '#000').strip()
    return 'url("data:image/svg+xml,' + urllib.parse.quote(svg, safe=' =:/"\'') .replace('"', "'") + '")'

SYMBOLE = {
    'artikel': 'newspaper', 'kapitel': 'book-open-text', 'buchreihe': 'sliders-horizontal',
    'startseite': 'house', 'karriere': 'briefcase-business', 'stellen': 'user-plus', 'funnel': 'list-checks',
    'einstellungen': 'contact', 'rechtliches': 'scale',
}
GRUPPEN = {'artikel': 'Buchreihe', 'startseite': 'Seiten der Website', 'einstellungen': 'Allgemein'}

css = []
css.append('''/* Redaktionssystem im Bentivegna-Look. Erzeugt von scripts/cms-oberflaeche.py, nicht von Hand ändern. */
@font-face{font-family:"Source Sans 3";font-weight:400;font-display:swap;src:url(schriften/source-sans-3-latin-400-normal.woff2) format("woff2")}
@font-face{font-family:"Source Sans 3";font-weight:600;font-display:swap;src:url(schriften/source-sans-3-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:"Source Sans 3";font-weight:700;font-display:swap;src:url(schriften/source-sans-3-latin-700-normal.woff2) format("woff2")}
:root{--bv-navy:#273365;--bv-navy-d:#1d2750;--bv-blau:#345c9a;--bv-gold:#998a6d;--bv-gold-d:#857759;--bv-sand:#ccc4af;--bv-creme:#f0efeb;--bv-linie:rgba(39,51,101,.12)}
body,button,input,textarea,select,[class*="css-"]{font-family:"Source Sans 3",system-ui,-apple-system,"Segoe UI",sans-serif!important}
body{background:var(--bv-creme)!important;color:#1c2233}

/* Kopfzeile */
[class*="-AppHeader-"]{background:var(--bv-navy)!important;box-shadow:0 6px 24px rgba(20,29,58,.18)!important;border:0!important}
[class*="-AppHeaderContent"]{max-width:1360px;padding-left:24px!important}
[class*="-AppHeaderContent"]{align-items:center!important}
[class*="-AppHeaderContent"]::before{content:"Bentivegna · Redaktion";display:flex;align-items:center;align-self:center;gap:10px;padding-left:46px;margin-right:34px;height:40px;flex:0 0 auto;color:#fff;font-weight:700;font-size:17px;letter-spacing:.01em;white-space:nowrap;
  background:url(../uploads/logos/schild.svg) 8px center/20px auto no-repeat,radial-gradient(circle at 18px 50%,#fff 0 17px,transparent 17.6px)}
[class*="-AppHeaderNavLink"],[class*="-AppHeaderButton"]{color:rgba(255,255,255,.78)!important;font-weight:600!important;border-radius:10px!important}
[class*="-AppHeaderNavLink"] svg,[class*="-AppHeaderButton"] svg,[class*="-AppHeaderNavLink"] [class*="-IconWrapper"],[class*="-AppHeaderButton"] [class*="-IconWrapper"]{color:inherit!important;fill:currentColor!important}
[class*="-AppHeaderNavLink"]:hover,[class*="-AppHeaderButton"]:hover{color:#fff!important;background:rgba(255,255,255,.08)!important}
[class*="-AppHeaderNavLink"].header-link-active{color:#fff!important;background:rgba(255,255,255,.12)!important;box-shadow:inset 0 -3px 0 var(--bv-gold)}
[class*="-AppHeaderQuickNewButton"]{background:var(--bv-gold)!important;color:#fff!important;border-radius:10px!important;font-weight:700!important;height:40px!important;line-height:40px!important;padding:0 34px 0 18px!important;font-size:14.5px!important}
[class*="-AppHeaderQuickNewButton"]::after{border-top-color:#fff!important}
[class*="-AppHeaderQuickNewButton"]:hover{background:var(--bv-gold-d)!important}
[class*="-AppHeaderSiteLink"]{color:#fff!important;font-weight:600}
[class*="-AppHeaderTestRepoIndicator"]{display:none!important}
[class*="-AvatarPlaceholderIcon"]{color:var(--bv-sand)!important}

/* Grundflächen */
[class*="-AppMainContainer"]{max-width:1360px!important}
[class*="-card-card"]{border-radius:16px!important;box-shadow:0 10px 30px rgba(20,29,58,.07),0 1px 3px rgba(20,29,58,.05)!important;border:1px solid var(--bv-linie)!important}
[class*="-SidebarHeading"],[class*="-CollectionTopHeading"],[class*="-WorkflowTopHeading"]{color:var(--bv-navy)!important;font-weight:700!important;letter-spacing:-.01em}
[class*="-CollectionTopDescription"],[class*="-WorkflowTopDescription"]{color:#5d6473!important;font-size:15.5px!important;line-height:1.55!important;max-width:640px}
[class*="-CollectionTopNewButton"],[class*="-SaveButton"],[class*="-PublishButton"]{background:var(--bv-gold)!important;color:#fff!important;border-radius:10px!important;font-weight:700!important;box-shadow:0 6px 16px rgba(153,138,109,.35)!important}
[class*="-CollectionTopNewButton"]:hover{background:var(--bv-gold-d)!important}
[class*="-SearchInput"]{border-radius:10px!important;background:var(--bv-creme)!important}

/* Seitenleiste mit Gruppen und Symbolen */
[class*="-SidebarNavList"] li{list-style:none}
[class*="-SidebarNavLink"]{border-radius:10px!important;margin:2px 10px!important;padding:11px 14px!important;font-weight:600!important;color:#3b4252!important;border-left:0!important;gap:12px}
[class*="-SidebarNavLink"]:hover{background:rgba(39,51,101,.06)!important;color:var(--bv-navy)!important}
[class*="-SidebarNavLink"].active,[class*="-SidebarNavLink"][aria-current="page"]{background:var(--bv-navy)!important;color:#fff!important}
[class*="-SidebarNavLink"] [class*="-IconWrapper"]{display:none!important}
[class*="-SidebarNavLink"]::before{content:"";flex:0 0 20px;width:20px;height:20px;background:currentColor;-webkit-mask:var(--bv-symbol) center/contain no-repeat;mask:var(--bv-symbol) center/contain no-repeat;opacity:.9}
[class*="-SidebarNavList"] li.bv-gruppe::before,[class*="-SidebarNavList"] li:has(> a.bv-gruppe)::before{display:block}
''')
for name, sym in SYMBOLE.items():
    css.append(f'a[href$="/collections/{name}"]{{--bv-symbol:{icon(sym)}}}')
for name, titel in GRUPPEN.items():
    css.append(f'[class*="-SidebarNavList"] li:has(> a[href$="/collections/{name}"])::before{{content:"{titel}";display:block;margin:18px 24px 6px;font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--bv-gold)}}')
css.append('[class*="-SidebarNavList"] li:first-child:has(> a[href$="/collections/artikel"])::before{margin-top:6px}')
css.append('''
/* Listen */
[class*="-ListCard-card"]{border-radius:12px!important;transition:transform .15s,box-shadow .15s!important}
[class*="-ListCard-card"]:hover{transform:translateY(-1px);box-shadow:0 14px 30px rgba(20,29,58,.1)!important}
[class*="-ListCardTitle"]{color:var(--bv-navy)!important;font-weight:600!important;font-size:16.5px!important}

/* Arbeitsablauf in Markenfarben */
[class*="-ColumnHeader"]{border-radius:12px!important;font-weight:700!important;padding:10px 14px!important;border:0!important}
[class*="-WorkflowListContainer"] > div:nth-child(1) [class*="-ColumnHeader"]{background:#ece8de!important;color:#6b5f47!important}
[class*="-WorkflowListContainer"] > div:nth-child(2) [class*="-ColumnHeader"]{background:#e4dcc8!important;color:#5d5035!important}
[class*="-WorkflowListContainer"] > div:nth-child(3) [class*="-ColumnHeader"]{background:#dfe5f0!important;color:var(--bv-navy)!important}
[class*="-WorkflowTop"] [class*="-StyledDropdownButton"]{background:var(--bv-gold)!important;color:#fff!important;border-radius:10px!important;font-weight:700!important}
[class*="-WorkflowCardContainer"]{border-radius:12px!important}

/* Bearbeiten */
[class*="-ToolbarContainer"]{box-shadow:0 4px 16px rgba(20,29,58,.08)!important}
[class*="-BackArrow"],[class*="-BackCollection"]{color:var(--bv-navy)!important}
[class*="-FieldLabel"]{background:none!important;color:var(--bv-navy)!important;border:0!important;padding:0 0 6px 2px!important;font-weight:700!important;letter-spacing:.01em;text-transform:none!important;font-size:14.5px!important}
.nc-controlPane-widget{border:1.5px solid #ddd8cb!important;border-radius:12px!important;background:#fff!important;font-size:16px!important}
.nc-controlPane-widget:focus,.nc-controlPane-widget:focus-within{border-color:var(--bv-navy)!important;box-shadow:0 0 0 3px rgba(39,51,101,.12)!important}
[class*="-ControlContainer"]{margin-top:22px!important}
[class*="-ControlHint"]{font-size:13.5px!important;line-height:1.45!important}
[class*="-ControlContainer"] input,[class*="-ControlContainer"] textarea{font-size:16px!important}

/* Anmeldung */
[class*="AuthenticationPage"]{background:radial-gradient(900px 500px at 80% 0,#e8eaef,rgba(232,234,239,0) 60%),var(--bv-creme)!important}
[class*="-LoginButton"]{background:var(--bv-gold)!important;color:#fff!important;border-radius:12px!important;font-weight:700!important;padding:12px 26px!important;height:auto!important;box-shadow:0 10px 24px rgba(153,138,109,.35)!important}
[class*="AuthenticationPage"] [class*="PageLogoIcon"],[class*="AuthenticationPage"] [class*="CustomIconWrapper"],[class*="AuthenticationPage"] > span:first-child{display:none!important}
[class*="AuthenticationPage"]::before{content:"";order:0;display:block;width:360px;max-width:80vw;height:70px;margin:0 auto 6px;background:url(../uploads/logos/logo-quer.svg) center/contain no-repeat}
[class*="AuthenticationPage"]::after{content:"Hier bearbeitest du die Inhalte der Website.";order:1;display:block;margin:4px 0 26px;color:#5d6473;font-size:17px;text-align:center}
[class*="AuthenticationPage"] > button{order:2}
[class*="AuthenticationPage"] > a,[class*="AuthenticationPage"] > p{order:3}
''')
open(ROOT + 'public/admin/oberflaeche.css', 'w').write('\n'.join(css))
print('ok', sum(len(c) for c in css))
