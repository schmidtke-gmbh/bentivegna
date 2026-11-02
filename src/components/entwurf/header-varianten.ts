// Header-Varianten für die Abstimmung (Entwurfsseiten /entwurf/header/…), nicht verlinkt, noindex.
export const HEADER_VARIANTEN = [
  {
    k: 'a',
    name: 'Buttons unter dem Bild',
    kurz: 'Die beiden Buttons stehen direkt unter der Gruppe. Links rücken dafür die Auszeichnungen nach oben, gleich unter den Text.',
    plus: 'Die Lücke unter dem Bild ist gefüllt, Gesicht und Handlung gehören zusammen, Auszeichnungen sofort sichtbar.',
    minus: 'Der Hauptbutton steht nicht mehr direkt unter dem Text, das Auge muss einmal nach rechts springen.'
  },
  {
    k: 'b',
    name: 'Auszeichnungen unter dem Bild',
    kurz: 'Text und Buttons bleiben links wie gewohnt. Die Auszeichnungen füllen die Lücke unter der Gruppe als weiße Karte.',
    plus: 'Klassische Leserichtung: lesen, klicken. Vertrauen steht direkt neben Domenico, alles above the fold.',
    minus: 'Rechts wird es etwas voller, die Nutzenzeile wandert ans Ende der linken Spalte.'
  },
  {
    k: 'c',
    name: 'Zentriert mit Gruppe als Bühne',
    kurz: 'Botschaft und Buttons mittig, darunter die Gruppe. Links daneben die Auszeichnungen, rechts das Video und die drei Nutzenpunkte.',
    plus: 'Sehr ruhig und sofort verständlich, die Gruppe wirkt wie eine Bühne, starker erster Eindruck.',
    minus: 'Die Gruppe wird am unteren Rand angeschnitten, der Text muss kürzer und mittig gesetzt werden.'
  },
  {
    k: 'd',
    name: 'Vertrauensleiste am unteren Rand',
    kurz: 'Text links, Gruppe mit Video rechts. Am unteren Rand eine durchgehende Leiste mit den Auszeichnungen und den drei Nutzenpunkten.',
    plus: 'Aufgeräumter Zweispalter, die Leiste ist auf jedem Laptop sichtbar und trennt klar zum nächsten Abschnitt.',
    minus: 'Die Leiste wirkt etwas klassischer, die Logos werden kleiner dargestellt.'
  },
  {
    k: 'e',
    name: 'Video-Bühne',
    kurz: 'Die Gruppe steht auf einer dunkelblauen Fläche mit dem Logo-Schild, der Play-Button sitzt groß in der Mitte. Links Text, Buttons und Auszeichnungen.',
    plus: 'Das Video wird zum Blickfang, Navy und Messing greifen die Marke auf, alles in einem Blick.',
    minus: 'Die Fläche ist ein neues Element im Design, die Gruppe wird etwas kleiner.'
  }
] as const;
