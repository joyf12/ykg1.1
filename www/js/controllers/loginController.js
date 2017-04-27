angular.module('loginController', ['ykg.services','global'])
.controller('loginCtrl', [
	'$scope',
	'toggleFty',
	'verificationFty',
	'GlobalVariable',
	'postDataFty',
	'Message',
	'$location',
	'getHashFty',
	'Storage',
	'$ionicPlatform',
	'$cordovaKeyboard',
	'$timeout',
	function(
		$scope,
		toggleFty,
		verificationFty,
		GlobalVariable,
		postDataFty,
		Message,
		$location,
		getHashFty,
		Storage,
		$ionicPlatform,
		$cordovaKeyboard,
		$timeout
		){

		$scope.$on('$ionicView.afterEnter', function(){
			$scope.checkphone();
			$scope.checkps();
		})
		$scope.bindData  = {
			phone:null,
			password:null,
			invalid:true
		};
	
	//检查手机号
	$scope.checkphone = function(){
		$scope.phoneErr = verificationFty.phoneNumber( $scope.bindData.phone );
		console.log($scope.phoneErr)
	};

	//检查密码
	$scope.checkps = function(){
		$scope.psErr = verificationFty.password( $scope.bindData.password );
		console.log($scope.phoneErr);
	};

	//焦点切换
	$scope.active = function(index){
		zoom();
		$scope.actions = -1;
		if(index){
			$scope.actions = toggleFty.actions(index);
		}
	};

	//登录
	$scope.login = function(){
		var url = GlobalVariable.SERVER_PATH + 'Info/login';
		
		// alert($scope.bindData.password)
		var params = {
			phone:$scope.bindData.phone,
			password:$scope.bindData.password
		}

		postDataFty.postData(params,url).then(
			function(data){
				// console.log(angular.toJson(data))
				if(data.ok){
					Message.show(data.ok,1600,function(){
						
						$location.path('/tab/home');
						Storage.set('userinfo',data);

					})
				}else if(data.error){
					Message.show(data.error, 1600);
					$scope.bindData.phone = null;
					$scope.bindData.password = null;
					
				}
				// alert(angular.toJson(data))
			},function(error){
				//错误
			})
	};

	// 隐藏logo
	function zoom(){
		$timeout(function(){
			if($cordovaKeyboard.isVisible()){
				$('.logo:eq(0)').animate({opacity:'0',height:'100px'}, 100);
			}else{

			}
		},160)
		
	}

	$scope.zoom2 = function(){
		$('.logo:eq(0)').animate({opacity:'1',height:'200px'}, 100);
	}

	
	
}])
