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
    title :'',
    classList:[],
    selectedClassList:[]
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
    if(selectedItem!=null){
      // console.log(selectedItem.id);
      var time = selectedItem.id.split('_')[1]*1;
      if(time==1){
        condition+= '上午9:30-11:30、';
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
      title: condition
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

    var classCodesEncrpty = encrypt.Encrypt(classCodes);
    var quarterEncrpty = encrypt.Encrypt(quarter);
    var gradeEncrpty = encrypt.Encrypt(grade);
    var areacodesEncrpty = encrypt.Encrypt(areacodes);
    var params = [];
    params[0] = ['method', 'getClassListByCodes'];
    params[1] = ['classCodes', classCodesEncrpty];
    params[2] = ['quarter', quarterEncrpty];
    params[3] = ['grade', gradeEncrpty];
    params[4] = ['areacodes', areacodesEncrpty];
    var signX = encrypt.Sign(params);
    wx.request({
      url: app.globalData.apiHost + 'upoc/index',
      data: {
        "appid": app.globalData.appId,
        "method": "getClassListByCodes",
        "classCodes": classCodesEncrpty,
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
          var classList = res.data.Data;
          // console.log(classList);
          if(classList.length > 0){
            var selectedClassList = page.data.selectedClassList;
            for (var x1 = 0; x1 < selectedClassList.length;x1++){
              for (var x2 = 0; x2 < classList.length; x2++){
                if (classList[x2].ClassCode == selectedClassList[x1].ClassCode){
                  classList[x2].selected = true;
                  break;
                }
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
    var classList = page.data.classList;
    var selectedClassList = page.data.selectedClassList;
    for (var i = 0; i < classList.length; i++) {
      if (classList[i].ClassCode == code){
        // 如果选课单中去存在，先删除
        for (var x1 = 0; x1 < selectedClassList.length;x1++){
          if (selectedClassList[x1].ClassCode == code){
            selectedClassList.splice(x1, 1);
            break;
          }
        }
        selectedClassList = util.removeFromArray(selectedClassList, classList[i]);
        if (!classList[i].selected){
          selectedClassList.push(classList[i]);
        }
        classList[i].selected = !classList[i].selected;
        break;
      }
    }

    // 存储
    wx.setStorage({
      key: app.globalData.storageKey_dake_classlist,
      data: selectedClassList
    })

    page.setData({
      classList: classList,
      selectedClassList: selectedClassList
    });
    console.log(selectedClassList);

    var itemSelected = false;
    var selectedCodes = [];
    for (var i = 0; i < classList.length; i++) {
      if (classList[i].selected) {
        itemSelected = true;
        selectedCodes.push(classList[i].ClassCode);
      }
    }
    // console.log('itemSelected:' + itemSelected);
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var selectedItem = prevPage.data.currClickItem;
    var dataList = prevPage.data.dataList;
    // console.log(selectedItem);
    // console.log(dataList);
    if (selectedItem != null && dataList.length>0) {
      for (var i = 0; i < dataList.length;i++){
        // console.log(selectedItem.id);
        var time = selectedItem.id.split('_')[1] * 1;
        if (time == 1) {
          for (var j = 0; j < dataList[i].morning.length; j++){
            if (dataList[i].morning[j].id == selectedItem.id){
              dataList[i].morning[j].selected = itemSelected;
              break;
            }
          }
        }
        else if (time == 2) {
          for (var j = 0; j < dataList[i].noon.length; j++) {
            if (dataList[i].noon[j].id == selectedItem.id) {
              dataList[i].noon[j].selected = itemSelected;
              break;
            }
          }
        }
        else if (time == 3) {
          for (var j = 0; j < dataList[i].afternoon.length; j++) {
            if (dataList[i].afternoon[j].id == selectedItem.id) {
              dataList[i].afternoon[j].selected = itemSelected;
              break;
            }
          }
        }
        else if (time == 4) {
          for (var j = 0; j < dataList[i].night.length; j++) {
            if (dataList[i].night[j].id == selectedItem.id) {
              dataList[i].night[j].selected = itemSelected;
              break;
            }
          }
        }
      }
    }

    // console.log(dataList);
    prevPage.setData({
      dataList: dataList
    });
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