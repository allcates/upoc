// pages/account/login.js
var util = require('../../utils/util.js');
var md5 = require('../../assets/js/cryptojs/md5.js');
var aes = require('../../utils/encrypt.js');

const app = getApp();
let page;

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
    show_forget_modal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

    var aa = md5.MD5('123');
    // var sign = (aes.Encrypt('1231').toLocaleLowerCase())
    console.log('aa:' + aa);
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
    console.log('y:' + aes.Encrypt('123'));
    var account = page.data.phone;
    var password = page.data.password;
    if (!util.isEmail(account) && !util.isPhone(account)) {
      page.setData({
        error: '登录账号错误'
      });
      return;
    }

    var sign = ('appid=5001&method=checklogin&encodeuser=' + (aes.Encrypt(account).toLocaleLowerCase()) + '&encodepwd=' + (aes.Encrypt(password).toLocaleLowerCase()) + '&openid=' + app.globalData.openId.toLocaleLowerCase() +'&appkey=v5appkey_test');
    console.log(sign);
    console.log('@:'+md5.MD5(sign)+'');
    wx.request({
      url: 'https://xytest.staff.xdf.cn/ApiMiniProgram/Account/Index',
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        "appid": "5001",
        "method": "checkLogin",
        "encodeUser": aes.Encrypt(account),
        "encodePwd": aes.Encrypt(password),
        "openId": app.globalData.openId,
        "sign": (md5.MD5(sign) + '').toUpperCase()
      },
      success: function (res) {
        console.log(res);
        if (res.data.State == 1) {
          wx.reLaunch({
            url: '/pages/enroll/signup'
          })

        }
        else{
          page.setData({
            error: res.data.Error
          });
        }
      },
      fail: function () {

      }
    })

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