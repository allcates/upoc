// pages/dake/byQuarter.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    quarterList: [
      // { "id": "1", "name": "春季", "usable": true, "selected": false },
      { "id": "2", "name": "暑假", "usable": true, "selected": false },
      // { "id": "3", "name": "秋季", "usable": true, "selected": false },
      // { "id": "4", "name": "寒假", "usable": false, "selected": false },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var selectedId = options.quarterId;
    var quarters = this.data.quarterList;
    for (var i = 0; i < quarters.length; i++) {
      quarters[i].selected = (quarters[i].id == selectedId);
    }
    this.setData({
      quarterList: quarters
    });
  },

  // 点击
  selectItem: function (e) {
    var quarter = e.currentTarget.dataset.item;
    var quarters = this.data.quarterList;
    for (var i = 0; i < quarters.length; i++) {
      quarters[i].selected = (quarters[i].id == quarter.id);
    }
    this.setData({
      quarterList: quarters
    });

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      quarter: quarter
    });
    wx.navigateBack({
      delta:1
    });
  }
})