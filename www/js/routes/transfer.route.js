angular.module('transfer.route', ['ionic','transfer.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('transfer', {
    url: '/transfer',
    templateUrl: 'templates/transfer.html',
    controller: 'transferCtrl' 
  })
});

