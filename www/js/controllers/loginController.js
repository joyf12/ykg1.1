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
	function(
		$scope,
		toggleFty,
		verificationFty,
		GlobalVariable,
		postDataFty,
		Message,
		$location,
		getHashFty,
		Storage
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
		$scope.actions = -1;
		if(index){
			$scope.actions = toggleFty.actions(index);
		}
	};

	//登录
	$scope.login = function(){
		var url = GlobalVariable.SERVER_PATH + 'Info/login';
		$scope.bindData.password = getHashFty.getHash($scope.bindData.password);
		// alert($scope.bindData.password)
		var params = {
			phone:$scope.bindData.phone,
			password:$scope.bindData.password
		}

		postDataFty.postData(params,url).then(
			function(data){
				if(data.ok){
					Message.show(data.ok,1600,function(){
						var userinfo = {
							name:'张三',
							phone:'13537038207',
							banknumber:'8888888888888',
							type:'商家'
						}
						$location.path('/tab/home');
						Storage.set('userinfo',userinfo)

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
}])