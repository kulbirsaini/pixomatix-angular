var galleryServices = angular.module("galleryServices", ['ngResource']);

galleryServices.factory("Gallery", ["$resource", "$routeParams",
  function($resouce, $routeParams){
    //TODO FIXME
    var headers = { 'Accept' : "application/vnd.pixomatix.v1" };
    var resource = $resouce("http://localhost:1234/api/galleries/:id/:operation.json", { id: '@id' }, {
      get: { method: 'GET', isArray: false, headers: headers },
      query: { method: 'GET', isArray: true, headers: headers }
    });

    resource.getCollection = function(params, success, failure){
      return this.query({ operation: params.operation, id: params.id }, success, failure);
    };

    resource.getObject = function(params, success, failure){
      return this.get({ operation: params.operation, id: params.id }, success, failure);
    };

    return resource;
  }
]);

galleryServices.factory("CurrentUser", ["$cookies", "Auth",
  function($cookies, Auth){
    return {
      get: function(){
        var current_user = $cookies.getObject('current_user');
        return (typeof(current_user) === "undefined") ? {} : current_user;
      },

      loggedIn: function(){
        var current_user = this.get();
        if (typeof(current_user.email) === "undefined" || typeof(current_user.token) === "undefined"){
          return false;
        }
        Auth().validate().$promise.then(function(){ console.log(true); }).catch(function(){ console.log(false); });
      },
    };
  }
]);

galleryServices.factory("Auth", ["$resource", "$cookies",
  function($resource, $cookies){
    //TODO FIXME
    var default_headers = { 'Accept' : "application/vnd.pixomatix.v1" };

    var resource_with_headers = function(headers){
      if (typeof(headers) === "undefined"){
        var current_user = $cookies.getObject('current_user');
        if (typeof(current_user) !== "undefined"){
          headers = angular.extend({}, { 'X-Access-Email': current_user.email, 'X-Access-Token' : current_user.token });
        }
      }
      //TODO FIXME
      var resource = $resource("http://localhost:1234/api/auth/:operation", {}, {
        get: { method: 'GET', headers: angular.extend(default_headers, headers) },
        post: { method: 'POST', headers: angular.extend(default_headers, headers) },
        put: { method: 'PUT', headers: angular.extend(default_headers, headers) },
        delete: { method: 'DELETE', headers: angular.extend(default_headers, headers) }
      });

      resource.register = function(params, data, success, failure){
        return this.post({ operation: 'register' }, data, success, failure);
      };

      resource.login = function(params, data, success, failure){
        return this.post({ operation: 'login' }, data, success, failure).$promise.then(function(response){ console.log(response); $cookies.putObject('current_user', { email: response.user.email, token: response.token }); });;
      };

      resource.user = function(params, success, failure){
        return this.get({ operation: 'user' }, success, failure);
      };

      resource.logout = function(params, data, success, failure){
        return this.delete({ operation: 'logout' }, data, success, failure);
      };

      resource.validate = function(params, success, failure){
        return this.get({ operation: 'validate' }, success, failure);
      };

      resource.reset_password_instructions = function(params, success, failure){
        return this.get({ operation: 'reset_password' }, success, failure);
      };

      resource.reset_password = function(params, data, success, failure){
        return this.post({ operation: 'reset_password' }, data, success, failure);
      };

      resource.unlock_instructions = function(params, success, failure){
        return this.get({ operation: 'unlock' }, success, failure);
      };

      resource.unlock = function(params, data, success, failure){
        return this.post({ operation: 'unlock' }, data, success, failure);
      };

      resource.confirmation_instructions = function(params, success, failure){
        return this.get({ operation: 'confirm' }, success, failure);
      };

      resource.confirm = function(params, data, success, failure){
        return this.post({ operation: 'confirm' }, data, success, failure);
      };

      return resource;
    }

    return resource_with_headers;
  }
]);

galleryServices.service('Settings', ['Gallery',
  function(Gallery){
    this.settings = {}

    this.reset = function(){
      this.settings = {};
    };

    this.setValue = function(variable, values){
      this.settings[variable] = values;
    };

    this.getValue = function(variable){
      return this.settings[variable];
    };
  }
]);
