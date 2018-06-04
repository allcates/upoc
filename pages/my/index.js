// pages/my/index.js
//获取应用实例
let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
  },

  onShow: function () {

    console.log(app.globalData.userInfo);
    console.log(page.data.hasUserInfo);
    if (app.globalData.userInfo) {
      page.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log(page.data.hasUserInfo);
    } 
  },

  // 拨打客服电话
  callServicePhone: function(){
    wx.makePhoneCall({
      phoneNumber: '15210303288',
    })
  }
})