angular.module('newslist.route', ['ionic','newslist.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('newslist', {
    url: '/newslist',
    templateUrl: 'templates/newslist.html',
    controller: 'newslistCtrl' 
  })
});

