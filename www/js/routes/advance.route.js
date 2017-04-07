angular.module('advance.route', ['ionic','advance.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('advance', {
    url: '/advance',
    templateUrl: 'templates/advance.html',
    controller: 'advanceCtrl' 
  })
});

