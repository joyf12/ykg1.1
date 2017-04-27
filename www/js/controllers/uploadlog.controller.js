angular.module('uploadlog.controller', ['ionic', 'ykg.services', 'global'])
  .controller('uploadlogCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    'uploadPicFty',
    'postDataFty',
    'getDataFty',
    'getCurrentUserFty',
    'GlobalVariable',
    '$q',
    '$timeout',
    '$location',
    '$cacheFactory',
    'Message',
    'cacheFty',
    '$location',
    function ($rootScope,
              $scope,
              $state,
              uploadPicFty,
              postDataFty,
              getDataFty,
              getCurrentUserFty,
              GlobalVariable,
              $q,
              $timeout,
              $location,
              $cacheFactory,
              Message,
              cacheFty,
              $location) {
      // $scope.picArr = '';
      var oldPicArr = ['0'];
      var picArr = [];
      var oldData;

      //返回按钮
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
        if(cacheFty.getCache('orderno')){
          cacheFty.remove('orderno');//删除缓存
        }
        
      });

      //调用手机的相机或机册选择凭证
      $scope.selectPic = function () {
        var promise = uploadPicFty.activeSheet(true);
        promise.then(function (data) {
          if (data != null && oldPicArr != picArr) {//第一次进入
            picArr.push(data);
            // if (oldPicArr.length != picArr.length) {

            // }
          }
          oldData = data;
        }, function (error) {//错误处理函数
          //
        })
        oldPicArr.length = picArr.length;
      };

      //显示model和操作按钮
      var oldIndex = {};
      $scope.operate = function(index){
        $scope.statesign.model[index] = index;
        // alert(index)
        if(oldIndex[index] != $scope.statesign.model[index]){
          $scope.statesign.model[index] = index;
          oldIndex[index] = index;
          // alert(index+'第一次点击')
        }else if(oldIndex[index] == $scope.statesign.model[index]){
          $scope.statesign.model[index] = -1;
          oldIndex[index] = null;
          // alert(index+'第二次点击')
        }    
      };

      //删除凭证
      $scope.delete = function(index){
        $scope.statesign.picArr = picArr.splice(index,1);
      };

      //状态标识
      $scope.statesign = {
        buttonText: '确定上传',
        buttonState: false,
        buttonWaite: false,
        selectPicArr:picArr,
        model:{},
        orderNo:null,
        manualInput:true
      };

      //判断是自动生成的订单号还是手动生成的
      if(cacheFty.getCache('orderno') != undefined){//如果为自动输入单号
          $scope.statesign.orderNo = cacheFty.getCache('orderno');
          $scope.statesign.orderNo = $scope.statesign.orderNo.splice(0,$scope.statesign.orderNo.length-1);
          $scope.statesign.orderNo = $scope.statesign.orderNo.join(',');
          $scope.statesign.manualInput = false;

          $('.manual').eq(0).attr('readonly','readonly'); 
      } else{
        $scope.edit = function(){
          $scope.statesign.orderNo = $scope.statesign.orderNo.replace(/\s+/g,'')//正则删除空格
          $scope.statesign.orderNo = $scope.statesign.orderNo.replace(/\D/g,',')//正则删除所有非数字的字符并替换成 ,
        }  
      }
      
      var timer = null;
      var userInfo = getCurrentUserFty.getCurrentUser();

      if(userInfo.error == 1){
        Message.show('你的帐号已在其他设备上登录了，请重新登录',1200);  
      }


      //上传凭证
      $scope.uploadVoucher = function (e) {
        var oDate = Date.now() + '';
        //暂存输入的订单号
        //字符串变成数组
        if(typeof $scope.statesign.orderNo == 'string'){
          $scope.statesign.orderNo = $scope.statesign.orderNo.replace(/\D+$/g,'')//把中文的逗号替换成英文的逗号
          $scope.statesign.orderNo = $scope.statesign.orderNo.split(',')
        }

        //如果没有缓存就存进去
        // if(cacheFty.getCache('orderno') == undefined){
        //   cacheFty.setCache(oDate,'orderno', $scope.statesign.orderNo);  
        // }

        // alert(angular.toJson($scope.statesign.orderNo))

        if (picArr.length >= 0) {//如果上传了图片
          e = e || window.event;
          e.preventDefault();
          $scope.statesign.buttonText = '上传中...';
          $scope.statesign.buttonWaite = true;
          // var orderStr = '0';
          var url = GlobalVariable.SERVER_PATH + "info/uploadprove/";
          //数组上传数据格式 名称相同 但必须有一个[]中括号

          var t = "";
          for (var i = 0; i < picArr.length; i++) {
            if (i == picArr.length - 1) {
              t += "data[]=" + picArr[i];
            } else {
              t += "data[]=" + picArr[i] + "&";
            }
          };
          // var s = "id=" + 2 + '&bookid=' + $scope.statesign.orderNo + "&data=" + 1;
          var params = {
            id:userInfo.info.userid,
            bookid:$scope.statesign.orderNo,
            // bookid:$scope.statesign.orderNo,
            data:t
          }
          // alert(angular.toJson(params))
          var promise = postDataFty.postData(params, url);
          promise.then(function (data) {
            alert(data.ok)
            console.log(angular.toJson(data))
            if (data.ok) {
              Message.show('上传完成',1600, function(){
                $location.path('/tab/home');
              });

              $scope.statesign.buttonText = '上传完成';
              $scope.statesign.buttonState = true;
              $scope.statesign.buttonWaite = false;
              $location.path('/uploadedVoucher');
            }else if(data.error){
              Message.show(data.error,1600);
              $scope.statesign.buttonText = '确定上传';
              $scope.statesign.buttonState = false;
              $scope.statesign.buttonWaite = false;

            }
          }, function (error) {
            Message.show('哎呀！上传出错了,重试一下');
            cacheFty.remove('orderno');
            $scope.statesign.buttonText = '确定上传';
            $scope.statesign.buttonState = false;
            $scope.statesign.buttonWaite = false;
          });
        }else{
          Message.show('你似乎没有选择凭证！')
          // cacheFty.remove('orderno');
        }
      };

    }]);

