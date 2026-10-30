# Erzeugt public/admin/config.yml aus den Datendateien (python3 scripts/cms-config.py, benötigt PyYAML).
# Nur nötig, wenn neue Felder in src/data/*.json dazukommen.
import json, yaml, re, os
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+'/'
L={'titel':'Überschrift','text':'Text','eyebrow':'Kleine Überzeile','bild':'Bild','bild_alt':'Bildbeschreibung (Alt-Text)','button':'Button-Text','intro':'Einleitung',
 'seo':'Google & Social Media','beschreibung':'Beschreibung','name':'Name','rolle':'Rolle','zitat':'Zitat','liste':'Liste','punkte':'Punkte','fragen':'Fragen','frage':'Frage','antwort':'Antwort',
 'kennzahlen':'Kennzahlen','zahl':'Zahl','praefix':'Vor der Zahl','suffix':'Nach der Zahl','label':'Beschriftung','alt_zahl':'Alternative Zahl (Vorschau ?variante=b)','alt_label':'Alternative Beschriftung (Vorschau ?variante=b)',
 'karten':'Karten','icon':'Icon','akzent':'Hervorgehobener Teil','untertitel':'Untertitel','einleitung':'Einleitung','hinweis':'Hinweis','klein':'Kleiner Text','zusatz':'Zusatz','kasten':'Kasten',
 'logos':'Logos','alt':'Bildbeschreibung (Alt-Text)','wert':'Wert','telefon':'Telefon','email':'E-Mail','whatsapp':'WhatsApp-Nummer','youtube':'YouTube-Kanal (Link)','firma':'Firmenname',
 'claim':'Claim','strasse':'Straße','plz_ort':'PLZ und Ort','erreichbar':'Erreichbar','tags':'Schlagworte','schritte':'Schritte','stationen':'Stationen','zeit':'Uhrzeit','galerie':'Galerie',
 'optionen':'Antwortmöglichkeiten','id':'Interne Kennung','ziel':'Ziel (Link)','buttons':'Buttons','danke':'Danke-Seite','formular':'Formular','einwilligung':'Einwilligungstext',
 'abschluss':'Abschlussblock','autor':'Autorenbox','audio_aktiv':'Hörbuch-Player anzeigen','newsletter_aktiv':'E-Mail-Anmeldung anzeigen','impressum':'Impressum','datenschutz':'Datenschutzerklärung',
 'youtube_id':'YouTube-Video-ID','kategorie':'Kategorie','chat':'WhatsApp-Dialog','von':'Absender (mandant oder kanzlei)','unterschrift':'Unterschrift','swoosh':'Bild-Etikett','unterzeile':'Unterzeile',
 'zeile1':'Headline Zeile 1','zeile2':'Headline Zeile 2','subline':'Text unter der Headline','bullets':'Drei Punkte unter den Buttons','kicker':'Kicker über der Headline','marker_tag':'Marker (kurz)','marker_text':'Marker-Text',
 'button_primaer':'Button 1','button_sekundaer':'Button 2','video_youtube_id':'Video hinter dem Bild (YouTube-ID)','fokus_label':'Etikett auf dem Bild','badge_titel':'Badge: Titel','badge_text':'Badge: Text',
 'links':'Linke Spalte','rechts':'Rechte Spalte','mitte':'Mittlere Spalte','absaetze':'Absätze','bloecke':'Blöcke','kacheln':'Kacheln','zahlen':'Zahlen','gross':'Groß darstellen','video_hochkant':'Video ist hochkant gedreht (Player im Hochformat)','fakten':'Fakten','team_bild':'Teamfoto unten im Kopfbereich (freigestellt, PNG/WebP mit transparentem Hintergrund)','team_bild_alt':'Bildbeschreibung Teamfoto (Alt-Text)','stil':'Farbe des Kopfbereichs'}
