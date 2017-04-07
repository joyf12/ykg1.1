angular.module('ykg.services', ['ionic'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

//切换
.factory('toggleFty', function() {
  return {
    toggle:{current:'1'},
    actions:function(params) {
      return params;
    }
  }
})

//get请求
.factory('getDataFty',['$q','$http', function($q,$http){
  return {
    getData:function(params,url){
      var defered = $q.defer();
      $http.get(url,{params:params,timeout:10000}).success(function(data){

        defered.resolve(data);
      }).error(function(error){
        defered.reject(error)

      })
      return defered.promise;
    }
  }
}])

//本地存储
.factory('Storage', function () {
  return {
    set: function (key, data) {
      return window.localStorage.setItem(key, window.JSON.stringify(data));
    },
    get: function (key) {
      return window.JSON.parse(window.localStorage.getItem(key));
    },
    remove: function (key) {
      return window.localStorage.removeItem(key);
    }
  };
})

//弹窗
.factory('popupFty', ['$ionicPopup', '$q', function ($ionicPopup, $q) {
  return {
      // 弹出提示框
      AlertPopup:function(title, message, callback){//title 标题, message 信息体， callback回调
        var alertPopup = $ionicPopup.alert({
          title: title = title ? title : '提示',
          template: message,
          okType:'button-assertive',
          okText:'确定'
        });
        alertPopup.then(function(res) {
         callback() != null?callback:null;
       });
      },

      // //showpopup
      showPopup:function(title,subtitle,submit){//标题，子标题，确定文字,绑定的值
        submit = submit?submit:'确定';
        $scope.safecode = null;
        $ionicPopup.show({
          template: '<input type="password" ng-model="safecode">',
          title: title,
          subTitle: subtitle,
          scope: $scope,
          buttons: [
          {
            text: '取消',
            onTab:function(e){
              e.preventDefault();
            }
          },
          {
            text: '<b>'+submit+'</b>',
            type: 'button-positive',
            onTap: function(e) {
              e.preventDefault();
            }
          }
          ]});
      },

      //confirmPopup
      confirmPopup:function(title,template,confirm,callback,cancelfn){
       var confirmPopup = $ionicPopup.confirm({
         title: title,
         template: template,
         buttons:[
         {
          text:'取消',
          onTap:function(){
            cancelfn()?cancelfn:null;
          }
        },
        {
          text:confirm,
          type:'button-assertive',
          onTap:function(e){
            e.preventDefault();
            callback()?callback():null;
            confirmPopup.close();
          }
        }
        ]
      });

      confirmPopup.then(function(res) {
         if(res) {
           console.log('You are sure');
         } else {
           console.log('You are not sure');
         }
      });

     }

   }
 }])

//post请求
.factory('postDataFty',['$q', '$http', function($q, $http){
  return {
    postData:function(params,url){
      var defered = $q.defer();
      var req = {
        method:"POST",
        url:url,
        headers:{
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Content-Type':'application/x-www-form-urlencoded',
          'Accept': '*/*'

        },

        transformRequest:function(obj){
         var str=[];
         for(var p in obj){
          str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
        }
        return str.join("&");
      },
        data:params//params 必须是a=b&c=d的格式
      };

      $http(req).success(
        function(data){
          defered.resolve(data)
        }).error(function(error){
          defered.reject(error)
        })
        return defered.promise;
      }
    }
  }])

//调用相机和相册上传图片
.factory('uploadPicFty', ['$cordovaCamera', '$cordovaFileTransfer','$ionicActionSheet','$ionicPlatform','$q',
 function($cordovaCamera, $cordovaFileTransfer, $ionicActionSheet, $ionicPlatform, $q){
  var imgUrl = null, isNewPic = '', imgArr = [];
  return {
    activeSheet:function(unfold){
      var defered = $q.defer();
      if(unfold){
        var buttons = [];
        if (ionic.Platform.isAndroid()) {
          buttons = [
          {text: "<i class='ion-android-camera t_shopsDetails_tableIcon'></i>拍一张照片"},
          {text: "<i class='ion-android-image t_shopsDetails_tableIcon'></i>从相册选一张"}
          ]
        } else {
          buttons = [
          {text: "拍一张照片"},
          {text: "从相册选一张"}
          ]
        }
        var uploadPic = $ionicActionSheet.show({
          buttons: buttons,
          titleText: '请选择',
          cancelText: '取消',
          buttonClicked: function (index) {
            if (index == 0) {
              selectImages("camera");
              uploadPic();

            } else if (index == 1) {
              selectImages('');
              uploadPic();
            }
            // return imgBase;
          }
        })
      }

        //相机参数配置
        var selectImages = function (from) {
          var options = {//相机参数配制
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,//调用手机相机
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1200,
            targetHeight: 1200,
            correctOrientation: true,
            cameraDirection: 0
          };

          if (from == 'camera') {
            options.sourceType = Camera.PictureSourceType.CAMERA;//如果调用selectImages()方法from为camera，就打开相机
          }

          document.addEventListener("deviceready", function () {
            $cordovaCamera.getPicture(options).then(function (imageURI) {
            // var imgbase64 ="image/jpeg;base64,"+imageURI;
            imgUrl = "data:image/jpeg;base64," + imageURI;
            // if(imgUrl && isNewPic != imgUrl){//imgurl不为空并且imgurl的值为上一次不一样才加到数组里去

            // }
            // isNewPic = imgUrl;//把这次的imgUrl的值存起来，判断下次是不是上传了新的照片

            defered.resolve(imgUrl);
          }, function (error) {
            Message.show('选择失败,请重试.', 1000);
            defered.reject(error);
          });
          }, false);
        };
    return defered.promise;//把base64编码的图片送出去

  }
}
}])

//非阻塞弹窗优化
.factory('Message', function ($ionicLoading) {
  return {
    show: function () {
      $ionicLoading.hide();
      // if(arguments[0]){
      //  return false;
      // }
      var text = arguments[0] ? arguments[0] : 'Hi 请检查网络或者退出重试！';
      var duration = arguments[1] ? arguments[1] : 1200;
      var callback = arguments[2] ? arguments[2] : '';
      $ionicLoading.hide();
      if (typeof callback === "function") {
        $ionicLoading.show({
          noBackdrop: true,
          template: text,
          duration: duration
        }).then(function () {
          callback();
        });
      } else {
        $ionicLoading.show({
          noBackdrop: true,
          template: text,
          duration: duration
        });
      }
    },
    loading: function () {
      var text = arguments[0] ? arguments[0] : '';
      $ionicLoading.hide();
      $ionicLoading.show({
        hideOnStateChange: false,
        template: '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner><br/>' + text,
        duration: 10
      })
    },
    hidden: function () {
      $ionicLoading.hide();
    }
  };
})

//信息验证
.factory('verificationFty',function(){
  return{

      // 手机号验证
      phoneNumber:function(n){
        // 检查用户手机号是否符合
        if(!(/^1[34578]\d{9}$/.test(n))){
            return true;
          }else{
            return false;
        };
      },

      //密码验证
      password:function(n){
        if(!(/^[a-zA-Z0-9]{6,10}$/.test(n))){
              return true;
            }else{
              return false;
            };
          },

      // 邮箱验证
      email:function(n){
        if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(n))){
          return true;
        }else{
          return false;
        };
      },
       // 身分证验证
       identite:function(n){
        if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(n))){
          return true;
        }else{
          return false;
        }
      },

      //中文名验证
      chinese:function(str){
        if(!(/[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/.test(str))){
          return true;
        }else{
          return false;
        }
      }
    }

  })

