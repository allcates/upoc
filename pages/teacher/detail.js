// pages/teacher/detail.js

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

let app = getApp();
let page;

var util = require('../../utils/util.js');
var encrypt = require('../../utils/encrypt.js');

var selectedClassListInFavorite = [];// 我的选课单

Page({
  data: {
    tabs: ["未开课", "开课中"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    ingList: [],
    willList: [],
    selectedClass: {},  // 当前选中要查看详情的班级信息
  },

  onLoad: function (options) {
    page = this;

    var name = options.name;
    var code = options.code;
    wx.setNavigationBarTitle({
      title: name + '老师',
    });
    
    page.getData(code);

    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          sliderLeft: (res.windowWidth / page.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / page.data.tabs.length * page.data.activeIndex
        });
      }
    });
  },
  onShow: function () {

  },

  tabClick: function (e) {
    // console.log(e.currentTarget.id);
    page.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /*
  * 获取所有教师列表数据
  */
  getData: function (code) {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    });

    // 选课单
    try {
      selectedClassListInFavorite = wx.getStorageSync(app.globalData.dake_storageKey_classlist_all);
      if (selectedClassListInFavorite == '') {
        selectedClassListInFavorite = [];
      }
    } catch (e) {
      selectedClassListInFavorite = [];
    }

    var schoolIdEncrpty = encrypt.Encrypt(1);
    var codeEncrpty = encrypt.Encrypt(code);
    var params = [];
    params[0] = ['method', 'getClassListByTeacher'];
    params[1] = ['schoolId', schoolIdEncrpty];
    params[2] = ['teacherCode', codeEncrpty];
    var signX = encrypt.Sign(params); 

    wx.request({
      url: app.globalData.apiHost + 'upoc/index',
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        "appid": app.globalData.appId,
        "method": "getClassListByTeacher",
        "schoolId": (schoolIdEncrpty),
        "teacherCode": (codeEncrpty),
        "sign": signX
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.State == 1) {
          // console.log(res.data.Data);
          // console.log(res.data.DataInfo);

          var noList = res.data.Data.ingList;
          var willList = res.data.Data.willList;
          //判断是否已在选课单
          if (selectedClassListInFavorite.length > 0) {
            for (var x1 = 0; x1 < noList.length; x1++) {
              for (var x2 = 0; x2 < selectedClassListInFavorite.length; x2++) {
                if (noList[x1].ClassCode == selectedClassListInFavorite[x2].ClassCode) {
                  noList[x1].InFavorite = true;
                  break;
                }
              }
            }
            for (var x1 = 0; x1 < willList.length; x1++) {
              for (var x2 = 0; x2 < selectedClassListInFavorite.length; x2++) {
                if (willList[x1].ClassCode == selectedClassListInFavorite[x2].ClassCode) {
                  willList[x1].InFavorite = true;
                  break;
                }
              }
            }

          }
          page.setData({
            ingList: noList,
            willList: willList,
          });
        }
      }
    })
  },

  // 跳到班级详情页
  toClassDetail:function(e){
    var classinfo = e.currentTarget.dataset.item;
    page.setData({
      selectedClass: classinfo
    });
    wx.navigateTo({
      url: '/pages/class/detail?classCode=' + classinfo.ClassCode,
    })
  },

  // 加入选课单
  addToFavorite: function (e) {
    var classinfo = e.currentTarget.dataset.item;
    var inFavorite = false;
    for (var x1 = 0; x1 < selectedClassListInFavorite.length;x1++){
      if (selectedClassListInFavorite[x1].ClassCode == classinfo.ClassCode){
        inFavorite = true;
        wx.showToast({
          title: '此班级已在选课单中',
          icon: 'none'
        });
        break;
      }
    }
    if(!inFavorite){
      selectedClassListInFavorite.push(classinfo);
      wx.setStorage({
        key: app.globalData.dake_storageKey_classlist_all,
        data: selectedClassListInFavorite,
        success: function () {
          wx.showToast({
            title: '已成功添加到选课单',
            icon: 'none'
          });
        }
      });
    }

  }

});