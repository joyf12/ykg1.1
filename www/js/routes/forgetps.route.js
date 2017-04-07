angular.module('forgetps.route', ['ionic','forgetps.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('forgetps', {
    url: '/forgetps',
    templateUrl: 'templates/forgetps.html',
    controller: 'forgetpsCtrl' 
  })

});

