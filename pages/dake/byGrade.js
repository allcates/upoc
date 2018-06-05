// pages/dake/byGrade.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    gradeList: [
      { "id": "1", "name": "初一", "usable": true, "selected": false },
      { "id": "2", "name": "初二", "usable": true, "selected": false },
      { "id": "3", "name": "中考", "usable": true, "selected": false },
      { "id": "4", "name": "高一", "usable": true, "selected": false },
      { "id": "5", "name": "高二", "usable": true, "selected": false },
      { "id": "6", "name": "高考", "usable": false, "selected": false },
      { "id": "7", "name": "专项", "usable": false, "selected": false },
      { "id": "8", "name": "英才", "usable": false, "selected": false },
    ]
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