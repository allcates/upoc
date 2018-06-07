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
    orderId:'',
    count: 0,
    showSuccess:false,
    showCancel: false,
    payParams:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
console.log('哈哈哈哈哈哈哈');
console.log(options);
    var getOpenId = options.getOpenId;
    var orderId = options.orderId;
    if (getOpenId==1){
      wx.redirectTo({
        url: '/pages/pay/redirect?orderId=' + orderId,
      })
    }
    else {
      page.setData({
        payParams: options
      });

      page.requestPayment();

    }

    // console.log(options.timeStamp);
    // console.log(options.paySign);
    // //页面加载调取微信支付（原则上应该对options的携带的参数进行校验）
    // page.requestPayment(options);

    // wx.request({
    //   url: app.globalData.apiHost + 'test/getPayParameters?openId=' + app.globalData.openId,
    //   method: "POST",
    //   header: { 'content-type': 'application/x-www-form-urlencoded' },
    //   data: {
    //     "openId": app.globalData.openId
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     if (res.data.State == 1) {
    //       page.requestPayment(res.data.Data);
    //     }
    //   },
    //   fail: function () {

    //   }
    // })

    
    // page.startCountdown(3);
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
        console.log(res);
        // 启动定时器
        page.startCoundown(3);
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
          page.setData({
            showCancel:true
          });
        }
      }
    })
  },

  // 跳到报名页面
  toSignup:function(){
    wx.switchTab({
      url: '/pages/enroll/signup',
    });
  },

  startCountdown:function(minutes){
    //计时器
    timer = setInterval(page.countDown, 1000);
    page.setData({
      count: minutes,
      showSuccess:true
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

    if (currCount==0){
      page.toSignup();
    }
  },

})