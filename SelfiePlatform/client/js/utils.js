angular.module('EasyRashApp.utils', [])

/*.directive('myTooltip', function () {
    return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            element.qtip();
        }server
    };
});

// l'html diventa:
<span my-tooltip title="Testo nel tooltip">Testo nel box</span>
*/


/**
  * LOCAL STORAGE easy way to use
**/
.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    remove: function(key) {
      return $window.localStorage.removeItem(key);
    }
  }
}]);
