// Entwurf „H1 mit Steuerberater“ (3.11.2026): fünf Varianten für Kicker und Claim im Hero der Startseite.
// Zeilen: Text in *Sternchen* erscheint blau, der Rest navy. Jede Zeile bricht nicht um (wie die Live-Startseite).
// Nur unter /entwurf/h1/ ausgegeben; vor dem Go-live mit den übrigen Entwurfsseiten löschen.
export interface H1Variante { k: string; name: string; kicker: string; zeilen: string[]; kurz: string; plus?: string; minus?: string }

export const H1_VARIANTEN: H1Variante[] = [
  {
    k: '1', name: 'Steuerberater für SHK-Betriebe',
    kicker: 'Steuerberater für SHK-Betriebe',
    zeilen: ['DEIN BETRIEB: *RENTABEL.*', '*STEUERLICH GESTALTET.*', '*VERKAUFSFÄHIG.*'],
    kurz: 'Kicker nennt Beruf und Zielgruppe, der Claim bleibt unverändert.',
    plus: 'Kurz, klar, enthält das Suchwort „Steuerberater“ und „SHK“.',
    minus: 'Die drei Gewerke stehen nicht mehr einzeln da.'
  },
  {
    k: '2', name: 'Steuerberater für Sanitär, Heizung, Klima',
    kicker: 'Steuerberater für Sanitär, Heizung, Klima',
    zeilen: ['DEIN BETRIEB: *RENTABEL.*', '*STEUERLICH GESTALTET.*', '*VERKAUFSFÄHIG.*'],
    kurz: 'Ersetzt die heutige Zeile „Sanitär · Heizung · Klima“ eins zu eins, der Claim bleibt unverändert. Empfehlung aus der SEO-Einschätzung.',
    plus: '„Steuerberater“ und alle drei Gewerke im H1, Optik wie heute.',
    minus: 'Das Kürzel „SHK“ fehlt im H1, steht aber in der Zeile darüber und im Seitentitel.'
  },
  {
    k: '3', name: 'Steuer- und Unternehmerberater, neuer Claim',
    kicker: 'Steuerberater und Unternehmerberater für SHK-Betriebe',
    zeilen: ['MEHR GEWINN,', '*WENIGER STEUERN,*', '*EIN BETRIEB, DER*', '*OHNE DICH LÄUFT.*'],
    kurz: 'Kicker mit beiden Rollen, der Claim spricht den Nutzen direkt aus.',
    plus: 'Zeigt beide Säulen, Steuern und Unternehmerberatung.',
    minus: 'Längerer Kicker, Claim vier Zeilen statt drei; „verkaufsfähig“ fällt weg.'
  },
  {
    k: '4', name: 'Mit Umsatzgrenze',
    kicker: 'Steuerberater für SHK-Betriebe ab 1 Mio. € Umsatz',
    zeilen: ['RENTABEL.', '*STEUERLICH GESTALTET.*', '*VERKAUFSFÄHIG.*'],
    kurz: 'Die Umsatzgrenze wandert in den H1, „Dein Betrieb:“ entfällt.',
    plus: 'Wer nicht passt, merkt es sofort.',
    minus: 'Die Zeile darüber nennt die Umsatzgrenze schon; doppelt.'
  },
  {
    k: '5', name: 'Vom Macher zum Unternehmer',
    kicker: 'Der Steuerberater für Heizungsbau, Sanitär und Klima',
    zeilen: ['VOM MACHER ZUM', 'UNTERNEHMER:', '*RENTABEL, GESTALTET,*', '*VERKAUFSFÄHIG.*'],
    kurz: 'Neuer Claim mit der Entwicklung, die der Unternehmer durchläuft.',
    plus: 'Emotionaler, erzählt eine Geschichte.',
    minus: 'Vier Zeilen, der Hero wird höher; neuer Claim muss zum Rest der Seite passen.'
  }
];
