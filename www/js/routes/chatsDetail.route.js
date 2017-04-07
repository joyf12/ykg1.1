
angular.module('chatsDetail.route', ['ionic'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
});
