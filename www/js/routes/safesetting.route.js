angular.module('safesetting.route', ['ionic','safesetting.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('safesetting', {
    url: '/safesetting',
    templateUrl: 'templates/safesetting.html',
    controller: 'safesettingCtrl' 
  })
});

