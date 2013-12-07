'use strict';

angular.module('planetsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
])
  .config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/testbed.html',
        controller: 'MainCtrl'
      });

    $routeProvider.otherwise({
        redirectTo: '/'
      });
  });
