angular.module('uploadvoucher.route', ['ionic','uploadvoucher.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('uploadvoucher', {
    url: '/uploadvoucher',
    templateUrl: 'templates/uploadvoucher.html',
    controller: 'uploadvoucherCtrl' 
  })
});

