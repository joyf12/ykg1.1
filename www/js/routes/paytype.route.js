angular.module('paytype.route', ['ionic','paytype.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('paytype', {
    url: '/paytype',
    templateUrl: 'templates/paytype.html',
    controller: 'paytypeCtrl' 
  })
});

