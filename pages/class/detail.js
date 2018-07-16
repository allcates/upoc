// pages/class/detail.js

let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currClass:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];

    page.setData({
      currClass: prevPage.data.selectedClass
    });
  },

  /**
   * 去下单
   */
  toOrder: function () {
    wx.navigateTo({
      // url: '/pages/test/test?url=' + encodeURIComponent('https://testh5bm.staff.xdf.cn/1/html/order.html?schoolId=1&StudentCode=BJ1675051&classCodes=PHD6M06&appId=bmApp'),
      url: '/pages/test/test?url=' + encodeURIComponent(app.globalData.order_url + '?schoolId=1&StudentCode=BJ1675051&classCodes=' + (page.data.currClass.ClassCode) + '&appId=' + encrypt.WebPayAppId),
    })
  }
})