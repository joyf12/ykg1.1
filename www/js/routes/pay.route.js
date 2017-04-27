angular.module('pay.route', ['ionic','pay.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('pay', {
    url: '/pay',
    templateUrl: 'templates/pay.html',
    controller: 'payCtrl' 
  })
});

