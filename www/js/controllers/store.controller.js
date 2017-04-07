angular.module('store.controller', ['ionic','ykg.services'])
.controller('storeCtrl', [
	'toggleFty',
	'$scope',
	function(
		toggleFty,
		$scope
		){


	$scope.active = function(index){
		$scope.actions = -1;
		if(index){
			$scope.actions = toggleFty.actions(index);
		}
	};


	$scope.$on('$ionicView.afterEnter',function(){
		$scope.active();
	})

	$scope.options = {
	  loop: true,
	  effect: 'slide',
	  speed: 500,
	}

	 $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
      })
}])