angular.module('starter.api', ['starter.config'])

.factory('Api', function($http,CONFIG,$window,$timeout,$q) {
  var self = this;
  server = CONFIG.base_url+CONFIG.endpoint;
  self.getPhotos = function() {
    return $http.get(server+CONFIG.photos).then(
      function(response) {
        return response.data;
      },function(error) {
        return error;
      });
    };

    self.takePhoto = function() {
      obj = {
        "nome": new Date().getTime()
      };
      return $http.post(server+CONFIG.takePhoto, obj).then(
        function(response) {
          return response.data;
        },function(error) {
          return error;
        });
      };

      self.deleteAll = function(password) {
        obj = {
          "pwd": password
        };
        return $http.post(server+CONFIG.deleteAll, obj).then(
          function(response) {
            return response.data;
          },function(error) {
            return error;
          });
        };

        return self;
      });
