// pages/dake/signup.js
let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
    page.getData();

  },

  /*
  * 获取所有教师列表数据
  */
  getData: function () {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    });

    wx.request({
      url: app.globalData.apiHost + 'home/getCollocationData?schoolid=1&grade=初一&areacodes=京科苑,东四&quarter=2',
      data: {
        keywords: '丽'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.ErrorCode == 0) {
          // console.log(res.data.Data);
          page.setData({
            dataList: res.data.Data,
          });
        }
      }
    })
  },

  showToggle: function (e) {
    var item = e.currentTarget.dataset.item;
    var dataList = page.data.dataList;
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].periodId == item.periodId) {
        dataList[i].show = !dataList[i].show;
        break;
      }
    }
    page.setData({
      dataList: dataList
    });
  },

})