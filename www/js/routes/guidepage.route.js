angular.module('guidepage.route', ['ionic','guidepage.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('guidepage', {
    url: '/guidepage',
    templateUrl: 'templates/guidepage.html',
    controller: 'guidepageCtrl' 
  })
});

