angular.module('record.route', ['ionic','record.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('record', {
    url: '/record',
    templateUrl: 'templates/record.html',
    controller: 'recordCtrl' 
  })
});

