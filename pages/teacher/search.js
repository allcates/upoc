// pages/teacher/search.js

let app = getApp();
let page;

let storageKey = 'storagekey_search_tacher';

var util = require('../../utils/util.js');
var encrypt = require('../../utils/encrypt.js');

Page({
  data: {
    inputShowed: false,
    inputVal: '',
    teacherList:[],
    search_history:[],
    doSearch: false,
    scrollview_height: "100vh"
  },

  onLoad:function(){
    page = this;

    // 设置滚动高度
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          scrollview_height: (res.windowHeight * 1 - res.statusBarHeight * 1 - 75) + "px"
        })
      }
    });

    // 获取搜索历史
    wx.getStorage({
      key: storageKey,
      success: function (res) {
        var history = res.data;
        page.setData({
          search_history: history.reverse()
        })
      }
    })

  },

  showInput: function () {
    page.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    page.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  clearInput: function () {
    page.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    page.setData({
      inputVal: e.detail.value
    });
  },

  // 清空搜索历史记录
  clearHistory:function(){
    wx.removeStorage({
      key: storageKey,
      success: function (res) {
        page.setData({
          search_history:[]
        })
      }
    })
  },

  /*
  * 搜索老师
  */
  doSearch: function () {
    var keywords = util.trim(page.data.inputVal) ;
    console.log(keywords);
    if(keywords.length==0){
      return;
    }

    var historyArr = page.data.search_history;
    for (var i = 0; i < historyArr.length; i++) {
      if (historyArr[i] == keywords){
        historyArr.slice(i,1);
        break;
      }
    }
    // console.log(historyArr);
    var historyStr = '';
    for (var i = 0; i < historyArr.length;i++){
      historyStr += historyArr + ';';
    }
    historyStr += keywords;

    // 存储
    wx.setStorage({
      key: storageKey,
      data: historyStr.split(';')
    })

    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    });

    var keywordsEncrpty = encrypt.Encrypt(keywords);
    var params = [];
    params[0] = ['method', 'getTeacherList'];
    params[1] = ['keywords', keywordsEncrpty];
    var signX = encrypt.Sign(params);
    wx.request({
      url: app.globalData.apiHost + 'upoc/index',
      data: {
        "appid": app.globalData.appId,
        "method": "getTeacherList",
        "keywords": keywordsEncrpty,
        "sign": signX
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.State == 1) {
          // console.log(res.data.Data);
          var letterList = res.data.Data;
          var teacherList = [];
          for (var i = 0; i < letterList.length;i++){
            for (var j = 0; j < letterList[i].TeacherList.length;j++){
              teacherList.push(letterList[i].TeacherList[j]);
            }
          }
          page.setData({
            teacherList: teacherList,
            doSearch: true
          });
        }
      }
    })
  },

  // 点击搜索
  clickHistoryItem:function(e){
    var keywords = e.currentTarget.dataset.item;
    page.setData({
      inputVal: keywords,
      inputShowed: true
    });
    page.doSearch();
  },

  // 跳转到教师详情页
  toTeacherDetail: function (e) {
    var tourl = '/pages/teacher/detail';
    var teacher = e.currentTarget.dataset.item;
    tourl = tourl + '?code='+teacher.Code+'&name=' + teacher.Name;
    wx.navigateTo({
      url: tourl,
    })
  },
});