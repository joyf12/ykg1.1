
angular.module('tab.account', ['ionic','tabs.account.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'accountCtrl'
      }
    }
  });
});
