
angular.module('tabs.dash', ['home.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'homeCtrl'
      }
    }
  })
});
