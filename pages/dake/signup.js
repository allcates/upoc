// pages/dake/signup.js
var util = require('../../utils/util.js');
var encrypt = require('../../utils/encrypt.js');

let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    currClickItem: {},
    quarter: 1,
    grade: '',
    areacodes: '',
    cartNum: 0,
    beforeLoaded: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var quarter = prevPage.data.quarter.id;
    var grade = prevPage.data.grade.name;
    var schools = prevPage.data.schools;
    var areacodes = '';
    for (var i = 0; i < schools.length; i++) {
      // console.log(schools[i]['Code']);
      areacodes += schools[i]['Code'] + ",";
    }
    page.setData({
      quarter: quarter,
      grade: grade,
      areacodes: areacodes
    });
    page.getData(quarter, grade, areacodes);
  },

  onShow:function(){
    // 获取已选择的班级编号
    var selectedClassList = [];
    wx.getStorage({
      key: app.globalData.storageKey_dake_classlist,
      success: function (res) {
        selectedClassList = res.data;
        page.setData({
          cartNum: selectedClassList.length
        });
      }
    })
  },

  /*
  * 获取所有教师列表数据
  */
  getData: function (quarter, grade, areacodes) {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    });


    var quarterEncrpty = encrypt.Encrypt(quarter);
    var gradeEncrpty = encrypt.Encrypt(grade);
    var areacodesEncrpty = encrypt.Encrypt(areacodes);
    var params = [];
    params[0] = ['method', 'getCollocationData'];
    params[1] = ['quarter', quarterEncrpty];
    params[2] = ['grade', gradeEncrpty];
    params[3] = ['areacodes', areacodesEncrpty];
    var signX = encrypt.Sign(params);
    wx.request({
      url: app.globalData.apiHost + 'upoc/index',
      data: {
        "appid": app.globalData.appId,
        "method": "getCollocationData",
        "quarter": quarterEncrpty,
        "grade": gradeEncrpty,
        "areacodes": areacodesEncrpty,
        "sign": signX
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.State == 1) {
          // console.log(res.data.Data);
          page.setData({
            dataList: res.data.Data,
          });
        }
      },
      complete:function () {
        page.setData({
          beforeLoaded: false
        })
      }
    })
  },

  showToggle: function (e) {
    var item = e.currentTarget.dataset.item;
    var dataList = page.data.dataList;
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].periodId == item.periodId) {
        dataList[i].show = !dataList[i].show;
        break;
      }
    }
    page.setData({
      dataList: dataList
    });
  },

  // 点击
  clickItem: function (e) {
    var item = e.currentTarget.dataset.item;
    var period = e.currentTarget.dataset.period;
    page.setData({
      currClickItem: item
    });
    wx.navigateTo({
      url: '/pages/dake/classList?period=' + period,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 加入选课单
  addToList:function(e){
    var selectedClassList = [];
    var selectedClassListAll = [];
    try {
     selectedClassList = wx.getStorageSync(app.globalData.storageKey_dake_classlist);
    } catch (e) {
    }
    try {
      selectedClassListAll = wx.getStorageSync(app.globalData.storageKey_dake_classlist_all);
      if (selectedClassListAll==''){
        selectedClassListAll = [];
      }
    } catch (e) {
      selectedClassListAll = [];
    }
    for (var x1 = 0; x1 < selectedClassList.length;x1++){
      var yetHas = false;
      for (var x2 = 0; x2 < selectedClassListAll.length; x2++) {
        if (selectedClassList[x1].ClassCode == selectedClassListAll[x2].ClassCode){
          yetHas = true;
          break;
        }
      }
      if (!yetHas){
        selectedClassListAll.push(selectedClassList[x1]);
      }
    }
    
    wx.setStorage({
      key: app.globalData.storageKey_dake_classlist_all,
      data: selectedClassListAll,
      success:function(){
        try {
          wx.removeStorageSync(app.globalData.storageKey_dake_classlist)
        } catch (e) {
        }

        var dataList = page.data.dataList;
        // console.log(dataList);
        for (var i = 0; i < dataList.length; i++) {
          for (var j = 0; j < dataList[i].morning.length; j++) {
            dataList[i].morning[j].selected = false;
          }
          for (var j = 0; j < dataList[i].noon.length; j++) {
            dataList[i].noon[j].selected = false;
          }

          for (var j = 0; j < dataList[i].afternoon.length; j++) {
            dataList[i].afternoon[j].selected = false;
          }

          for (var j = 0; j < dataList[i].night.length; j++) {
            dataList[i].night[j].selected = false;
          }
        }

        page.setData({
          dataList: dataList,
          cartNum: 0
        });

        wx.showModal({
          title: '提示',
          content: '您已已成功添加到选课单',
          confirmText:'立即查看',
          cancelText:'继续报名',
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/enroll/selectCourse',
              })
            } else if (res.cancel) {
              wx.switchTab({
                url: '/pages/enroll/signup',
              })
            }
          }
        })
        // wx.showToast({
        //   title: '已成功添加到选课单',
        //   icon: 'none'
        // });
      }
    });

  }
})