const { getNowPlayingFromSpotify } = require('../../spotify-now-playing');

module.exports = async function handler(_req, res) {
  const result = await getNowPlayingFromSpotify(process.env);

  res.statusCode = result.statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(result.payload));
};
