// pages/dake/bySchool.js
let app = getApp();
let page;

var util = require('../../utils/util.js');
var encrypt = require('../../utils/encrypt.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolList: [],
    selectedSchoolList: [],
    selectedNum: 0,
    scrollview_height: "100%",
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    page.setData({
      selectedSchoolList: prevPage.data.schools
    });

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
    if (!app.globalData.isNetWork) {
      wx.showToast({
        title: '当前网络未连接',
        icon: 'none'
      });
      return;
    }
    
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    });

    var keywordsEncrpty = encrypt.Encrypt('丽');
    var params = [];
    params[0] = ['method', 'getSchoolList'];
    var signX = encrypt.Sign(params);
    wx.request({
      url: app.globalData.apiHost + 'upoc/index',
      data: {
        "appid": app.globalData.appId,
        "method": "getSchoolList",
        "sign": signX
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.State == 1) {
          var letterschools = res.data.Data;
          var selectedSchoolList = page.data.selectedSchoolList;
          // console.log(selectedSchoolList);
          if (selectedSchoolList.length > 0) {
            for (var i = 0; i < letterschools.length; i++) {
              for (var j = 0; j < letterschools[i]['SchoolList'].length; j++) {
                var id = letterschools[i]['SchoolList'][j].Id;
                for (var k = 0; k < selectedSchoolList.length; k++) {
                  if (selectedSchoolList[k].Id == id) {
                    letterschools[i]['SchoolList'][j].selected = true;
                    break;
                  }
                }
              }
            }
          }

          // console.log(letterschools);
          page.setData({
            schoolList: letterschools,
            loading: false,
            selectedNum: selectedSchoolList.length
          });
        }
      }
    })
  },

  // 点击
  clickItem: function (e) {
    var school = e.currentTarget.dataset.item;
    // 判断是否还可再选（最多可选5个校区）
    var selectedNum = page.data.selectedNum;
    if (selectedNum == 5 && !school.selected) {
      wx.showToast({
        title: '选择的校区数量不能超过5个哦～',
        icon: 'none'
      });
      return;
    }

    var schoolList = this.data.schoolList;
    var selectedSchoolList = [];
    var isBreak = false;
    for (var i = 0; i < schoolList.length; i++) {
      for (var j = 0; j < schoolList[i]['SchoolList'].length; j++) {
        if (schoolList[i]['SchoolList'][j].Id == school.Id) {
          schoolList[i]['SchoolList'][j].selected = !schoolList[i]['SchoolList'][j].selected;
        }
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