async function getNowPlayingFromSpotify(env) {
  const clientId = env.SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return {
      statusCode: 503,
      payload: { isPlaying: false, reason: 'spotify_not_configured' },
    };
  }

  try {
    const accessToken = await getSpotifyAccessToken(clientId, clientSecret, refreshToken);
    const spotifyResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (spotifyResponse.status === 204) {
      return {
        statusCode: 200,
        payload: { isPlaying: false },
      };
    }

    if (!spotifyResponse.ok) {
      const body = await spotifyResponse.text();
      return {
        statusCode: 502,
        payload: { isPlaying: false, reason: 'spotify_error', details: body },
      };
    }

    const data = await spotifyResponse.json();
    if (!data?.is_playing || !data.item) {
      return {
        statusCode: 200,
        payload: { isPlaying: false },
      };
    }

    return {
      statusCode: 200,
      payload: {
        isPlaying: true,
        title: data.item.name,
        artist: (data.item.artists || []).map((artist) => artist.name).join(', '),
        image: data.item.album?.images?.[0]?.url || '',
        songUrl: data.item.external_urls?.spotify || '',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      payload: {
        isPlaying: false,
        reason: 'internal_error',
        details: error instanceof Error ? error.message : 'unknown_error',
      },
    };
  }
}

async function getSpotifyAccessToken(clientId, clientSecret, refreshToken) {
  const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`spotify_token_error_${response.status}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('spotify_access_token_missing');
  }

  return data.access_token;
}

module.exports = {
  getNowPlayingFromSpotify,
};
