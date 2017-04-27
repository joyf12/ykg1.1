angular.module('newslist.controller', ['ykg.services', 'global'])
.controller('newslistCtrl', ['$scope',
 '$state',
 '$ionicHistory',
 'postDataFty',
 'GlobalVariable',
 'Message',
 'Storage',
   function ($scope,
    $state,
    $ionicHistory,
    postDataFty,
    GlobalVariable,
    Message,
    Storage) {
	
	
	$scope.$on('$ionicView.beforeEnter', function(event, viewData){
		viewData.enableBack = true;

	});


	$scope.$on('$ionicView.afterEnter', function(event, viewData){
		// $scope.getInfo();
		// getNews();
	});

	function getNews () {
		var url = GlobalVariable.SERVER_PATH + 'Index/news';
	  	postDataFty.postData(null, url).then(function(data){
	  		if(data.ok){
	  			$scope.news = data.ok;
	  			// alert(angular.toJson(data.ok[0].id));
	  		}
	  	},function(error){

	  	})
	};

	$scope.$on('$ionicView.afterEnter',function(){
		getNews();
	})

	








	
}]);

