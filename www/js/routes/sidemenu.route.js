angular.module('sidemenu.route', ['ionic','sidemenu.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('sidemenu', {
    url: '/sidemenu',
    templateUrl: 'templates/sidemenu.html',
    controller: 'sidemenuCtrl' 
  })

});

