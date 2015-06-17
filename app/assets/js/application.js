var Pixomatix = angular.module("Pixomatix", [
  'ngResource',
  'ngRoute',
  'ngTouch',
  'ngCookies',
  'PixomatixControllers',
  'PixomatixServices',
  'PixomatixDirectives',
  'PixomatixConfig.development',
  //'PixomatixConfig.production'
]);

//TODO use ui-router
Pixomatix.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    //BEGIN - Gallery
    when('/gallery/:id/slideshow/:image_id', {
      templateUrl: 'partials/images/slideshow.html',
      controller: 'SlideshowCtrl'
    }).
    when('/gallery/:id/slideshow', {
      templateUrl: 'partials/images/slideshow.html',
      controller: 'SlideshowCtrl'
    }).
    when('/gallery/:id', {
      templateUrl: 'partials/images/gallery.html',
      controller: 'GalleryCtrl'
    }).
    when('/', {
      templateUrl: 'partials/images/gallery.html',
      controller: 'GalleryCtrl'
    }).
    //END - Gallery
    //BEGIN - Auth
    when('/auth/register', {
      templateUrl: 'partials/auth/register.html',
      controller: 'AuthCtrl'
    }).
    when('/auth/login', {
      templateUrl: 'partials/auth/login.html',
      controller: 'AuthCtrl'
    }).
    when('/auth/logout', {
      templateUrl: 'partials/auth/notice.html',
      controller: 'LogoutCtrl'
    }).
    when('/auth/request-new-password', {
      templateUrl: 'partials/auth/reset_password_instructions.html',
      controller: 'AuthCtrl'
    }).
    when('/auth/reset-password', {
      templateUrl: 'partials/auth/reset_password.html',
      controller: 'AuthCtrl'
    }).
    when('/auth/unlock-instructions', {
      templateUrl: 'partials/auth/unlock_instructions.html',
      controller: 'AuthCtrl',
    }).
    when('/auth/unlock', {
      templateUrl: 'partials/auth/unlock.html',
      controller: 'AuthCtrl'
    }).
    when('/auth/confirmation-instructions', {
      templateUrl: 'partials/auth/confirmation_instructions.html',
      controller: 'AuthCtrl'
    }).
    when('/auth/confirm', {
      templateUrl: 'partials/auth/confirm.html',
      controller: 'AuthCtrl'
    }).
    //END - Auth
    otherwise({
      redirectTo: '/'
    });
  }
]);

Pixomatix.run(['$rootScope', '$document',
  function($rootScope, $document){
    var handleKeyDown = function(event){
      $rootScope.$apply(function(){
        switch(event.which){
          case 27:
            $rootScope.$broadcast('key.escape');
            break;
          case 37:
            $rootScope.$broadcast('key.left');
            break;
          case 38:
            $rootScope.$broadcast('key.up');
            break;
          case 39:
            $rootScope.$broadcast('key.right');
            break;
          case 40:
            $rootScope.$broadcast('key.down');
            break;
          default:
            break;
        }
      });
    };

    angular.element($document).bind('keydown', handleKeyDown);
    $rootScope.$on('destroy', function(){
      angular.element($document).unbind('keydown', handleKeyDown);
    });
  }
]);

jQuery(document).on('ready page:load', function(args){
  angular.bootstrap(document.body, ['Pixomatix']);
});
