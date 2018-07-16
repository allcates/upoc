// pages/dake/byGrade.js

let grades = require('../../utils/grades.js');

Page({
  /**
   * 页面的初始数据
   */
  data: { 
    gradeList: grades
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var selectedId = options.gradeId;
    var grades = this.data.gradeList;
    for (var i = 0; i < grades.length; i++) {
      grades[i].selected = (grades[i].id == selectedId);
    }
    this.setData({
      gradeList: grades
    });
  },

  // 点击
  selectItem:function(e){
    var grade = e.currentTarget.dataset.item;
    var grades = this.data.gradeList;
    for (var i = 0; i < grades.length;i++){
      grades[i].selected = (grades[i].id == grade.id);
    }
    this.setData({
      gradeList: grades
    });

    var pages = getCurrentPages();
    var currPage = pages[pages.length -1];
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      grade: grade
    });

    wx.navigateBack({
      delta: 1
    });
  }
})