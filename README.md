# Dynamic Relaxation PWA

Startversie van de adaptieve relaxatie-app.

## Structuur

- `src/index.html` — interface
- `src/css/style.css` — dynamische thema's en responsive layout
- `src/js/app.js` — dagfase, mood tracker, time travel en slaaptimer
- `src/js/audio.js` — fase- en mood-configuratie
- `src/js/visualizer.js` — canvas soundvisual
- `manifest.json` — PWA-installatiegegevens
- `sw.js` — offline cache en cache-first audio
- `public/audio/*` — audio per dagfase

## Lokaal testen

Gebruik een lokale webserver, bijvoorbeeld:

```bash
python -m http.server 8080
```

Open daarna `http://localhost:8080/src/index.html`.

> Service workers werken het best via localhost of HTTPS.
