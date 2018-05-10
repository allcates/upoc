// pages/teacher/detail.js

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

let app = getApp();
let page;

Page({
  data: {
    tabs: ["未开课", "开课中"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    ingList: [],
    willList: [],
    selectedClass: {}  // 当前选中要查看详情的班级信息
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
    console.log(e.currentTarget.id);
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

    wx.request({
      url: app.globalData.apiHost + 'home/getClassListByTeacher',
      data: {
        teacherCode: code
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.ErrorCode == 0) {
          console.log(res.data.Data);
          console.log(res.data.DataInfo);
          page.setData({
            ingList: res.data.Data,
            willList: res.data.DataInfo,
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
  }

});