// 把密码变成hash值
.factory('getHashFty',['$q',function($q){
  return {
    // var b64pad = "";
    getHash:function(d){
      var hexcase = 0; /*   hex   output   format.   0   -   lowercase;   1   -   uppercase                 */
      var chrsz = 8; /*   bits   per   input   character.   8   -   ASCII;   16   -   Unicode             */


      function start_sha1(s) {
        return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
      }
      return start_sha1(d);

      // start_sha1($scope.password);
      // console.log($scope.password);
      // alert()
      // $scope.test(start_sha1(b))

      /*
       *   Perform   a   simple   self-test   to   see   if   the   VM   is   working
       */
       function sha1_vm_test() {
        return start_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
      }

      /*
       *   Calculate   the   SHA-1   of   an   array   of   big-endian   words,   and   a   bit   length
       */
       function core_sha1(x, len) {
        /*   append   padding   */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;

        for (var i = 0; i < x.length; i += 16) {
          var olda = a;
          var oldb = b;
          var oldc = c;
          var oldd = d;
          var olde = e;

          for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
          }

          a = safe_add(a, olda);
          b = safe_add(b, oldb);
          c = safe_add(c, oldc);
          d = safe_add(d, oldd);
          e = safe_add(e, olde);
        }
        return Array(a, b, c, d, e);

      }

      /*
       *   Perform   the   appropriate   triplet   combination   function   for   the   current
       *   iteration
       */
       function sha1_ft(t, b, c, d) {
        if (t < 20) return (b & c) | ((~b) & d);
        if (t < 40) return b ^ c ^ d;
        if (t < 60) return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
      }

      /*
       *   Determine   the   appropriate   additive   constant   for   the   current   iteration
       */
       function sha1_kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
      }

      /*
       *   Calculate   the   HMAC-SHA1   of   a   key   and   some   data
       */
       function core_hmac_sha1(key, data) {
        var bkey = str2binb(key);
        if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

        var ipad = Array(16),
        opad = Array(16);
        for (var i = 0; i < 16; i++) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
        return core_sha1(opad.concat(hash), 512 + 160);
      }

      /*
       *   Add   integers,   wrapping   at   2^32.   This   uses   16-bit   operations   internally
       *   to   work   around   bugs   in   some   JS   interpreters.
       */
       function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
      }

      /*
       *   Bitwise   rotate   a   32-bit   number   to   the   left.
       */
       function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
      }

      function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
          bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
        return bin;
      }

      /*
       *   Convert   an   array   of   big-endian   words   to   a   string
       */
       function binb2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz)
          str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
        return str;
      }


      function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
          str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }
        return str;
      }

      /*
       *   Convert   an   array   of   big-endian   words   to   a   base-64   string
       */
       function binb2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
          var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
          for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
          }
        }
        return str;
      }
    }
  }
}])

//缓存
.factory('cacheFty',['$cacheFactory', function($cacheFactory){
  var cache = {};
  return {
    setCache: function(cacheid, key, value){
      var cacheData = $cacheFactory(cacheid,{number:5});
      cacheData.put(key,value);
      cache['id'] = cacheid;
      cache['cacheObj'] = cacheData;
      return cache;
    },

    getCache: function(key){
      if(cache['id']){
        var cacheData = $cacheFactory.get(cache['id']);
        var data = cacheData.get(key);
        return data;
      }else{
        return undefined;
      } 
    },

    remove:function(key){
      cache.cacheObj.removeAll();
    }
  }
}])

//sessionStorage
.factory('sessionFty', function(){
  return {
    set: function (key, data) {
      return window.sessionStorage.setItem(key, window.JSON.stringify(data));
    },

    get: function (key) {
      return window.JSON.parse(window.sessionStorage.getItem(key));
    },

    remove: function (key) {
      return window.sessionStorage.removeItem(key);
    }
  };
})

//获取当前用户上
.factory('getCurrentUserFty',function(Storage){
  return {
    getCurrentUser:function(){
      var currentUser = angular.fromJson(Storage.get('logined'));
      return currentUser;
    }
  }
})








