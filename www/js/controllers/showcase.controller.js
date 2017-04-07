angular.module('showcase.controller', ['ionic','ykg.services'])
.controller('showcaseCtrl', [
	'toggleFty',
	'$scope',
	'$location',
	function(
		toggleFty,
		$scope,
		$location
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

	// 
	$scope.purchase = function(){
		$location.path('/uploadvoucher')
	}


	
}])