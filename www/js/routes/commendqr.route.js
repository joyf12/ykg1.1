angular.module('commendqr.route', ['ionic','commendqr.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('commendqr', {
    url: '/commendqr',
    templateUrl: 'templates/commendqr.html',
    controller: 'commendqrCtrl' 
  })

});

