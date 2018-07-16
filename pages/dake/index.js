// pages/dake/index.js

let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    quarter: { "id": "2", "name": "暑假", "usable": true, "selected": false },
    grade: { "id": "1", "name": "初一" },
    schools: [],
    schoolNames: '',
    btn_enabled: false,
    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

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
    var schoolNames = '';
    var schools = this.data.schools;
    if (schools.length == 1) {
      schoolNames = schools[0].Name;
    }
    else if (schools.length > 1) {
      schoolNames = schools[0].Name + '等' + (schools.length) + '个';
    }
    page.setData({
      schoolNames: schoolNames,
      error:''
    });
    page.btnValid();
  },

  // 按钮是否可点
  btnValid: function () {
    page.setData({
      btn_enabled: (typeof (page.data.quarter.id) != 'undefined' && typeof (page.data.grade.id) != 'undefined' && page.data.schools.length > 0)
    });
  },

  // 确定
  doSubmit: function () {
    if (typeof (page.data.quarter.id) == 'undefined') {
      page.setData({
        error: '您还没有选择季度哦～'
      });
    }
    else if (typeof (page.data.grade.id) == 'undefined') {
      page.setData({
        error: '您还没有选择年纪哦～'
      });
    }
    else if (page.data.schools.length == 0) {
      page.setData({
        error: '您至少应该选择一个校区哦～'
      });
    }
    else {
      if (!app.globalData.isNetWork) {
        wx.showToast({
          title: '当前网络未连接',
          icon: 'none'
        });
        return;
      }

      // 先清空临时报名选中的班级，然后跳到报名页面重新选择
      try {
        wx.removeStorageSync(app.globalData.storageKey_dake_classlist)
      } catch (e) {
        // Do something when catch error
      }
      wx.navigateTo({
        url: '/pages/dake/signup',
      })

    }
  }
})