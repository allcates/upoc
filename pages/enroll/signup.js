// pages/enroll/signup.js
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
  
  },

  // 隐藏提示
  tipsHide: function(){
    this.setData({
      tips_show :false
    });
  }
})