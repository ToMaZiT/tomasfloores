# Spotify setup

Para que el cartel de "now playing" funcione:

1. Copia `.env.example` a `.env`
2. Completa estas variables:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
3. En tu app de Spotify, habilita estos scopes:
   - `user-read-currently-playing`
   - `user-read-playback-state`
4. Inicia la web con:

```bash
npm start
```

Si Spotify no esta configurado o no hay una cancion reproduciendose, el cartel no aparece.
