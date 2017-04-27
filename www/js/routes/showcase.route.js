angular.module('showcase.route', ['ionic','showcase.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('showcase', {
    url: '/showcase/:storeId',
    templateUrl: 'templates/showcase.html',
    controller: 'showcaseCtrl' 
  })

});

