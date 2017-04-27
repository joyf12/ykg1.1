angular.module('uploadlog.route', ['ionic','uploadlog.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('uploadlog', {
    url: '/uploadlog',
    cache:'false',
    templateUrl: 'templates/uploadlog.html',
    controller: 'uploadlogCtrl' 
  })
});

