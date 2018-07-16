// pages/pay/pay.js
let app = getApp();
let page;
// 计时器 
var timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    count: 0,
    showSuccess: false,
    showCancel: false,
    payParams: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
    var getOpenId = options.getOpenId;
    var orderId = options.orderId;
    if (getOpenId == 1) {
      wx.redirectTo({
        url: '/pages/pay/redirect?orderId=' + orderId,
      })
    }
    else {
      page.setData({
        orderId: options.orderId,
        payParams: options
      });

      page.requestPayment();
    }
    
  },

  //根据 obj 的参数请求wx 支付
  requestPayment: function () {

    var obj = page.data.payParams;
    //调起微信支付
    wx.requestPayment({
      //相关支付参数
      'timeStamp': obj.timeStamp + '',
      'nonceStr': obj.nonceStr,
      'package': decodeURIComponent(obj.package),
      'signType': obj.signType,
      'paySign': obj.paySign,
      //小程序微信支付成功的回调通知
      'success': function (res) {
        // console.log(res);
        // 启动定时器
        page.startCountdown(6);
      },
      //小程序支付失败的回调通知
      'fail': function (res) {
        console.log(res);
        var errMsg = res.errMsg;
        if (errMsg == 'requestPayment:fail cancel') {
          // wx.showToast({
          //   title: '支付已取消',
          //   icon: 'none'
          // });
          clearInterval(timer);
          page.setData({
            showCancel: true
          });
        }
      }
    })
  },

  // 跳到报名页面
  toSignup: function () {
    wx.switchTab({
      url: '/pages/enroll/signup',
    });
  },

  startCountdown: function (minutes) {
    //计时器
    timer = setInterval(page.countDown, 1000);
    page.setData({
      count: minutes,
      showSuccess: true
    });
  },

  // 倒计时
  countDown: function () {
    var currCount = page.data.count;
    if (currCount == 0) {
      clearInterval(timer);
    }
    else {
      currCount--;
    }

    page.setData({
      count: currCount
    });

    if (currCount == 0) {
      page.toSignup();
    }
  },

})