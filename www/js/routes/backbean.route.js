angular.module('backbean.route', ['ionic','backbean.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('backbean', {
    url: '/backbean',
    templateUrl: 'templates/backbean.html',
    controller: 'backbeanCtrl' 
  })
});

