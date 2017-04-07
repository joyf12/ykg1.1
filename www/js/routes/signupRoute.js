angular.module('signup.route', ['ionic','signupController'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl' 
  })

});

