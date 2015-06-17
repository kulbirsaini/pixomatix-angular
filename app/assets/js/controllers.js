var PixomatixControllers = angular.module("PixomatixControllers", []);

PixomatixControllers.controller('BodyCtrl', ['$scope', '$location', 'CurrentUser', 'SharedState',
  function($scope, $location, CurrentUser, SharedState){
    $scope.CurrentUser = CurrentUser;
    $scope.SharedState = SharedState;

    $scope.logout = function(){
      SharedState.setValue('user', 'after_login_path', $location.path());
      $location.path('/auth/logout');
    };
  }
]);

PixomatixControllers.controller('LogoutCtrl', ['$scope', '$location', 'Auth', 'CurrentUser', 'SharedState',
  function($scope, $location, Auth, CurrentUser, SharedState){
    if (CurrentUser.loggedIn()){
      Auth().logout().
      $promise.then(function(data){
        console.log(data);
        SharedState.setValue('auth', 'notice', data.notice);
        CurrentUser.reset();
        $location.path('/auth/login');
      }).
      catch(function(error){
        console.log(error);
        if (typeof(error.data.notice) !== "undefined"){
          SharedState.setValue('auth', 'error', error.data.notice);
          if (typeof(error.data.error) !== "undefined"){
            SharedState.setValue('auth', 'warning', error.data.error);
          }
        } else {
          SharedState.setValue('auth', 'error', 'Unknown error');
        }
        $scope.errors = SharedState.getValue('auth', 'error');
        $scope.warnings = SharedState.getValue('auth', 'warning');
        $scope.notices = SharedState.getValue('auth', 'notice');
        SharedState.reset('auth');
        if ($scope.errors && $scope.errors.constructor !== Array){ $scope.errors = [$scope.errors]; }
        if ($scope.warnings && $scope.warnings.constructor !== Array){ $scope.warnings = [$scope.warnings]; }
        if ($scope.notices && $scope.notices.constructor !== Array){ $scope.notices = [$scope.notices]; }
      });
    } else {
      $location.path('/auth/login');
    }
  }
]);

