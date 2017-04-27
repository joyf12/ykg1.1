angular.module('applyShop.controller', ['ykg.services', 'ionic-citypicker','global'])
  .controller('applyShopCtrl', [
    '$scope',
    'uploadPicFty',
    'uploadPicFty',
    'CityPickerService',
    'getDataFty',
    'GlobalVariable',
    'postDataFty',
    'getCurrentUserFty',
    'getDataFty',
    'popupFty',
    '$q',
    '$state',
    'Message',
    '$stateParams',
    '$timeout',
    '$location',
    function ($scope,
              uploadPicFty,
              uploadPicFty,
              CityPickerService,
              getDataFty,
              GlobalVariable,
              postDataFty,
              getCurrentUserFty,
              getDataFty,
              popupFty,
              $q,
              $state,
              Message,
              $stateParams,
              $timeout,
              $location) {
      //上传营业执照
      $scope.picArr = [], $scope.picBox = 0//
      // var $scope.picArr2 = [];
      // var old$scope.PicArr = [];
      // var old$scope.PicArr2 = [];
      // // $scope.type = $stateParams('type')

      //上传图片
      $scope.uploadPic = function(index){
        var promise = uploadPicFty.activeSheet(true).then(
          function(data){
            if(index == 1){
              $scope.picArr[0] = data;
            }else{
              $scope.picArr[1] = data;
            }

            $scope.picBox = $scope.picArr.length;
          },
          function(error){
            //error
          });
      };

      
      //得到分类
      function getShopClass() {
        var url = GlobalVariable.SERVER_PATH + 'index/classitem';
        getDataFty.getData(null, url).then(
          function (data) {
            // alert(angular.toJson(data))
            $scope.shopclass = data.ok;
          }, function (error) {

          })
      }

      //页面监听
      $scope.$on('$ionicView.afterEnter', function (e) {
        $scope.selected2();//已经选择的分类
        getShopClass();//商家分类
      })

      var selectedShopClass = null

      //商家分类
      $scope.selected2 = function (id) {
        selectedShopClass = id ? id : 1;
      }

      //地区选择插件
      var vm = $scope.vm = {};
      vm.CityPickData2 = {
        areaData: [],
        defaultAreaData: ['广东省', '东莞市'],
        title: '选择你的省市：',
        hardwareBackButtonClose: false
      }
      
      //双向绑定的值
      $scope.shopInfo = {
        shopName: null,
        shopkeeper: null,
        shopPhone: null,
        shopAddress: null,
        shopClass: null,
        buttonState: false,
        buttonText: '提交',
        buttonWaite: false
      };

      //上传成为商家
      $scope.uploadVoucher = function (e) {
        e = e || window.event;
        e.preventDefault();
        $scope.shopInfo.buttonWaite = true;
        $scope.shopInfo.buttonText = '上传中...';
        if (!$scope.shopInfo.buttonState) {
          var userInfo = getCurrentUserFty.getCurrentUser();
          var url = GlobalVariable.SERVER_PATH + 'info/isshop';
          params = {
            id: userInfo.info.userid,
            // rand: userInfo.rand,
             // idnumber:$scope.shopInfo.identity,
            legalperson: $scope.shopInfo.shopkeeper,//店主
            shopname: $scope.shopInfo.shopName,//商家名
            shopphone: $scope.shopInfo.shopPhone,//商家电话

            shopprovince: vm.CityPickData2.areaData[0],//店所在省
            shopcity: vm.CityPickData2.areaData[1],//店所在市
            shopdistrict: vm.CityPickData2.areaData[2] ? vm.CityPickData2.areaData[2] : '市辖区',//店所在区如果没有就店市辖区
            shopclass: selectedShopClass,//商家分类id
            shopaddress: $scope.shopInfo.shopAddress,//店铺详细地址
            // shopclass:selectedShopClass,//店铺详细地址
            shopidcard: $,//营业执照
            shopdoor: 2//门
          };


          //提交数据
          if (!$scope.shopInfo.buttonState) {
            postDataFty.postData(params, url).then(
              function (data) {
                $scope.shopInfo.buttonWaite = false;
                
                // alert(angular.toJson(data))
                if (data.ok) {
                  
                  // $scope.shopInfo.buttonText = '提交成功';
                  popupFty.AlertPopup('提示', 
                    '你的申请已提交，我们会尽快处理，可在个人中心“商家信息”处查看状态', 
                    '返回首页',
                    function () {
                    $location.path('/tab/home');
                  })
                  $scope.shopInfo.buttonText = '完成，返回首页';
                  $scope.shopInfo.buttonState = true;
                  $scope.shopInfo.buttonWaite = false;
                }else if(data.error){
                  Message.show(data.error, 1600);
                  $scope.shopInfo.buttonText = '提交';
                  $scope.shopInfo.buttonState = false;
                  $scope.shopInfo.buttonWaite = false;
                }
              }, function (error) {
                $scope.shopInfo.buttonState = false;
                $scope.shopInfo.buttonText = '提交';
                $scope.shopInfo.buttonWaite = false;
              })
          }
        } else {
          $state.go('indexTab.home');

        }
      }

    }]);
