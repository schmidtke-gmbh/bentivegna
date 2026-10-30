# liquiditaet (HyperFrames)

Quelle des Films in der Karte auf der Startseite (public/uploads/entwicklung/liquiditaet.mp4). Alle Zahlen sind Beispielwerte.
Neu rendern:

    npx hyperframes check
    npx hyperframes render --crf 24 --output film.mp4
    ffmpeg -i film.mp4 -c copy -movflags +faststart -an ../../public/uploads/entwicklung/liquiditaet.mp4