PixomatixControllers.controller('AuthCtrl', ['$scope', '$route', '$routeParams', '$cookies', '$location', 'SharedState', 'Auth', 'CurrentUser',
  function($scope, $route, $routeParams, $cookies, $location, SharedState, Auth, CurrentUser){
    $scope.initializeData = function(){
      SharedState.setValue('config', 'hideHeader', false);
      SharedState.setValue('config', 'bodyClass', 'auth');
      $scope.setAlerts();
      console.log($cookies.getAll());
    };

    $scope.setAlerts = function(){
      $scope.errors = SharedState.getValue('auth', 'error');
      $scope.warnings = SharedState.getValue('auth', 'warning');
      $scope.notices = SharedState.getValue('auth', 'notice');
      SharedState.reset('auth');
      if ($scope.errors && $scope.errors.constructor !== Array){ $scope.errors = [$scope.errors]; }
      if ($scope.warnings && $scope.warnings.constructor !== Array){ $scope.warnings = [$scope.warnings]; }
      if ($scope.notices && $scope.notices.constructor !== Array){ $scope.notices = [$scope.notices]; }
    };

    $scope.errorHandler = function(error){
      console.log(error);
      if (typeof(error.data.notice) !== "undefined"){
        SharedState.setValue('auth', 'error', error.data.notice);
        if (typeof(error.data.error) !== "undefined"){
          SharedState.setValue('auth', 'warning', error.data.error);
        }
      } else {
        SharedState.setValue('auth', 'error', 'Unknown error');
      }
      $scope.setAlerts();
    };

    $scope.successHandler = function(data, path){
      console.log(data);
      SharedState.setValue('auth', 'notice', data.notice);
      if(!path){ path = '/'; }
      $location.path(path);
    };

    $scope.setUserEmail = function(){
      $cookies.put('user_email', $scope.email);
    };

    $scope.getEmail = function(){
      var current_user = $cookies.getObject('current_user');
      if (current_user && current_user.email){ return current_user.email; }

      var user_email = $cookies.get('user_email');
      if (user_email){ return user_email; }

      if ($scope.email){ return $scope.email; }
      return null;
    };

    $scope.removeUserEmail = function(){
      $cookies.remove('user_email');
    };

    $scope.isEmailSet = function(){
      return !!$scope.getEmail();
    };

    $scope.register = function(){
      CurrentUser.reset();
      Auth().register({}, { user: { name: $scope.name, email: $scope.email, password: $scope.password, password_confirmation: $scope.password_confirmation } }).
      $promise.then(function(data){
        $scope.setUserEmail();
        $scope.successHandler(data, '/auth/confirm');
      }).
      catch($scope.errorHandler);
    };

    $scope.login = function(){
      Auth().login({}, { user: { email: $scope.email, password: $scope.password } }).
      $promise.then(function(data){
        CurrentUser.set(data.user.email, data.token);
        var path = SharedState.getValue('user', 'after_login_path');
        SharedState.setValue('user', 'after_login_path', null);
        if (path && path === '/auth/login'){ path = '/'; }
        $scope.successHandler(data, path);
      }).
      catch($scope.errorHandler);
    };

    $scope.reset_password_instructions = function(){
      Auth({ 'X-Access-Email' : $scope.email }).reset_password_instructions().
      $promise.then(function(data){
        $scope.setUserEmail();
        $scope.successHandler(data, '/auth/reset-password');
      }).
      catch($scope.errorHandler);
    };

    $scope.reset_password = function(){
      Auth({ 'X-Access-Email': $scope.getEmail(), 'X-Access-Reset-Password-Token': $scope.reset_password_token }).
      reset_password({}, { user: { password: $scope.password, password_confirmation: $scope.password_confirmation } }).
      $promise.then(function(data){
        $scope.removeUserEmail();
        $scope.successHandler(data, '/auth/login');
      }).
      catch($scope.errorHandler);
    };

    $scope.unlock_instructions = function(){
      Auth({ 'X-Access-Email' : $scope.email }).unlock_instructions().
      $promise.then(function(data){
        $scope.setUserEmail();
        $scope.successHandler(data, '/auth/unlock');
      }).
      catch($scope.errorHandler);
    };

    $scope.unlock = function(){
      Auth({ 'X-Access-Email': $scope.getEmail(), 'X-Access-Unlock-Token': $scope.unlock_token }).
      reset_password().
      $promise.then(function(data){
        $scope.removeUserEmail();
        $scope.successHandler(data, '/auth/login');
      }).
      catch($scope.errorHandler);
    };

    $scope.confirmation_instructions = function(){
      Auth({ 'X-Access-Email' : $scope.email }).confirmation_instructions().
      $promise.then(function(data){
        $scope.setUserEmail();
        $scope.successHandler(data, '/auth/confirm');
      }).
      catch($scope.errorHandler);
    };

    $scope.confirm = function(){
      Auth({ 'X-Access-Email': $scope.getEmail(), 'X-Access-Confirmation-Token': $scope.confirmation_token }).confirm().
      $promise.then(function(data){
        $scope.removeUserEmail();
        $scope.successHandler(data, '/auth/login');
      }).
      catch($scope.errorHandler);
    };

    $scope.initializeData();
  }
]);

PixomatixControllers.controller('GalleryCtrl', ['$scope', '$routeParams', '$filter', '$cookies', '$location', 'Gallery', 'Auth', 'CurrentUser', 'SharedState',
  function($scope, $routeParams, $filter, $cookies, $location, Gallery, Auth, CurrentUser, SharedState){
    $scope.initializeData = function(){
      $scope.galleries = [];
      $scope.parent_id = null;
      SharedState.setValue('config', 'hideHeader', false);
      SharedState.setValue('config', 'bodyClass', 'gallery');
    };

    $scope.filterEmptyGalleries = function(galleries){
      return $filter('filter')(galleries, function(item){ return item.has_galleries || item.has_photos; });
    };

    $scope.appendToGalleries = function(galleries){
      galleries = $scope.filterEmptyGalleries(galleries);
      $scope.galleries = $scope.galleries.concat(galleries);
    };

    $scope.handleData = function(data){
      console.log(data);
      $scope.initializeData();
      if (data.constructor === Array){
        $scope.appendToGalleries(data);
      } else {
        $scope.parent_id = data.parent_id;
        if (data.has_galleries){
          Gallery.getCollection({operation: 'galleries', id: data.id}, $scope.appendToGalleries);
        }
        if (data.has_photos){
          $scope.galleries = $scope.galleries.concat({
            id:data.id,
            is_photo:false,
            is_gallery:true,
            has_galleries:false,
            has_photos:true,
            has_parent:true,
            parent_id:data.id,
            thumbnail_url:data.thumbnail_url
          });
        }
      }
    };

    $scope.initializeData();
    if (CurrentUser.loggedIn()) {
      if (typeof($routeParams.id) == "undefined"){
        Gallery.query($scope.handleData);
      } else {
        Gallery.get({id: $routeParams.id}, $scope.handleData);
      }
    } else {
      SharedState.setValue('user', 'after_login_path', $location.path());
      $location.path('/auth/login');
    }
  }
]);

