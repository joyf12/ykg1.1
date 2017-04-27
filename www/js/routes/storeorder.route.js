angular.module('storeorder.route', ['ionic','storeorder.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('storeorder', {
    url: '/storeorder',
    templateUrl: 'templates/storeorder.html',
    controller: 'storeorderCtrl' 
  })

});

