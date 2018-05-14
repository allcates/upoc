// pages/dake/bySchool.js
let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolList: [],
    selectedSchoolList: [],
    selectedNum: 0,
    scrollview_height: "100%"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
    page.getData();

    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          scrollview_height: (res.windowHeight * 1 - res.statusBarHeight * 1 - 24) + "px"
        })
      }
    });
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
      url: app.globalData.apiHost + 'home/getschoollist',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.ErrorCode == 0) {
          // console.log(res.data.Data);
          page.setData({
            schoolList: res.data.Data,
          });
        }
      }
    })
  },

  // 点击
  clickItem: function (e) {
    var school = e.currentTarget.dataset.item;
    var schoolList = this.data.schoolList;
    for (var i = 0; i < schoolList.length; i++) {
      for (var j = 0; j < schoolList[i]['SchoolList'].length; j++) {
        if (schoolList[i]['SchoolList'][j].Id == school.Id) {
          schoolList[i]['SchoolList'][j].selected = !schoolList[i]['SchoolList'][j].selected;
        }
      }
    }
    var selectedSchoolList = [];
    for (var i = 0; i < schoolList.length; i++) {
      for (var j = 0; j < schoolList[i]['SchoolList'].length; j++) {
        if (schoolList[i]['SchoolList'][j].selected) {
          selectedSchoolList.push(schoolList[i]['SchoolList'][j]);
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