PixomatixControllers.controller('SlideshowCtrl', ['$scope', '$route', '$routeParams', '$location', '$timeout', 'Gallery', 'CurrentUser', 'SharedState',
  function($scope, $route, $routeParams, $location, $timeout, Gallery, CurrentUser, SharedState){
    $scope.initializeData = function(){
      $scope.gallery_id = $routeParams.id;
      $scope.image_id = $routeParams.image_id;
      $scope.parent_id = null;
      $scope.currentIndex = -1;
      $scope.currentAngle = 0;
      $scope.rotatedWidth = null;
      $scope.images = [];
      $scope.quality = 'hdtv_url';
      $scope.circular = 'no';
      $scope.fadeOutTime = 300;
      $scope.leftOffset = '0px';
      $scope.lastRoute = $route.current;
      $scope.thumbnail_width = 105; //with margin/padding
      $scope.slide_height_padding = 150; //with margin/padding
      $scope.loading = true;
      SharedState.setValue('config', 'hideHeader', true);
      SharedState.setValue('config', 'bodyClass', 'slideshow');
    };

    $scope.isDownloadable = function(){
      var current_image = $scope.getCurrentImage();
      return current_image && current_image.download_url;
    };

    $scope.getBodyWidth = function(){
      return jQuery(window).width();
    };

    $scope.getBodyHeight = function(){
      return jQuery(window).height();
    };

    $scope.setSlideHeightPadding = function(){
      if ($scope.getBodyWidth() < 992){
        $scope.slide_height_padding = 45;
      } else {
        $scope.slide_height_padding = 150;
      }
    };

    $scope.setRotatedWidth = function(){
      if ($scope.isOddAngleRotation()){
        $scope.rotatedWidth = ($scope.getBodyHeight() - $scope.slide_height_padding) + 'px';
      } else {
        $scope.rotatedWidth = null;
      }
    };

    $scope.rotateClockwise = function(){
      $scope.currentAngle = ($scope.currentAngle + 90) % 360;
    };

    $scope.rotateAntiClockwise = function(){
      $scope.currentAngle = ($scope.currentAngle - 90) % 360;
    };

    $scope.isOddAngleRotation = function(){
      return ($scope.currentAngle / 90) % 2 !== 0;
    };

    $scope.getFirstIndex = function(){
      return 0;
    };

    $scope.getLastIndex = function(){
      return $scope.images.length - 1;
    };

    $scope.getNextIndex = function(){
      if ($scope.circular === "yes"){
        return ($scope.currentIndex === $scope.images.length - 1) ? 0 : $scope.currentIndex + 1;
      } else {
        return ($scope.currentIndex === $scope.images.length - 1) ? $scope.currentIndex : $scope.currentIndex + 1;
      }
    };

    $scope.getPreviousIndex = function(){
      if ($scope.circular === "yes"){
        return ($scope.currentIndex === 0) ? $scope.images.length - 1 : $scope.currentIndex - 1;
      } else {
        return ($scope.currentIndex === 0) ? $scope.currentIndex : $scope.currentIndex - 1;
      }
    };

    $scope.getImageAtIndex = function(index){
      var image = $scope.images[index];
      return (typeof(image) == "undefined") ? null : image;
    };

    $scope.getIndexByImageId = function(image_id){
      var index = null;
      angular.forEach($scope.images, function(value, key){
        if (value.id == image_id){ index = key; return; }
      });
      return index;
    };

    $scope.setIndexByImageId = function(image_id){
      if (image_id === null){
        $scope.currentIndex = $scope.getFirstIndex();
        return;
      }
      var index = $scope.getIndexByImageId(image_id);
      if (index === null){
        $scope.currentIndex = $scope.getFirstIndex();
      } else {
        $scope.currentIndex = index;
      }
    };

    $scope.appendToImages = function(images){
      $scope.images = images;
      $scope.setIndexByImageId($scope.image_id);
      $scope.goToImageAtIndex($scope.currentIndex);
    };

    $scope.redirectToParentGallery = function(){
      $location.path('/gallery/' + $scope.parent_id);
    };

    $scope.goToImage = function(id){
      $scope.loading = true;
      $scope.setIndexByImageId(id);
      $location.path('/gallery/' + $scope.gallery_id + '/slideshow/' + id);
    };

    $scope.goToImageAtIndex = function(index){
      if (index === $scope.currentIndex){ return; }
      var image = $scope.getImageAtIndex(index);
      if (image !== null && image.id !== null){
        $scope.goToImage(image.id);
      }
    };

    $scope.setLeftOffset = function(){
      var bodyWidth = $scope.getBodyWidth(), numThumbs = parseInt(bodyWidth / $scope.thumbnail_width);
      var maxLeft = 0, minLeft = bodyWidth / 2 - ($scope.images.length - numThumbs / 2) * $scope.thumbnail_width;
      var left = parseInt(bodyWidth / 2 - ($scope.currentIndex + 1) * $scope.thumbnail_width);
      if (minLeft >= 0){ minLeft = 0; }
      if (left > maxLeft) { left = maxLeft; }
      if (left < minLeft) { left = minLeft; }
      $scope.leftOffset = left + 'px';
    };

    $scope.getCurrentImage = function(){
      return $scope.getImageAtIndex($scope.currentIndex);
    };

    $scope.getNextImage = function(){
      return $scope.getImageAtIndex($scope.getNextIndex());
    };

    $scope.getPreviousImage = function(){
      return $scope.getImageAtIndex($scope.getPreviousIndex());
    };

    $scope.getFirstImage = function(){
      return $scope.getImageAtIndex($scope.getFirstIndex());
    };

    $scope.getLastImage = function(){
      return $scope.getImageAtIndex($scope.getLastIndex());
    };

    $scope.goToCurrentImage = function(){
      $scope.goToImageAtIndex($scope.currentIndex);
    };

    $scope.goToFirstImage = function(){
      $scope.goToImageAtIndex($scope.getFirstIndex());
    };

    $scope.goToLastImage = function(){
      $scope.goToImageAtIndex($scope.getLastIndex());
    };

    $scope.goToPreviousImage = function(){
      $scope.goToImageAtIndex($scope.getPreviousIndex());
    };

    $scope.goToNextImage = function(){
      $scope.goToImageAtIndex($scope.getNextIndex());
    };

    $scope.isFirstButtonDisabled = function(){
      return $scope.circular == "no" && $scope.getFirstIndex() == $scope.currentIndex;
    };

    $scope.isPreviousButtonDisabled = function(){
      return $scope.circular == "no" && $scope.getPreviousIndex() == $scope.currentIndex;
    };

    $scope.isNextButtonDisabled = function(){
      return $scope.circular == "no" && $scope.getNextIndex() == $scope.currentIndex;
    };

    $scope.isLastButtonDisabled = function(){
      return $scope.circular == "no" && $scope.getLastIndex() == $scope.currentIndex;
    };

    $scope.loaded = function(){
      $scope.loading = false;
    };

    //Handle Keypress
    $scope.$on('key.escape', function(event){ $scope.redirectToParentGallery(); });
    $scope.$on('key.up', function(event){ $scope.goToFirstImage(); });
    $scope.$on('key.left', function(event){ $scope.goToPreviousImage(); });
    $scope.$on('key.right', function(event){ $scope.goToNextImage(); });
    $scope.$on('key.down', function(event){ $scope.goToLastImage(); });

    // Watch variables
    $scope.$watch("currentAngle", function(value){
      $scope.transformStyle = "rotate(" + $scope.currentAngle + "deg)";
      $scope.setSlideHeightPadding();
      $scope.setRotatedWidth();
    });
    $scope.$watch("currentIndex", function(value){ $scope.currentAngle = 0; $scope.setLeftOffset(); });
    $scope.$watch("circular", function(value){ SharedState.setValue('slideshow', 'circular', value); });
    $scope.$watch("quality", function(value){ SharedState.setValue('slideshow', 'quality', value); });

    // Monitor window resize
    jQuery(window).on('resize.doResize', function(){
      $scope.$apply(function(){
        var current_image = jQuery('.current-img');
        current_image.hide();
        $scope.setSlideHeightPadding();
        $scope.setRotatedWidth();
        $scope.setLeftOffset();
        current_image.show();
      });
    });
    $scope.$on("$destroy", function(){ jQuery(window).off('resize.doResize'); });

    // Change URL without reloading controller
    $scope.$on("$locationChangeSuccess", function(event){ if ($route.current.$$route.controller == 'SlideshowCtrl'){ $route.current = $scope.lastRoute; } });

    $scope.initializeData();
    if (CurrentUser.loggedIn()){
      Gallery.getObject({ operation: 'parent', id: $scope.gallery_id }, function(data){ $scope.parent_id = data.parent_id; });
      Gallery.getCollection({ operation: 'photos', id: $scope.gallery_id }, $scope.appendToImages);
      if (typeof(SharedState.getValue('slideshow', 'quality')) !== "undefined"){
        $scope.circular = SharedState.getValue('slideshow', 'circular');
        $scope.quality = SharedState.getValue('slideshow', 'quality');
      }
    } else{
      SharedState.setValue('user', 'after_login_path', $location.path());
      $location.path('/auth/login');
    }
  }
]);
