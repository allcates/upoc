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
      phoneNumber: '010-82611818',
    })
  },

  // 退出登录
  logout:function(){
    wx.showModal({
      title: '提示',
      content: '您确定要退出当前优播课登录吗?',
      success: function (res) {
        if (res.confirm) {
          try {
            app.globalData.userInfo = null;
            wx.setStorageSync(app.globalData.storageKey_user_account, '');
            wx.setStorageSync(app.globalData.storageKey_user_pwd, '');
            wx.setStorageSync(app.globalData.storageKey_user_sign, '');
            wx.setStorageSync(app.globalData.storageKey_user_token, '');
          } catch (e) {
          }
          page.setData({
            userInfo: null,
            hasUserInfo: false
          })
        }
      }
    })
  }
})