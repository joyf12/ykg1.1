angular.module('storeaccount.route', ['ionic','storeaccount.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('storeaccount', {
    url: '/storeaccount',
    templateUrl: 'templates/storeaccount.html',
    controller: 'storeaccountCtrl' 
  })
});

