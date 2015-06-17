var PixomatixServices = angular.module("PixomatixServices", []);

PixomatixServices.factory("Gallery", ["$resource", "$routeParams", "Config",
  function($resouce, $routeParams, Config){
    var headers = { 'Accept' : "application/vnd.pixomatix." + Config.api_version };
    var resource = $resouce(Config.api_url + "/galleries/:id/:operation.json", { id: '@id' }, {
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

PixomatixServices.factory("CurrentUser", ["$cookies", "Auth",
  function($cookies, Auth){
    return {
      get: function(){
        var current_user = $cookies.getObject('current_user');
        return (typeof(current_user) === "undefined") ? {} : current_user;
      },

      set: function(email, token){
        $cookies.putObject('current_user', { email: email, token: token });
      },

      reset: function(){
        $cookies.remove('current_user');
      },

      loggedIn: function(){
        var current_user = this.get();
        if (typeof(current_user.email) === "undefined" || typeof(current_user.token) === "undefined"){
          return false;
        }
        return true;
      },
    };
  }
]);

PixomatixServices.factory("Auth", ["$resource", "$cookies", "Config",
  function($resource, $cookies, Config){
    var default_headers = { 'Accept' : "application/vnd.pixomatix." + Config.api_version };

    var resource_with_headers = function(headers){
      var current_user = $cookies.getObject('current_user');

      if (typeof(headers) === "undefined"){ headers = {}; }

      if (current_user && current_user.email && current_user.token){
        headers = angular.extend(headers, { 'X-Access-Email': current_user.email, 'X-Access-Token' : current_user.token });
      }

      var resource = $resource(Config.api_url + "/auth/:operation", {}, {
        get: { method: 'GET', headers: angular.extend(default_headers, headers) },
        post: { method: 'POST', headers: angular.extend(default_headers, headers) },
        put: { method: 'PUT', headers: angular.extend(default_headers, headers) },
        delete: { method: 'DELETE', headers: angular.extend(default_headers, headers) }
      });

      resource.register = function(params, data, success, failure){
        return this.post({ operation: 'register' }, data, success, failure);
      };

      resource.login = function(params, data, success, failure){
        return this.post({ operation: 'login' }, data, success, failure);
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
    };

    return resource_with_headers;
  }
]);

PixomatixServices.service('SharedState', [
  function(){
    this.state= {};

    this.reset = function(namespace){
      this.state[namespace] = {};
    };

    this.setValue = function(namespace, variable, values){
      if (typeof(this.state[namespace]) === "undefined"){ this.state[namespace] = {}; }
      this.state[namespace][variable] = values;
    };

    this.getValue = function(namespace, variable){
      if (typeof(this.state[namespace]) === "undefined"){ this.state[namespace] = {}; }
      return this.state[namespace][variable];
    };
  }
]);
