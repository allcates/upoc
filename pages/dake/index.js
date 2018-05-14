// pages/dake/index.js
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    quarter: {},
    grade: {},
    schools: [],
    schoolNames:'',
    btn_disabled: true,
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
    if (schools.length == 1){
      schoolNames = schools[0].Name;
    }
    else if (schools.length > 1) {
      schoolNames = schools[0].Name + '等' + (schools.length )+'个';
    }
    page.setData({
      schoolNames: schoolNames
    });
    page.btnValid();
  },

  // 按钮是否可点
  btnValid: function () {
    page.setData({
      btn_disabled: (!page.data.quarter.id && !page.data.grade && page.data.schools.length==0)
    });
  },

  // 确定报名
  doSubmit:function(){
    wx.navigateTo({
      url: '/pages/dake/signup',
    })
  }
})