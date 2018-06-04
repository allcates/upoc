//app.js
var util = require('utils/util.js');
var encrypt = require('utils/encrypt.js');

App({
  onLaunch: function () {

    var app = this;

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res);
        if (res.code) {

          var code = res.code;
          var codeEncrpty = encrypt.Encrypt(code);
          var params = [];
          params[0] = ['method', 'getOpenId'];
          params[1] = ['code', codeEncrpty];
          var signX = encrypt.Sign(params);
          wx.request({
            url: app.globalData.apiHost + 'upoc/Index',
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              "appid": app.globalData.appId,
              "method": "getOpenId",
              "code": (codeEncrpty),
              "sign": signX
            },
            success: function (res) {
              if (res.data.State == 1) {
                // 此处服务器端根据openid获取当前用户信息(接口暂不支持)
                var openid = res.data.Data.OpenId;
                app.globalData.openId = openid;
                // app.autoLogin();
              }

              if (app.userOpenIdReadyCallback) {
                app.userOpenIdReadyCallback(res)
              }  
            }
          })
        }
      }
    })
  },

  globalData: {
    // 用户信息（在优播课后台的数据信息）
    userInfo: null,
    openId: '',
    apiHost: 'https://xytest.staff.xdf.cn/miniprogram/',
    appName: '优播课家长端',
    appId: '5001',
    storageKey_user_account: 'storageKey_user_account',
    storageKey_user_pwd: 'storageKey_user_pwd',
    dake_storageKey_classlist: 'dake_storageKey_classlist',
    dake_storageKey_classlist_all: 'dake_storageKey_classlist_all'
  }
})