angular.module('bankaccount.route', ['ionic','bankaccount.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('bankaccount', {
    url: '/bankaccount',
    templateUrl: 'templates/bankaccount.html',
    controller: 'bankaccountCtrl' 
  })
});

