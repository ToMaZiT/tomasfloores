const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { getNowPlayingFromSpotify } = require('./spotify-now-playing');

const ROOT = __dirname;
loadEnvFile();

const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (requestUrl.pathname === '/api/spotify/now-playing') {
    await handleNowPlaying(req, res);
    return;
  }

  serveStaticFile(requestUrl.pathname, res);
});

server.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});

async function handleNowPlaying(_req, res) {
  const result = await getNowPlayingFromSpotify(process.env);
  json(res, result.statusCode, result.payload);
}

function serveStaticFile(requestPath, res) {
  const safePath = requestPath === '/' ? '/index.html' : decodeURIComponent(requestPath);
  const relativePath = path.normalize(safePath).replace(/^([\\/])+/, '');
  const filePath = path.join(ROOT, relativePath);

  if (!filePath.startsWith(ROOT)) {
    json(res, 403, { error: 'forbidden' });
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        json(res, 404, { error: 'not_found' });
        return;
      }

      json(res, 500, { error: 'read_error' });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(content);
  });
}

function json(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function loadEnvFile() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = stripQuotes(value);
    }
  }
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
