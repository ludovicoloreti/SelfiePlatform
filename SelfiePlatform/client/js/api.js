angular.module('EasyRashApp.api', ['EasyRashApp.config'])

.factory('Api', function($http,CONFIG,$window,$timeout,$q) {
  var self = this;

  self.getPhotos = function() {
    return $http.get(CONFIG.endpoint+CONFIG.photos).then(
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
      return $http.post(CONFIG.endpoint+CONFIG.takePhoto, obj).then(
        function(response) {
          return response.data;
        },function(error) {
          return error;
        });
      };

      self.deleteLogs = function(password) {
        obj = {
          "pwd": password
        };
        return $http.post(CONFIG.endpoint+CONFIG.deleteLogs, obj).then(
          function(response) {
            return response.data;
          },function(error) {
            return error;
          });
        };

        self.movePhotos = function(password) {
          obj = {
            "pwd": password
          };
          return $http.post(CONFIG.endpoint+CONFIG.movePhotos, obj).then(
            function(response) {
              return response.data;
            },function(error) {
              return error;
            });
          };


        self.restart = function(password) {
          obj = {
            "pwd": password
          };
          return $http.post(CONFIG.endpoint+CONFIG.restart, obj).then(
            function(response) {
              console.log(response)
              return response.data;
            },function(error) {
              console.error(error)
              return error;
            });
          };

          self.deleteAll = function(password) {
            obj = {
              "pwd": password
            };
            return $http.post(CONFIG.endpoint+CONFIG.deleteAll, obj).then(
              function(response) {
                return response.data;
              },function(error) {
                return error;
              });
            };

            return self;
          });
