angular.module('EasyRashApp', ['ngRoute', 'ngSanitize','ui.bootstrap', 'EasyRashApp.config', 'EasyRashApp.controllers', 'EasyRashApp.api', 'EasyRashApp.utils'])

.run(function($rootScope, $window) {
  console.info("SelfiePlatform is running bitchh!");
})

.config(function($routeProvider,$httpProvider) {
  $routeProvider.
  when('/dash', {
    templateUrl: 'templates/dash.html',
    controller: 'DashCtrl'
  }).
  when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  }).
  when('/clogs', {
    templateUrl: 'templates/logs.html',
    controller: 'LogsCtrl'
  }).
  when('/foto', {
    templateUrl: 'templates/photos.html',
    controller: 'PhotosCtrl'
  }).
  when('/foto/:fotoId', {
    templateUrl: 'templates/photo.html',
    controller: 'PhotoCtrl'
  }).
  otherwise({
    redirectTo: '/login'
  });
});
