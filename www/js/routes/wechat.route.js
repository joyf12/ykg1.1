angular.module('wechat.route', ['ionic','wechat.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('wechat', {
    url: '/wechat',
    templateUrl: 'templates/wechat.html',
    controller: 'wechatCtrl' 
  })
});

