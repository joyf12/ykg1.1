angular.module('setWithdrawPS.route', ['ionic','setWithdrawPS.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('setWithdrawPS', {
    url: '/setWithdrawPS',
    templateUrl: 'templates/setWithdrawPS.html',
    controller: 'setWithdrawPSCtrl' 
  })
});

