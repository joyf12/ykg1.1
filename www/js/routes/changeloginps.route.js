angular.module('changeloginps.route', ['ionic','changeloginps.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('changeloginps', {
    url: '/changeloginps',
    templateUrl: 'templates/changeloginps.html',
    controller: 'changeloginpsCtrl' 
  })
});

