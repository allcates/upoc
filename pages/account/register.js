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
    validcode: '',
    validcode_disabled: true,
    disabled: true,
    count: 0,
    error: '',
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

  // 发送验证码 
  sendValidCode: function () {
    // var signString = ('appid=5001&method=SendSmsCode&mobile=' + page.data.phone + '&appkey=v5appkey_test').toLowerCase();
    // var signX = (md5.MD5(signString) + '').toUpperCase();

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
      complete: function (res) {
        console.log(res.data);
        page.setData({
          //res.data.data
        });
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }
      },
      success: function (res) {
        if (res.data.code == 0) {
          resolve(res)
        }
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
    this.setData({
      error: ''
    });
    if (!util.isPhone(page.data.phone)){
      this.setData({
        error:'手机号码错误'
      });
    }

    var phoneEncrpty = encrypt.Encrypt(page.data.phone);
    var passwordEncrpty = encrypt.Encrypt(page.data.password);
    var smscode = page.data.smscode;

    // var signString = ('appid=5001&method=Register&encodeUser=' + phoneEncrpty + '&encodePwd=' + passwordEncrpty +'&smsCode=' + smscode + '&appkey=v5appkey_test').toLowerCase();
    // var signX = (md5.MD5(signString) + '').toUpperCase();

    // console.log(signString);
    // console.log(signX);

    // console.log(phoneEncrpty);
    // console.log(passwordEncrpty);

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
      complete: function (res) {
        // console.log(res.data);

        // if (res == null || res.data == null) {
        //   reject(new Error('网络请求失败'))
        // }

        if(res.data.State == 0 && res.data.Data !=null){
          app.globalData.userInfo = res.data.Data;
          page.setData({
            show_modal: result
          });
        }
        else{
          page.setData({
            error: res.data.Error
          })
        }       
      },
      success: function (res) {

        page.setData({
          error: res
        })
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