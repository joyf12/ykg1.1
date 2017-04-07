angular.module('withdraw.route', ['ionic','withdraw.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('withdraw', {
    url: '/withdraw',
    templateUrl: 'templates/withdraw.html',
    controller: 'withdrawCtrl' 
  })
});

