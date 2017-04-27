angular.module('popularize.controller', ['ykg.services', 'global'])
.controller('popularizeCtrl', ['$scope',
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
		var url = GlobalVariable.SERVER_PATH + 'Person/mytg/';
		var params = {
			id:1
		}
	  	postDataFty.postData(params, url).then(function(data){
	  		if(data.ok){
	  			$scope.res = data.ok;
	  			alert(angular.toJson(data));
	  		}
	  	},function(error){

	  	})
	};

	$scope.$on('$ionicView.afterEnter',function(){
		getNews();
	})

	getNews();

	








	
}]);

