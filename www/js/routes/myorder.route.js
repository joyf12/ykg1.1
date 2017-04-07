angular.module('myorder.route', ['ionic', 'myorder.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('myorder', {
    url: '/myorder',
    templateUrl: 'templates/myorder.html',
    controller: 'myorderCtrl' 
  })

});

