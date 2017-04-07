angular.module('realname.route', ['ionic','realname.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('realname', {
    url: '/realname',
    templateUrl: 'templates/realname.html',
    controller: 'realnameCtrl' 
  })
});

