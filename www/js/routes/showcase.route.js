angular.module('showcase.route', ['ionic','showcase.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('showcase', {
    url: '/showcase',
    templateUrl: 'templates/showcase.html',
    controller: 'showcaseCtrl' 
  })

});

