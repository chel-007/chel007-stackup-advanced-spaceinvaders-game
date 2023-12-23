window.passport = new window.immutable.passport.Passport({
  baseConfig: new window.immutable.config.ImmutableConfiguration({
    environment: window.immutable.config.Environment.SANDBOX,
  }),
  clientId: 'NdrDVIeYIn5xBiAuWfgunULoVQ4bcCcb',
  redirectUri: 'https://rational-raccoon-factual.ngrok-free.app/',
  logoutRedirectUri: 'https://rational-raccoon-factual.ngrok-free.app/logout.html',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});
