angular.module('sidemenu.controller', ['ionic','ykg.services'])
.controller('sidemenuCtrl', [
	'toggleFty',
	'$scope',
	'$ionicSideMenuDelegate',
	function(
		toggleFty,
		$scope,
		$ionicSideMenuDelegate
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

	$scope.toggleLeft = function() {
   		$ionicSideMenuDelegate.toggleLeft();
  	};

  	$scope.toggleLeft();



	
}])