// pages/account/login.js

let app = getApp();
let page;

var util = require('../../utils/util.js');
var encrypt = require('../../utils/encrypt.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    password_show: false,
    password_clear_show: false,
    password_focus: false,
    disabled: true,
    error: '',
    show_forget_modal: false,
    hiddenLoading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
    console.log(11111);
    if (app.globalData.openId){
      page.checkLogin();
    }
    else {
      app.userOpenIdReadyCallback = res => {
        if (res.data.State == 1) {
          app.globalData.openId = res.data.Data.OpenId;

          page.checkLogin();
        }
      }
    }
  },

  // 账号输入
  phoneInput: function (e) {
    page.setData({
      phone: e.detail.value
    });
    page.btnValid();
  },

  // 密码输入
  passwordInput: function (e) {
    var password = e.detail.value;
    page.setData({
      password: password,
      password_clear_show: password.length > 0
    });
    page.btnValid();
  },

  // 清空密码
  passwordClear: function () {
    page.setData({
      password: '',
      password_clear_show: false
    });
    page.btnValid();
  },

  // 密码是否明文显示
  passwordShowToggle: function () {
    var password_show = page.data.password_show;
    page.setData({
      password_show: !password_show,
      password_focus: true
    });
  },

  // 登录按钮是否可点
  btnValid: function () {
    page.setData({
      disabled: (page.data.phone == '' || page.data.password == ''),
      error: '',
    });
  },

  // 登录
  doLogin: function () {
    
    var account = page.data.phone;
    var password = page.data.password;
    if (!util.isEmail(account) && !util.isPhone(account)) {
      page.setData({
        error: '登录账号错误'
      });
      return;
    }
    var accountEncrpty = encrypt.Encrypt(page.data.phone);
    var passwordEncrpty = encrypt.Encrypt(page.data.password);
    var openId = app.globalData.openId;
    var params = [];
    params[0] = ['method', 'checklogin'];
    params[1] = ['encodeUser', accountEncrpty];
    params[2] = ['encodePwd', passwordEncrpty];
    params[3] = ['openId', openId];
    var signX = encrypt.Sign(params); 

    console.log(accountEncrpty);
    console.log(passwordEncrpty);
    console.log(openId);
    
    wx.request({
      url: app.globalData.apiHost + 'Account/Index',
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        "appid": app.globalData.appId,
        "method": "checklogin",
        "encodeUser": (accountEncrpty),
        "encodePwd": (passwordEncrpty),
        "openId": openId,
        "sign": signX
      },
      success: function (res) {
        // console.log(res);
        console.log(res.data.Data.Sign);
        console.log(res.data.Data.AccessToken);

        if (res.data.State == 1) {
          // 将当前登录账号和秘密保存起来
          try {
            wx.setStorageSync(app.globalData.storageKey_user_account, account);
            wx.setStorageSync(app.globalData.storageKey_user_pwd, password);
            wx.setStorageSync(app.globalData.storageKey_user_sign, res.data.Data.Sign);
            wx.setStorageSync(app.globalData.storageKey_user_token, res.data.Data.AccessToken);

            var x = wx.getStorageSync(app.globalData.storageKey_user_sign);
            console.log("sign=====" + x);            
            
          } catch (e) {
          }
          app.globalData.userInfo = res.data.Data;
          wx.reLaunch({
            url: '/pages/enroll/signup'
          })
        }
      },
      fail: function () {

      }
    })

  },

  checkLogin:function(){
    if (app.globalData.userInfo) {
      page.setData({
        hiddenLoading: true
      })
    }
    else {
      page.autoLogin();
    }
  },

  // 自动登录
  autoLogin: function () {
    // 判断是否缓存了登录账号和密码
    try {
      var account = wx.getStorageSync(app.globalData.storageKey_user_account);
      var password = wx.getStorageSync(app.globalData.storageKey_user_pwd);
      if (util.trim(account) != '' && util.trim(password) != '') {
        var accountEncrpty = encrypt.Encrypt(account);
        var passwordEncrpty = encrypt.Encrypt(password);
        var openIdEncrpty = encrypt.Encrypt(app.globalData.openId);
        var params = [];
        params[0] = ['method', 'checklogin'];
        params[1] = ['encodeUser', accountEncrpty];
        params[2] = ['encodePwd', passwordEncrpty];
        params[3] = ['openId', openIdEncrpty];
        var signX = encrypt.Sign(params);
        wx.request({
          url: app.globalData.apiHost + 'Account/Index',
          method: "POST",
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            "appid": app.globalData.appId,
            "method": "checklogin",
            "encodeUser": (accountEncrpty),
            "encodePwd": (passwordEncrpty),
            "openId": openIdEncrpty,
            "sign": signX
          },
          success: function (res) {
            // console.log(res);
            if (res.data.State == 1 && res.data.Data!=null){
              app.globalData.userInfo = res.data.Data;
              // console.log(app.globalData.userInfo);
              wx.reLaunch({
                url: '/pages/enroll/signup'
              })
            }
          },
          complete: function () {
            page.setData({
              hiddenLoading: true
            })
          }
        })
      }
      else{
        page.setData({
          hiddenLoading: true
        })
      }
    } catch (e) {
      console.log(e);
      page.setData({
        hiddenLoading: true
      })
    }
  },

  // 忘记密码
  forgetPassword: function () {
    this.setData({
      show_forget_modal: true
    });
  },

  // 关闭忘记密码
  closeForget: function () {
    this.setData({
      show_forget_modal: false
    });
  },

  // 跳转到注册页面
  toRegister: function () {
    wx.navigateTo({
      url: '/pages/account/register',
    })
  }
})