def lab(k):
    if k in L: return L[k]
    s=k.replace('_',' ')
    for a,b in [('ae','ä'),('oe','ö'),('ue','ü')]:
        s=re.sub(r'(?<![aeiou])'+a,b,s) if a!='ue' else s.replace('ue','ü')
    return s[:1].upper()+s[1:]
IMG=re.compile(r'(^|_)(bild|unterschrift)$')
def field(k,v,ctx=''):
    f={'label':lab(k),'name':k}
    if k=='id': f.update(widget='hidden'); return f
    if k=='stil': f.update(widget='select',options=[{'label':'Hell (wie die übrige Seite)','value':'hell'},{'label':'Navy (dunkel)','value':'navy'}],default='hell',required=False); return f
    if isinstance(v,bool): f.update(widget='boolean',required=False)
    elif isinstance(v,(int,float)): f.update(widget='number',value_type='int' if isinstance(v,int) else 'float')
    elif isinstance(v,str):
        if IMG.search(k) or (k=='bild'): f.update(widget='image',required=False)
        elif k=='icon': f.update(widget='select',options=ICONS)
        elif len(v)>90 or '\n' in v or k in ('text','zitat','antwort','beschreibung','intro','subline','einleitung','hinweis'):
            f.update(widget='markdown' if ('\n\n' in v or '## ' in v) else 'text')
            if f['widget']=='markdown': f['buttons']=['bold','italic','link','heading-two','heading-three','bulleted-list','numbered-list']; f['editor_components']=[]
        else: f.update(widget='string')
        if f.get('widget') in ('string','text','markdown') and v=='': f['required']=False
    elif isinstance(v,list):
        f['widget']='list'
        if v and isinstance(v[0],dict):
            f['fields']=[field(kk,vv) for kk,vv in v[0].items()]
            keys=list(v[0].keys())
            sumk=next((x for x in ('titel','frage','name','label','text','zeit','alt','wert') if x in keys),None)
            if sumk: f['summary']='{{fields.'+sumk+'}}'
        else:
            f['field']={'label':'Eintrag','name':'eintrag','widget':'text' if v and max(len(x) for x in v)>70 else 'string'}
    elif isinstance(v,dict):
        f.update(widget='object',collapsed=True,fields=[field(kk,vv) for kk,vv in v.items()])
    if f.get('widget') not in ('hidden','object','boolean'): f['required']=False
    if k=='ziel': f['hint']='Link (https://…) oder „bruecke:steuerstrategie“ für den Brücken-Screen'
    return f
ICONS=sorted(x[:-4] for x in os.listdir(ROOT+'src/icons'))
def filecoll(name,label,path,desc):
    d=json.load(open(ROOT+path))
    fl=[field(k,v) for k,v in d.items()]
    for x in fl:
        if x['widget']=='object': x['collapsed']=True
    return {'name':name,'label':label,'description':desc,'editor':{'preview':False},'files':[{'name':name,'label':label,'file':path,'format':'json','fields':fl}]}
cfg={
 'backend':{'name':'github','repo':'schmidtke-gmbh/bentivegna-website','branch':'main','commit_messages':{'create':'Neu: {{collection}} „{{slug}}“','update':'Geändert: {{collection}} „{{slug}}“','delete':'Gelöscht: {{collection}} „{{slug}}“','uploadMedia':'Bild hochgeladen: {{path}}','deleteMedia':'Bild gelöscht: {{path}}'}},
 'publish_mode':'editorial_workflow','locale':'de','site_url':'https://www.bentivegna.de','display_url':'https://www.bentivegna.de',
 'logo_url':'/uploads/logos/logo-quer.svg','media_folder':'public/uploads','public_folder':'/uploads','show_preview_links':True,
 'collections':[]}
