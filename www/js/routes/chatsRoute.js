
angular.module('chatsRoute', ['ionic'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
});
