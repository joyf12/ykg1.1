angular.module('mybasket.route', ['ionic','mybasket.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('mybasket', {
    url: '/mybasket',
    templateUrl: 'templates/mybasket.html',
    controller: 'mybasketCtrl' 
  })
});

