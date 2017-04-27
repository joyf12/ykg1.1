angular.module('applyShop.route', ['ionic','applyShop.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('applyShop', {
    url: '/applyShop',
    templateUrl: 'templates/applyShop.html',
    controller: 'applyShopCtrl' 
  })
});

