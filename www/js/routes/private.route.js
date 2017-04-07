angular.module('private.route', ['ionic','private.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('private', {
    url: '/private',
    templateUrl: 'templates/private.html',
    controller: 'privateCtrl' 
  })
});

