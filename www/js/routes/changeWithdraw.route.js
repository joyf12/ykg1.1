angular.module('changeWithdraw.route', ['ionic','changeWithdraw.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('changeWithdraw', {
    url: '/changeWithdraw',
    templateUrl: 'templates/changeWithdraw.html',
    controller: 'changeWithdrawCtrl' 
  })
});

