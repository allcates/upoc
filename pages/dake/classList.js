// pages/dake/classList.js

var util = require('../../utils/util.js');
var encrypt = require('../../utils/encrypt.js');

let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    title: '',
    classList: [],
    selectedClassList: [],
    pid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

    // 获取已选择的班级编号
    wx.getStorage({
      key: app.globalData.storageKey_dake_classlist,
      success: function (res) {
        page.setData({
          selectedClassList: res.data
        })
      }
    })

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var quarter = prevPage.data.quarter;
    var grade = prevPage.data.grade;
    var areacodes = prevPage.data.areacodes;
    var selectedItem = prevPage.data.currClickItem;
    var condition = options.period + '、';
    var pid = '';
    if (selectedItem != null) {
      // console.log(selectedItem.id);
      pid = selectedItem.id;
      var time = selectedItem.id.split('_')[1] * 1;
      if (time == 1) {
        condition += '上午9:30-11:30、';
      }
      else if (time == 2) {
        condition += '中午12:30-13:30、';
      }
      else if (time == 3) {
        condition += '下午15:30-17:30、';
      }
      else if (time == 4) {
        condition += '晚上18:30-20:30、';
      }
      condition += selectedItem.fullName;

      page.getClassList(selectedItem.ClassCodes, quarter, grade, areacodes);
    }
    page.setData({
      title: condition,
      pid: pid
    });
  },

  /*
  * 获取所有班级列表数据
  */
  getClassList: function (classCodes, quarter, grade, areacodes) {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    });

    var params = [];
    params[0] = ['method', 'getClassListByCodes'];
    params[1] = ['classCodes', classCodes];
    params[2] = ['quarter', quarter];
    params[3] = ['grade', grade];
    params[4] = ['areacodes', areacodes];
    var signX = encrypt.Sign(params);
    wx.request({
      url: app.globalData.apiHost + 'upoc/index',
      data: {
        "appid": app.globalData.appId,
        "method": "getClassListByCodes",
        "classCodes": classCodes,
        "quarter": quarter,
        "grade": grade,
        "areacodes": areacodes,
        "sign": signX
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.State == 1) {
          var classList = res.data.Data;
          if (classList.length > 0) {
            var selectedClassList = page.data.selectedClassList;
            for (var x1 = 0; x1 < selectedClassList.length; x1++) {
              for (var x2 = 0; x2 < classList.length; x2++) {
                if (classList[x2].ClassCode == selectedClassList[x1].ClassCode) {
                  classList[x2].selected = true;
                  break;
                }
              }
            }

            var pid = page.data.pid;
            for (var x2 = 0; x2 < classList.length; x2++) {
              if (typeof (classList[x2].pid) == 'undefined' ) {
                classList[x2].pid = pid;
              }
            }
          }
          page.setData({
            classList: classList,
          });
        }
      }
    })
  },

  // 点击
  clickItem: function (e) {
    var code = e.currentTarget.dataset.code;
    var selectedClassList = page.data.selectedClassList;

    // 判断同一时段只能选择单科目下的一个班级
    var pid = page.data.pid;
    var existInTime = false;
    if (pid.split('_').length == 3){
      for (var x1 = 0; x1 < selectedClassList.length; x1++) {
        var item_pid = selectedClassList[x1].pid;
        if (typeof (item_pid) != 'undefined' && item_pid.split('_').length == 3){
          if (pid != item_pid && (pid.split('_')[0] == item_pid.split('_')[0]) && (pid.split('_')[1] == item_pid.split('_')[1])){
            existInTime = true;
            break;          
          }
        }
      }
    }
    if (existInTime){
      wx.showModal({
        title: '提示',
        content: '同一时段只能选择单科目下的一个班级，确定要更换班级?',
        success: function (res) {
          if (res.confirm) {
            for (var x1 = selectedClassList.length - 1; x1 >=0 ; x1--) {
              var item_pid = selectedClassList[x1].pid;
              if (typeof (item_pid) != 'undefined' && item_pid.split('_').length == 3) {
                if (pid != item_pid && (pid.split('_')[0] == item_pid.split('_')[0]) && (pid.split('_')[1] == item_pid.split('_')[1])) {
                  selectedClassList.splice(x1, 1);
                }
              }
            }

            page.selectClass(code, selectedClassList);
          }
        }
      })
    }
    else{
      page.selectClass(code, selectedClassList);
    }
  },

  // 选择班级
  selectClass: function (code, selectedClassList) {
    var classList = page.data.classList;

    // console.log(selectedClassList);
    for (var i = 0; i < classList.length; i++) {
      if (classList[i].ClassCode == code) {
        // 如果选课单中存在，先删除，再插入
        for (var x1 = 0; x1 < selectedClassList.length; x1++) {
          if (selectedClassList[x1].ClassCode == code) {
            selectedClassList.splice(x1, 1);
            break;
          }
        }

        if (!classList[i].selected) {
          selectedClassList.push(classList[i]);
        }
        classList[i].selected = !classList[i].selected;
      }
      else {
        if (classList[i].selected) {
          classList[i].selected = false;
          // 如果选课单中存在，先删除
          for (var x1 = 0; x1 < selectedClassList.length; x1++) {
            if (selectedClassList[x1].ClassCode == classList[i].ClassCode) {
              selectedClassList.splice(x1, 1);
              break;
            }
          }
        }
      }
    }
    // console.log(selectedClassList);

    // 存储
    wx.setStorage({
      key: app.globalData.storageKey_dake_classlist,
      data: selectedClassList
    })

    page.setData({
      classList: classList,
      selectedClassList: selectedClassList
    });

    var itemSelected = false;
    var selectedCodes = [];
    for (var i = 0; i < classList.length; i++) {
      if (classList[i].selected) {
        itemSelected = true;
        selectedCodes.push(classList[i].ClassCode);
      }
    }

    wx.navigateBack({
      delta: 1
    })
  },

  // 跳到班级详情页
  toClassDetail: function (e) {
    var classinfo = e.currentTarget.dataset.item;
    page.setData({
      selectedClass: classinfo
    });
    wx.navigateTo({
      url: '/pages/class/detail?classCode=' + classinfo.ClassCode,
    })
  }

})