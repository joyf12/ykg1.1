angular.module('popularize.route', ['ionic','popularize.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('popularize', {
    url: '/popularize',
    templateUrl: 'templates/popularize.html',
    controller: 'popularizeCtrl' 
  })
});