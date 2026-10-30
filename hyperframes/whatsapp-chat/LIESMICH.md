# WhatsApp-Chat (HyperFrames)

Quelle des Films im WhatsApp-Handy der Startseite (`public/uploads/whatsapp/chat-schleife.mp4`).
Texte stehen in `index.html` (auch als Variablen oben im `<html>`-Tag). Ändert sich der Chat im CMS, den Film neu rendern:

    npx hyperframes check
    npx hyperframes render --crf 22 --output chat-schleife.mp4
    ffmpeg -i chat-schleife.mp4 -c copy -movflags +faststart -an ../../public/uploads/whatsapp/chat-schleife.mp4
