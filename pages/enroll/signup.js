// pages/enroll/signup.js
let app = getApp();
let page;

// 是否显示tips，手动关闭时保存到storage，下次不再显示
let storageKey_signup_tips_show = 'storageKey_signup_tips_show';

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

    var showTips = true; 
    try {
      showTips = wx.getStorageSync(storageKey_signup_tips_show);
    } catch (e) {
    }
    page.setData({
      tips_show: showTips
    });
  },

  // 隐藏提示
  tipsHide: function(){
    wx.setStorage({
      key: storageKey_signup_tips_show,
      data: false,
      success: function () {
        page.setData({
          tips_show: false
        });
      }
    });
  }
})