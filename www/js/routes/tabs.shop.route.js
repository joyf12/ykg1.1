angular.module('tab.shop.route', ['ionic', 'shop.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tab.shop', {
    url: '/shop',
    views: {
      'tab-shop': {
        templateUrl: 'templates/tab-shop.html',
        controller: 'shopCtrl'
      }
    }
  });
});