angular.module('store.route', ['ionic','store.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('store', {
    url: '/store/:storeId',
    templateUrl: 'templates/store.html',
    controller: 'storeCtrl' 
  })

});

