// pages/enroll/signup.js
let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips_show:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
    // console.log(app.globalData.userInfo);
  },

  // 隐藏提示
  tipsHide: function(){
    this.setData({
      tips_show :false
    });
  }
})