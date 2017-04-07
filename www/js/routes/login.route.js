angular.module('login.route', ['ionic', 'loginController'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl' 
  })

});