art={'name':'artikel','label':'Artikel','label_singular':'Artikel','description':'Hier legst du jeden Teil von „Der Chef auf der Baustelle“ an. Liegt das Datum in der Zukunft, geht der Artikel an diesem Tag morgens automatisch online.',
 'folder':'src/content/artikel','create':True,'extension':'md','format':'frontmatter','slug':'{{url}}','identifier_field':'titel','summary':'Teil {{teil}}: {{titel}} ({{datum | date(\'DD.MM.YYYY\')}})',
 'sortable_fields':['teil','datum','titel'],'preview_path':'der-chef-auf-der-baustelle/{{slug}}/',
 'fields':[
  {'label':'Titel (H1)','name':'titel','widget':'string'},
  {'label':'URL-Endung','name':'url','widget':'string','hint':'Kleinbuchstaben und Bindestriche, z. B. der-zustand-deines-betriebs-ist-kein-zufall. Nach der Veröffentlichung nicht mehr ändern.','pattern':['^[a-z0-9-]+$','Nur Kleinbuchstaben, Zahlen und Bindestriche']},
  {'label':'Teil-Nummer','name':'teil','widget':'number','value_type':'int','min':1},
  {'label':'Kapitel','name':'kapitel','widget':'relation','collection':'kapitel','search_fields':['titel'],'value_field':'{{slug}}','display_fields':['Kapitel {{nummer}}: {{titel}}']},
  {'label':'Veröffentlichen am','name':'datum','widget':'datetime','format':'YYYY-MM-DD','date_format':'DD.MM.YYYY','time_format':False,'hint':'Liegt das Datum in der Zukunft, erscheint der Artikel automatisch an diesem Tag.'},
  {'label':'Als Entwurf zurückhalten','name':'entwurf','widget':'boolean','default':False,'required':False},
  {'label':'Einleitung (kursiv unter dem Titel)','name':'lead','widget':'text','required':False},
  {'label':'Artikelbild (1,91:1, z. B. 1200 × 628 px)','name':'bild','widget':'image','required':False,'hint':'Wird auch als Vorschaubild für LinkedIn, WhatsApp und Facebook genutzt. Ohne Bild erscheint automatisch eine Titelkarte.'},
  {'label':'Bildbeschreibung (Alt-Text)','name':'bild_alt','widget':'string','required':False},
  {'label':'Text','name':'body','widget':'markdown','buttons':['bold','italic','link','heading-two','heading-three','quote','bulleted-list','numbered-list'],'editor_components':[],'hint':'Zwischenüberschriften als H2. Texte aus Word einfach einfügen.'},
  {'label':'Box „Deine Aufgabe für diese Woche“','name':'aufgabe','widget':'text','required':False},
  {'label':'Aufgabe vor dem letzten Abschnitt („Wie es weitergeht“) zeigen','name':'aufgabe_vor_ausblick','widget':'boolean','default':True,'required':False},
  {'label':'Meta-Titel (Google)','name':'meta_titel','widget':'string','required':False},
  {'label':'Meta-Beschreibung (Google)','name':'meta_beschreibung','widget':'text','required':False},
  {'label':'Suchbegriff','name':'suchbegriff','widget':'string','required':False},
  {'label':'Lesezeit in Minuten (leer = automatisch)','name':'lesezeit','widget':'number','value_type':'int','required':False},
  {'label':'Hörbuch-Datei (MP3, erscheint erst, wenn der Player unter „Übersicht & Einstellungen“ eingeschaltet ist)','name':'audio','widget':'file','required':False}]}
kap={'name':'kapitel','label':'Kapitel','label_singular':'Kapitel','description':'Die Kapitel der Buchreihe. Jeder Artikel gehört zu einem Kapitel.','folder':'src/content/kapitel','create':True,'extension':'json','format':'json','slug':'{{slug}}','identifier_field':'titel','summary':'Kapitel {{nummer}}: {{titel}}',
 'fields':[{'label':'Nummer','name':'nummer','widget':'number','value_type':'int','min':0},{'label':'Titel','name':'titel','widget':'string'},{'label':'Beschreibung','name':'beschreibung','widget':'text','required':False}]}
