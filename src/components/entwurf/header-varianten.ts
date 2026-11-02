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

// Feinvarianten von B: Auszeichnungen bleiben als Karte unter dem Bild, der Video-Knopf wird anders eingebunden,
// damit er sich nicht mit der weißen Auszeichnungs-Karte doppelt.
export const HEADER_B_VARIANTEN = [
  {
    k: 'b1',
    name: 'Glas-Kreis mit Radarwellen',
    kurz: 'Ein runder Knopf aus mattem Glas sitzt mittig auf der Gruppe, von ihm laufen Wellen aus wie beim Radar auf der Deutschland-Karte. Darunter eine kleine Glas-Beschriftung.',
    plus: 'Sofort als Video erkennbar, klar anders als die weiße Karte, ruhig und hochwertig.',
    minus: 'Liegt auf Domenicos Oberkörper, also mitten im Bild.'
  },
  {
    k: 'b2',
    name: 'Messing-Knopf im Logo-Schild',
    kurz: 'Der Play-Knopf sitzt oben rechts im Logo-Schild, in Messing mit Wellen in Messing. Die Beschriftung steht frei darunter, ohne Kasten.',
    plus: 'Gesichter und Körper bleiben frei, der Knopf wirkt wie ein Siegel und greift die Markenfarbe auf.',
    minus: 'Etwas weniger auffällig als ein Knopf in der Bildmitte.'
  },
  {
    k: 'b3',
    name: 'Rotierender Textring',
    kurz: 'Ein Glas-Kreis am linken Bildrand, um den sich langsam der Text „Video ansehen · Domenico stellt sich vor“ dreht. In der Mitte der Play-Knopf.',
    plus: 'Modern und eigenständig, der Text erklärt den Knopf ohne zusätzlichen Kasten.',
    minus: 'Bewegung am Rand zieht Aufmerksamkeit, eher verspielt als klassisch.'
  },
  {
    k: 'b4',
    name: 'Video als zweiter Button',
    kurz: 'Auf dem Bild liegt kein Knopf mehr. Statt „Unsere Leistungen“ steht neben dem Hauptbutton „Video ansehen“ mit pulsierendem Play-Symbol.',
    plus: 'Das Bild ist komplett frei, Video und Termin liegen in einer Reihe, sehr aufgeräumt.',
    minus: '„Unsere Leistungen“ fällt im Header weg (bleibt im Menü), das Video ist nicht mehr am Gesicht.'
  },
  {
    k: 'b5',
    name: 'Dunkle Glas-Pille mit Puls',
    kurz: 'Der bisherige Knopf bleibt als Pille, aber in dunklem Navy-Glas statt Weiß, mit einem pulsierenden Messing-Punkt im Play-Symbol.',
    plus: 'Kleinste Änderung, Text bleibt lesbar, doppelt sich farblich nicht mehr mit der weißen Karte.',
    minus: 'Bleibt eine Pille auf dem Bild, weniger neu als B1 bis B3.'
  }
] as const;
