angular.module('goodsManager.route', ['ionic','goodsManager.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('goodsManager', {
    url: '/goodsManager',
    templateUrl: 'templates/goodsManager.html',
    controller: 'goodsManagerCtrl' 
  })
});

