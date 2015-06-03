angular.module("PixomatixConfig.development", []).constant('Config', {
  api_url: 'http://localhost:1234/api',
  api_version: 'v1'
});

angular.module("PixomatixConfig.production", []).constant('Config', {
  api_url: 'http://api.pixomatix.com/api',
  api_version: 'v1'
});
