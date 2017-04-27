angular.module('moresetting.route', ['ionic', 'moresetting.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('moresetting', {
    url: '/moresetting',
    templateUrl: 'templates/moresetting.html',
    controller: 'moresettingCtrl' 
  })

});

