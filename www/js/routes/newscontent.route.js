angular.module('newscontent.route', ['ionic','newscontent.controller'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('newscontent', {
    url: '/newscontent/:newsId',
    templateUrl: 'templates/newscontent.html',
    controller: 'newscontentCtrl' 
  })
});

