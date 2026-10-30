# Bentivegna Website 2.0

Neue Website für Bentivegna Unternehmerberatung & Steuerstrategie. Gebaut mit **Astro** (statische Seiten, sehr schnell) und **Decap CMS** (Redaktionssystem für Antonia). Gehostet auf **Netlify**, Formulare über **Netlify Forms**.

## Was wo liegt

| Bereich | Datei / Ordner | Im CMS unter |
|---|---|---|
| Startseite (alle Texte, Bilder, Zahlen) | `src/data/startseite.json` | Startseite |
| Karriereseite | `src/data/karriere.json` | Karriereseite |
| Offene Stellen (je Stelle eine Datei + Profilseite) | `src/content/stellen/` | Offene Stellen |
| Funnel `/anfrage/` (Fragen, Exits, Danke-Text) | `src/data/funnel.json` | Anfrage-Formular (Funnel) |
| Buchreihe „Der Chef auf der Baustelle“ | `src/content/artikel/`, `src/content/kapitel/`, `src/data/buchreihe.json` | Buchreihe: Artikel, Kapitel, Übersicht & Einstellungen |
| Kontakt, WhatsApp, Bewertungen, Tracking | `src/data/einstellungen.json` | Kontakt & Einstellungen |
| Impressum, Datenschutz | `src/data/rechtliches.json` | Impressum & Datenschutz |
| Bilder | `public/uploads/` | Medien |
| Seitenvorlagen | `src/pages/` | (nur Entwickler) |
| Gestaltung | `src/styles/` | (nur Entwickler) |

Seiten: `/`, `/karriere/`, `/karriere/<stelle>/`, `/anfrage/`, `/der-chef-auf-der-baustelle/`, `/der-chef-auf-der-baustelle/<artikel>/`, `/der-chef-auf-der-baustelle/selbstcheck/`, `/hilfe-center/`, `/impressum/`, `/datenschutz/`, `/admin/` (CMS), `/cms-demo/` (Klick-Demo), `sitemap.xml`, `robots.txt`.

## Lokal starten

```bash
npm install
npm run dev        # Vorschau unter http://localhost:4321
npm run build      # fertige Seite in dist/
npm run doppelklick  # Vorschau zum Öffnen ohne Server in vorschau-doppelklick/
```

Vorschau der Alternativtexte bei den Kennzahlen (Domenico wollte beide Varianten sehen): `/?variante=b`.

## Einmalige Einrichtung für den Livebetrieb

1. **GitHub:** Privates Repository anlegen (z. B. `schmidtke-gmbh/bentivegna-website`) und diesen Ordner hochladen. Den Namen in `public/admin/config.yml` unter `backend.repo` eintragen.
2. **Netlify:** „Add new site“ → „Import from Git“ → Repository wählen. Build-Einstellungen kommen aus `netlify.toml`.
3. **Formulare:** Netlify erkennt `anfrage` und `bewerbung` automatisch. Unter *Forms → Form notifications* E-Mail-Benachrichtigungen einrichten: `anfrage` an info@bentivegna.de, `bewerbung` an die Recruiting-Adresse (Faktenblatt). Spam-Schutz (Honeypot) ist eingebaut.
4. **CMS-Login für Antonia (GitHub):**
   - Auf GitHub unter *Settings → Developer settings → OAuth Apps* eine App anlegen. Homepage: die Website-Adresse, Callback-URL: `https://api.netlify.com/auth/done`.
   - In Netlify unter *Site configuration → Access & security → OAuth* den Provider „GitHub“ mit Client ID und Secret hinzufügen.
   - Antonia legt ein kostenloses GitHub-Konto an und wird im Repository als *Collaborator* (Write) eingeladen. Danach meldet sie sich unter `/admin/` mit GitHub an.
5. **Automatisch terminierte Artikel:** In Netlify unter *Build & deploy → Build hooks* einen Hook anlegen, die URL im GitHub-Repository unter *Settings → Secrets and variables → Actions* als `NETLIFY_BUILD_HOOK` speichern. Der Workflow `.github/workflows/taeglicher-build.yml` prüft jeden Morgen, ob ein Artikel mit heutigem Datum ansteht, und baut nur dann neu. Das spart Netlify-Credits (ein Deploy kostet 15 Credits).
6. **Domain:** In Netlify verbinden und in `netlify.toml` `PUBLIC_SITE_URL` anpassen (für Canonical, Sitemap, Vorschaubilder).
7. **Tracking:** Matomo-Adresse und Site-ID in „Kontakt & Einstellungen“ eintragen (läuft ohne Cookies). Alle Funnel-Schritte, Exits, Brücken und Formulare senden Events (`funnel_*`, `bewerbung_abgeschickt`, `whatsapp_klick` …).
8. **Hilfe-Center:** Nach Livegang Maya von fragdeinekanzlei.de Bescheid geben (Wunsch von Domenico).

## So arbeitet Antonia im CMS

- **Aussehen:** Das Redaktionssystem ist an die Marke angepasst (`public/admin/oberflaeche.css`, erzeugt mit `python3 scripts/cms-oberflaeche.py`). Artikel und Stellen zeigen rechts eine Vorschau im Look der Website (`public/admin/vorschau.js`).

- **Arbeitsablauf:** Jede Änderung startet als Entwurf. Über „Arbeitsablauf“ wandert sie von *Entwurf* über *Zur Prüfung* zu *Bereit*; erst „Veröffentlichen“ stellt sie live (dauert ca. 1 Minute).
- **Neuer Artikel der Buchreihe:** Artikel → „Neu“ → Titel, URL-Endung, Teil, Kapitel, Datum, Text (aus Word einfügen), Aufgabe, Meta-Titel/-Beschreibung, Bild (1,91:1). Liegt das Datum in der Zukunft, erscheint der Artikel automatisch an diesem Tag. Ohne Bild erzeugt die Seite eine Titelkarte im Raster.
- **Hörbuch und E-Mail-Anmeldung** sind vorbereitet und ausgeblendet; Schalter unter „Übersicht & Einstellungen“.
- **Bilder:** Beim Feld „Bild“ hochladen oder aus der Mediathek wählen. Immer eine Bildbeschreibung (Alt-Text) eintragen.
- **Ausprobieren ohne Risiko:** `/cms-demo/` zeigt dasselbe Redaktionssystem mit allen Inhalten. Dort wird nichts gespeichert.

## Datenschutz (technisch)

- Schriften liegen auf dem eigenen Server (keine Google Fonts).
- YouTube und das Hilfe-Center werden erst nach Klick geladen.
- Formulare übertragen keine Daten in der URL.
- Der Selbstcheck speichert Werte nur im Browser (localStorage); der Satz dazu steht im Entwurf der Datenschutzerklärung.

## Lizenzen

Icons: Lucide (ISC). Schriften: Source Sans 3 / Source Serif 4 (OFL). Redaktionssystem: Decap CMS (MIT), liegt unter `public/admin/decap/`.
