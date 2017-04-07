angular.module('signupController', ['ykg.services', 'global'])
.controller('signupCtrl', [
	'$scope',
	'$interval',
	'GlobalVariable',
	'postDataFty',
	'verificationFty',
	'Message',
	'$ionicHistory',
	'getHashFty',
	function(
		$scope,
		$interval,
		GlobalVariable,
		postDataFty,
		verificationFty,
		Message,
		$ionicHistory,
		getHashFtys
		){
	$scope.bindData = {
		nickname:null,
		phone:null,
		code:null,
		password:null,
		password2:null,
		add:null,
		CodeInterval:null,
		verificationBtn:'获取验证码',
		runing:false,
		refer:null
	}

	$scope.$on('$ionicView.afterEnter', function(e){
		$scope.bindData.nickname = null;
		$scope.bindData.phone = null;
		$scope.bindData.code = null;
		$scope.bindData.password = null;
		$scope.bindData.password2 = null;
		$scope.bindData.add = null;
		$scope.bindData.runing = false;
		$scope.bindData.refer = null;
		$scope.bindData.add = null;
	})

	$scope.checkNickname = function(){
		$scope.chineseErr = verificationFty.chinese();
	}

	//检查手机号
	$scope.checkphone = function(){
		$scope.phoneErr = verificationFty.phoneNumber( $scope.bindData.phone );
		console.log($scope.phoneErr)
	};

	//检查推荐人手机号
	$scope.refer = function(){
		$scope.referErr = verificationFty.phoneNumber( $scope.bindData.refer );
		console.log($scope.phoneErr)
	};


	//检查密码
	$scope.checkps = function(){
		$scope.psErr = verificationFty.password( $scope.bindData.password );
		console.log($scope.phoneErr);
	};

	//密码两次不一致
	$scope.checkps2 = function(){
		if($scope.bindData.password === $scope.bindData.password2){
			$scope.psErr2 = false;
		}else{
			$scope.psErr2 = true;
		}
	};

	//地址不能为空
	$scope.checkadd = function(){
		if($scope.bindData.add == null){
			$scope.addErr = true;
		}else{
			$scope.addErr = false;
		}
	};

	//获取验证码
	var timer = null, isFirst = true;
    $scope.getCode = function () {
    	if(!$scope.bindData.runing){
	        $scope.bindData.CodeInterval = 60;
	        $interval.cancel(timer);//避免定时器叠加
	        timer = $interval(function () {
	          if ($scope.bindData.CodeInterval <= 0) {
	            $interval.cancel(timer);
	            // $scope.bindData.CodeInterval=5;
	            $scope.bindData.verificationBtn = '获取验证码'
	            $scope.bindData.CodeInterval = null;
	            $scope.bindData.runing = false;
	            isFirst = true;

	          } else {
	          	$scope.bindData.runing = true;
	            $scope.bindData.CodeInterval--;
	            $scope.bindData.verificationBtn = '秒后重试获取'
	          }

	        }, 1000, 61);

	        if (isFirst) {
	          var url = GlobalVariable.SERVER_PATH + 'info/sendcode';
	          console.log(url)
	          var params = {
	          	phone:$scope.bindData.phone
	          }


	          postDataFty.postData(params, url).then(
	          	function(data){
	          		if(data.error){
	          			Message.show(data.error,1600);
	          		}
	          	},function(error){

	          	});
	          isFirst = false;
	        }
        }
    };

	$scope.$on('$ionicView.afterEnter',function(){
	  	$scope.checkps2();
	  	$scope.checkps2();
	  	$scope.checkphone();
	});

	$scope.signup = function(){
		var url = GlobalVariable.SERVER_PATH + 'Info/register';
		$scope.bindData.password = getHashFty.getHash($scope.bindData.password);
		$scope.bindData.password2 = getHashFty.getHash($scope.bindData.password2);
		var params = {
			phone:$scope.bindData.phone,
			referphone:$scope.bindData.refer,
			password:$scope.bindData.password,
			password1:$scope.bindData.password2,
			username:$scope.bindData.nickname,
			code:$scope.bindData.code
		}

		postDataFty.postData(params, url).then(function(data){
			if(data.ok){
				Message.show('注册成功，2秒后返回登录页', 2000,function(){
					$ionicHistory.goBack();
				})
			}else if(data.error){
				Message.show(data.error,1600);
			}

		},function(error){

		})
	}
}])