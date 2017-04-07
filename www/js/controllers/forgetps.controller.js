angular.module('forgetps.controller', ['ionic','ykg.services', 'global'])
.controller('forgetpsCtrl', [
	'toggleFty',
	'$scope',
	'$interval',
	'GlobalVariable',
	'postDataFty',
	'Message',
	'$ionicHistory',
	function(
		toggleFty,
		$scope,
		$interval,
		GlobalVariable,
		postDataFty,
		Message,
		$ionicHistory
		)
	{


	$scope.$on('$ionicView.afterEnter',function(){
		
	})


	$scope.bindData = {
		phone:null,
		code:null,
		password:null,
		password2:null,
		CodeInterval:null,
		verificationBtn:'获取验证码',
		runing:false,
		refer:null
	}

	$scope.$on('$ionicView.afterEnter', function(){})

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
	          var url = GlobalVariable.SERVER_PATH + 'info/sendcode/';
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


    //提交
    $scope.submite = function(){
    	var url = GlobalVariable.SERVER_PATH + 'info/setpassword/';
    	var params = {
    		phone:$scope.bindData.phone,
    		verifycode:$scope.bindData.code,
    		newpassword:$scope.bindData.password
    	}

    	postDataFty.postData(params, url).then(
    		function(data){
    			if(data.ok){
    				Message.show('修改成功', 1600, function(){
    					$ionicHistory.goBack();
    				})
    			}else if(data.error){
    				Message.show(data.error, 1600)
    			}
    		}, function(error){
    			Message.show('网络出错了，请检查网络或重试一次', 1600)
    		})
    }


	
}])