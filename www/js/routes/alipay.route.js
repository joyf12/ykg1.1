angular.module('alipay.route', ['ionic','alipay.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('alipay', {
    url: '/alipay',
    templateUrl: 'templates/alipay.html',
    controller: 'alipayCtrl' 
  })
});

