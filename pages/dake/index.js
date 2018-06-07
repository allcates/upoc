// pages/dake/index.js

let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    quarter: {},
    grade: {},
    schools: [],
    schoolNames: '',
    btn_enabled: false,
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
      schoolNames: schoolNames
    });
    page.btnValid();
  },

  // 按钮是否可点
  btnValid: function () {
    page.setData({
      btn_enabled: (typeof (page.data.quarter.id) != 'undefined' && typeof (page.data.grade.id)!='undefined' && page.data.schools.length > 0)
    });
  },

  // 确定
  doSubmit: function () {
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
})