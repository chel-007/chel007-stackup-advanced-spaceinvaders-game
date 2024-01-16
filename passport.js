window.passport = new window.immutable.passport.Passport({
  baseConfig: new window.immutable.config.ImmutableConfiguration({
    environment: window.immutable.config.Environment.SANDBOX,
  }),
  clientId: 'NdrDVIeYIn5xBiAuWfgunULoVQ4bcCcb',
  redirectUri: 'https://chel-advanced-spaceinvaders.netlify.app',
  logoutRedirectUri: 'https://chel-advanced-spaceinvaders.netlify.app/logout.html',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});
