// pages/pay/order.js


var encrypt = require('../../utils/encrypt.js');

let app = getApp();
let page;
//https://testh5bm.staff.xdf.cn/1/html/order.html?U2AT=911fd254-de7d-4468-bdb4-1ca12307d9aa&appId=upocAppletApp&t=20180604&systemSource=?&schoolId=1&studentCode=123&classCodes=PHD6M06,PHD5M06,PHD4M06,PHD3M06#/
// h5bm.xdf.cn
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    

    page = this;

    var classCodes = options.classCodes;
    // var url = 'https://testh5bm.staff.xdf.cn/1/html/order.html?appId=upocAppletApp&t=20180604&systemSource=upocMiniprogrom&schoolId=1';
    // if (app.globalData.userInfo != null) {
    //   url += '&U2AT=' + app.globalData.userInfo.AccessToken;
    //   url += '&studentCode=' + app.globalData.userInfo.UserId;
    // }
    // url += '&classCodes=' + classCodes;


    var sign = wx.getStorageSync(app.globalData.storageKey_user_sign);
    var token = wx.getStorageSync(app.globalData.storageKey_user_token);

    console.log(sign);
    console.log(token);
    console.log(encrypt.WebPayAppId);
    console.log(classCodes);
    console.log(app.globalData.userInfo.UserId);

    var targetUrl = "https://testh5bm.staff.xdf.cn/1/html/order.html?sign=" + sign
      + "&appId=" + encrypt.WebPayAppId 
      + "&t=" + Date.now()
      + "&systemSource=upocmini"
      + "&accessToken=" + token
      + "&schoolId=1&classCodes=" + "BJS6,BJS6"//classCodes
      + "&studentCode=" + app.globalData.userInfo.UserId;

    console.log(targetUrl);
    console.log(encodeURIComponent(targetUrl));

    var url = "https://testu2.staff.xdf.cn/apis/usersv2.ashx?method=AppWebV5&token=" + token 
          + "&sign=" + sign 
      + "&appId=" + encrypt.U2AppId 
      + "&targetUrl="+ encodeURIComponent(targetUrl);

    page.setData({
      url:url
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})