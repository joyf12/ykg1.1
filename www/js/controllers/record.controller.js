
angular.module('record.controller', ['global','ykg.services','ionic'])
.controller('recordCtrl', [
	'$scope',
	'GlobalVariable',
	'$stateParams',
	'postDataFty',
	'getCurrentUserFty',
	'Message',
	'$ionicLoading',
	function($scope,
		GlobalVariable,
		$stateParams,
		postDataFty,
		getCurrentUserFty,
		Message,
		$ionicLoading) {
	   		  //获取用户的信息
	   		  var userInfo = getCurrentUserFty.getCurrentUser();

	   		  $scope.page = 1;
		      $scope.data = new Array();
		      var params = {};
		      $scope.count = 0;

		      $scope.nomore = false;
	      	  var isLock = false;

			  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
				    viewData.enableBack = true;
				});
			  $scope.loadMore = function () {
			      	if (isLock) {
			      		return;
			      	};
			      	
			      	isLock = true;
			      	var url = GlobalVariable.SERVER_PATH + 'Person/txjl/';
			        if ($scope.count == 0 || $scope.count > $scope.data.length) {
			          // params['page']= $scope.page;
			          params = {
			          	id: 2,
			          	page:1
			            // rand: userInfo.rand,
			            // page: $scope.page
			        };

			        var promise = postDataFty.postData(params, url);
			          promise.then(function (data) {
				                if (data.count != 0) {
					                  if ($scope.data.length == 0) {
					                  	$scope.data = data.ok;
					                  } else {
					                  	$scope.data = $scope.data.concat(data.ok);
					                  }
					              	}
							    isLock = false;
							    $scope.count = data.count;

					            $scope.$broadcast('scroll.infiniteScrollComplete');
					            $scope.page += 1;

			          }, function (error) {
			          	Message.show('获取信息失败', 1000);
			        	})
			        } else {
			        	Message.show('数据加载完毕',1000);
			        	$scope.nomore = true;
			        	isLock = true;
			        	$scope.$broadcast('scroll.infiniteScrollComplete');
			        };
			    };
	   }]).filter('myFilter',function(){
	   	return function(ipt){
	   		return ipt.replace(/0/,'未审核');
	   	}
	   }).filter('myFilter1',function(){
	   	return function(ipt){
	   		return ipt.replace(/1/,'已完成');
	   	}
	   })


