// pages/pay/pay.js
let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options.timeStamp);
    // console.log(options.paySign);
    // //页面加载调取微信支付（原则上应该对options的携带的参数进行校验）
    // that.requestPayment(options);

    wx.request({
      url: app.globalData.apiHost + 'test/getPayParameters?openId=' + app.globalData.openId,
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        "openId": app.globalData.openId
      },
      success: function (res) {
        console.log(res);
        if (res.data.State == 1) {
          that.requestPayment(res.data.Data);
        }
      },
      fail: function () {

      }
    })

  },

  //根据 obj 的参数请求wx 支付
  requestPayment: function (obj) {
    console.log(obj);
    //获取options的订单Id
    var orderId = '10001';//obj.orderId;
    //调起微信支付
    wx.requestPayment({
      //相关支付参数
      'timeStamp': obj.timeStamp + '',
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      //小程序微信支付成功的回调通知
      'success': function (res) {
        console.log(res);
      },
      //小程序支付失败的回调通知
      'fail': function (res) {
        console.log(res);
        var errMsg = res.errMsg;
        if (errMsg == 'requestPayment:fail cancel') {
          wx.showToast({
            title: '支付已取消',
            icon: 'none'
          });
        }
      }
    })
  }
})