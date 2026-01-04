function getAccessTokenCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60,
  };
}

module.exports = { getAccessTokenCookieOptions };
