// pages/teacher/search.js

let app = getApp();
let page;

let storageKey = 'storage_search_tacher';

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
    var keywords = page.data.inputVal;
    if(keywords.length==0){
      return;
    }

    var historyArr = page.data.search_history;
    for (var i = 0; i < historyArr.length; i++) {
      if (historyArr[i] == keywords){
        historyArr.remove(i);
        break;
      }
    }
    console.log(historyArr);
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

    wx.request({
      url: app.globalData.apiHost + 'home/getteacherlist',
      data: {
        keywords: keywords
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.ErrorCode == 0) {
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