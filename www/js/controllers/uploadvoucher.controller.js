angular.module('uploadvoucher.controller', ['ionic', 'ykg.services'])
  .controller('uploadvoucherCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    'postDataFty',
    'GlobalVariable',
    '$q',
    '$timeout',
    '$location',
    '$cacheFactory',
    'Message',
    'cacheFty',
    'uploadPicFty',
    function ($rootScope,
              $scope,
              $state,
              postDataFty,
              GlobalVariable,
              $q,
              $timeout,
              $location,
              $cacheFactory,
              Message,
              cacheFty,
              uploadPicFty) {
      // $scope.picArr = '';
      var oldPicArr = ['0'];
      var picArr = [];
      var oldData;

      //返回按钮
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
        cacheFty.remove('orderno');//删除缓存
      });

      //调用手机的相机或机册选择凭证
      $scope.selectPic = function () {
        var promise = uploadPicFty.activeSheet(true);
        promise.then(function (data) {
          if (data != null && oldPicArr != picArr) {
            picArr.push(data);
            if (oldPicArr.length != picArr.length) {
              // $('.pageBox').eq(0).prepend('<div class="VoucherPic"><img src="' + picArr[picArr.length - 1] + '"/></div>');//把图片显示在视图上
              // $('.VoucherPic').eq(0).prepend('<i ng-show="false" class="badage badage-assertive icon iconfont icon-close"></i>');//把图片显示在视图上
            }
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
          // alert($scope.statesign.orderNo)
          $scope.statesign.orderNo = $scope.statesign.orderNo.splice(0,$scope.statesign.orderNo.length-1);
          // alert($scope.statesign.orderNo)
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
      // var userInfo = getCurrentUserFty.getCurrentUser();
      var userInfo = {};

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
        if(cacheFty.getCache('orderno') == undefined){
          cacheFty.setCache(oDate,'orderno', $scope.statesign.orderNo);  
        }

        if (picArr.length >= 1) {//如果上传了图片
          e = e || window.event;
          e.preventDefault();
          $scope.statesign.buttonText = '上传中...';
          $scope.statesign.buttonWaite = true;
          // var orderStr = '0';
         
          var url = GlobalVariable.SERVER_PATH + "Home/Index/uploadprove/";
          // var orderInfo = $rootScope.selectedOrder.orderNo;//订单价格和订单编号
           // alert(orderInfo);
          //数组上传数据格式 名称相同 但必须有一个[]中括号
          var t = "";
          for (var i = 0; i < picArr.length; i++) {
            if (i == picArr.length - 1) {
              t += "data[]=" + picArr[i];
            } else {
              t += "data[]=" + picArr[i] + "&";
            }
          }
          var s = "uid=" + userInfo.id + "&rand=" + userInfo.rand + '&bookid=' + $scope.statesign.orderNo + "&" + t;
          var promise = postDataFty.postData(s, url);
          promise.then(function (data) {
            console.log(angular.toJson(data))
            data.state = Number(data.state);
            if (data.state == 0) {
              $scope.statesign.buttonWaite = false;
              Message.show('上传完成');
              $scope.statesign.buttonText = '上传完成';
              $scope.statesign.buttonState = true;
              $location.path('/uploadedVoucher');
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
          cacheFty.remove('orderno');
        }
      };

    }]);