st={'name':'stellen','label':'Offene Stellen','label_singular':'Stelle','description':'Jede Stelle bekommt eine eigene Profilseite. Ist eine Stelle besetzt, schaltest du „Stelle ist aktiv“ aus.','folder':'src/content/stellen','create':True,'extension':'md','format':'frontmatter','slug':'{{slug}}','identifier_field':'titel','summary':'{{titel}}','preview_path':'karriere/{{slug}}/',
 'fields':[{'label':'Stellentitel (exakt wie im Stellenprofil)','name':'titel','widget':'string'},{'label':'Reihenfolge','name':'reihenfolge','widget':'number','value_type':'int','default':1},
  {'label':'Stelle ist aktiv','name':'aktiv','widget':'boolean','default':True},{'label':'Umfang','name':'umfang','widget':'string','default':'Vollzeit / Teilzeit'},{'label':'Ort','name':'ort','widget':'string','default':'Überlingen'},
  {'label':'Arbeitsmodell','name':'arbeitsmodell','widget':'string','default':'vor Ort, Homeoffice, Hybrid'},{'label':'Start','name':'start','widget':'string','default':'ab sofort'},
  {'label':'Aufgaben (die ersten drei erscheinen auf der Karriereseite)','name':'aufgaben','widget':'list','field':{'label':'Aufgabe','name':'aufgabe','widget':'string'}},
  {'label':'Anforderungen (die ersten drei erscheinen auf der Karriereseite)','name':'anforderungen','widget':'list','field':{'label':'Anforderung','name':'anforderung','widget':'string'}},
  {'label':'Stellenprofil als PDF','name':'profil_pdf','widget':'file','required':False},{'label':'Veröffentlicht am','name':'datum','widget':'datetime','format':'YYYY-MM-DD','date_format':'DD.MM.YYYY','time_format':False,'required':False},
  {'label':'Vollständiges Stellenprofil','name':'body','widget':'markdown','required':False,'buttons':['bold','italic','link','heading-two','heading-three','bulleted-list','numbered-list'],'editor_components':[]}]}
cfg['collections']=[art,kap,
 filecoll('buchreihe','Übersicht & Einstellungen','src/data/buchreihe.json','Einleitung der Übersichtsseite, Autorenbox, Abschlussblock unter jedem Artikel und die Schalter für Hörbuch und E-Mail-Anmeldung.'),
 filecoll('startseite','Startseite','src/data/startseite.json','Alle Texte, Bilder und Zahlen der Startseite, sortiert von oben nach unten wie auf der Seite.'),
 filecoll('karriere','Karriereseite','src/data/karriere.json','Alle Texte und Bilder der Karriereseite. Die einzelnen Stellen pflegst du unter „Offene Stellen“.'),
 st,
 filecoll('funnel','Anfrage-Formular','src/data/funnel.json','Fragen, Antworten, Ausstiegstexte und Danke-Seite. Welche Antwort wohin führt, ist fest eingebaut. Hier änderst du nur die Texte.'),
 filecoll('einstellungen','Kontakt & Einstellungen','src/data/einstellungen.json','Adresse, Telefon, WhatsApp, Bewertungen und Tracking. Änderungen hier wirken auf der ganzen Website.'),
 filecoll('rechtliches','Impressum & Datenschutz','src/data/rechtliches.json','Die Rechtstexte der Website.')]
class D(yaml.SafeDumper): pass
D.add_representer(str, lambda d,s: d.represent_scalar('tag:yaml.org,2002:str', s))
out='# Decap CMS – Konfiguration für die Bentivegna-Website\n# Erzeugt aus den Datendateien. Repository-Name unter backend.repo anpassen.\n'+yaml.dump(cfg,Dumper=D,allow_unicode=True,sort_keys=False,width=200)
open(ROOT+'public/admin/config.yml','w').write(out)

print(len(out))
