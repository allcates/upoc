// pages/account/register.js
let app = getApp();
let page;

var util = require('../../utils/util.js');
var encrypt = require('../../utils/encrypt.js');

var apiUrl = app.globalData.apiHost + 'Account/Index';
var appid = app.globalData.appId ;

// 计时器 
var timer; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    password_show: false,
    password_clear_show: false,
    password_focus:false,
    validcode_focus:false,
    validcode: '',
    validcode_disabled: true,
    disabled: true,
    count: 0,
    error: '',
    tips: '',
    show_modal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

  },

  // 账号输入
  phoneInput: function (e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone,
      validcode_disabled: !util.isPhone(phone)
    });
    this.btnValida();
  },

  // 验证码
  validcodeInput: function (e) {
    var validcode = e.detail.value;
    this.setData({
      validcode: validcode
    });
    this.btnValida();
  },

  // 密码输入
  passwordInput: function (e) {
    var password = e.detail.value;
    this.setData({
      password: password,
      password_clear_show: password.length > 0
    });
    this.btnValida();
  },

  // 清空密码
  passwordClear: function () {
    this.setData({
      password: '',
      password_clear_show: false
    });
    this.btnValida();
  },

  // 密码是否明文显示
  passwordShowToggle: function () {
    var password_show = this.data.password_show;
    this.setData({
      password_show: !password_show,
      password_focus: true
    });
  },

  // 登录按钮是否可点
  btnValida: function () {
    this.setData({
      disabled: (!util.isPhone(this.data.phone) || this.data.password == '' || this.data.validcode == ''),
      error: '',
    });
  },

  // 聚焦到验证码输入框
  toValidcodeInput: function () {
    page.setData({
      validcode_focus: true
    });
  },

  // 显示提示
  showPhoneTips: function () {
    page.setData({
      tips: '请输入正确的大陆手机号码',
      error: ''
    });
  },
  showValidCodeTips: function () {
    page.setData({
      tips: '请输入5位验证码',
      error: ''
    });
  },

  // 聚焦到密码输入框
  toPsdInput: function () {
    page.setData({
      password_focus: true,
      error: ''
    });
  },

  // 显示提示
  showPsdTips: function () {
    page.setData({
      tips: '请输入6--16位密码'
    });
  },

  // 发送验证码 
  sendValidCode: function () {
    var params = [];
    params[0] = ['method', 'SendSmsCode'];
    params[1] = ['mobile', page.data.phone];
    // console.log(params);
    var signX = encrypt.Sign(params);

    // 向服务器发送请求获取验证码
    wx.request({
      url: apiUrl,
      data: {
        appid: appid,
        method: "SendSmsCode",
        mobile: page.data.phone,
        sign: signX
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '验证码已发送到您的手机',
            icon: 'none'
          });
        }
        else{
          page.setData({
            error: res.Error
          });
        }
      },
      fail:function(res){
        page.setData({
          error: '验证码发送失败'
        });
      }
    })
    
    //计时器
    timer = setInterval(this.countDown, 1000);
    this.setData({
      validcode_disabled: true,
      count:60
    });
  },
  // 倒计时
  countDown:function(){
    var currCount = this.data.count;
    if (currCount == 0){
      clearInterval(timer);
    }
    else{
      currCount--;
    }

    var validbtnDisabled = true;
    if (util.isPhone(this.data.phone) && currCount == 0) {
      validbtnDisabled = false;
    }

    this.setData({
      validcode_disabled: validbtnDisabled,
      count: currCount
    });
  },

  // 注册
  doRegister: function () {
    page.setData({
      error: ''
    });
    if (!util.isPhone(page.data.phone)){
      page.setData({
        error: '手机号码错误',
        phone_focus: false
      });
      return;
    }

    var validcode = page.data.validcode;
    if (validcode.length != 5) {
      page.setData({
        error: '手机验证码错误',
        validcode_focus: false
      });
      return;
    }
    var password = page.data.password;
    if (password.length < 6 || password.length >16) {
      page.setData({
        error: '密码应在6--16位之间',
        password_focus: false
      });
      return;
    }

    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '注册中',
    });
    var phoneEncrpty = encrypt.Encrypt(page.data.phone);
    var passwordEncrpty = encrypt.Encrypt(page.data.password);
    var smscode = page.data.validcode;

    var params = [];
    params[0] = ['method','Register'];
    params[1] = ['encodeUser',phoneEncrpty];
    params[2] = ['encodePwd',passwordEncrpty];
    params[3] = ['smsCode',smscode];

    var signX = encrypt.Sign(params);

    // 向服务器发送请求获取验证码
    wx.request({
      url: apiUrl,
      data: {
        appid: appid,
        method: "Register",
        encodeuser: phoneEncrpty,
        encodepwd: passwordEncrpty,
        smscode: smscode,
        sign: signX
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.State == 1 && res.data.Data != null) {
          app.globalData.userInfo = res.data.Data;
          page.setData({
            show_modal: true
          });
        }
        else {
          page.setData({
            error: res.data.Error
          })
        }  
      },
      complete: function () {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    })

  },

  // 去选课
  toSelectCourse:function(){
    wx.switchTab({
      url: '/pages/enroll/signup'
    })
  }

})