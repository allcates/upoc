// pages/dake/bySchool.js

let schools = require('../../utils/school.js');
var page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolList: schools,
    selectedSchoolList: [],
    selectedNum: 0,
    scrollview_height: "100%"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          scrollview_height: (res.windowHeight * 1 - res.statusBarHeight * 1 - 24) + "px"
        })
      }
    });
  },

  // 点击
  clickItem: function (e) {
    var school = e.currentTarget.dataset.item;
    var schoolList = this.data.schoolList;
    for (var i = 0; i < schoolList.length; i++) {
      for (var j = 0; j < schoolList[i]['item'].length; j++) {
        if (schoolList[i]['item'][j].id == school.id) {
          schoolList[i]['item'][j].selected = !schoolList[i]['item'][j].selected;
        }
      }
    }
    var selectedSchoolList = [];
    for (var i = 0; i < schoolList.length; i++) {
      for (var j = 0; j < schoolList[i]['item'].length; j++) {
        if (schoolList[i]['item'][j].selected) {
          selectedSchoolList.push(schoolList[i]['item'][j]);
        }
      }
    }

    this.setData({
      schoolList: schoolList,
      selectedSchoolList: selectedSchoolList,
      selectedNum: selectedSchoolList.length
    });

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      schools: selectedSchoolList
    });
  }
})