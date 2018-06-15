// pages/teacher/search.js

let app = getApp();
let page;

let storageKey = 'storagekey_search_tacher';

var util = require('../../utils/util.js');
var encrypt = require('../../utils/encrypt.js');

var pageSize = 60;

Page({
  data: {
    inputShowed: false,
    inputVal: '',
    teacherList:[],
    search_history:[],
    doSearch: false,
    scrollview_height: "100vh",
    page: 1,
    hasMore: true,
    toView:''
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
  getData: function () {
    var keywords = util.trim(page.data.inputVal) ;
    if(keywords.length==0){
      return;
    }

    try {
      var historyArr = wx.getStorageSync(storageKey)||[];
      for (var i = 0; i < historyArr.length; i++) {
        if (historyArr[i] == keywords) {
          historyArr.splice(i, 1);
          break;
        }
      }
      historyArr.push(keywords);
      // 保留最新10个
      if (historyArr.length>10){
        for (var i = 0; i < (historyArr.length-10); i++) {
          historyArr.splice(i, 1);
        }        
      }

      // 存储
      wx.setStorage({
        key: storageKey,
        data: historyArr
      })
    } catch (e) {
    }
    // var historyArr = page.data.search_history.reverse();


    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    });
    
    var grade = '';
    var course = '';
    var params = [];
    params[0] = ['method', 'getTeacherList'];
    params[1] = ['keywords', keywords];
    params[2] = ['grade', grade];
    params[3] = ['course', course];
    params[4] = ['page', page.data.page];
    params[5] = ['pagesize', pageSize];
    var signX = encrypt.Sign(params);
    wx.request({
      url: app.globalData.apiHost + 'upoc/index',
      data: {
        "appid": app.globalData.appId,
        "method": "getTeacherList",
        "keywords": keywords,
        "grade": grade,
        "course": course,
        "page": page.data.page,
        "pagesize": pageSize,
        "sign": signX
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.State == 1) {
          // console.log(res.data.Data);
          var letterList = res.data.Data;
          var teacherList = [];
          if (page.data.page > 1) {
            teacherList = page.data.teacherList;
          }
          for (var i = 0; i < letterList.length;i++){
            for (var j = 0; j < letterList[i].TeacherList.length;j++){
              teacherList.push(letterList[i].TeacherList[j]);
            }
          }
          var dataCount = res.data.DataCount;
          page.setData({
            teacherList: teacherList,
            doSearch: true,
            hasMore: (dataCount == pageSize),
            toView: (page.data.page == 1?'index0':'')
          }); 
        }
      },
      complete:function(){

        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    })
  },

  // 点击搜索
  clickHistoryItem:function(e){
    var keywords = e.currentTarget.dataset.item;
    page.setData({
      inputVal: keywords,
      inputShowed: true,
      page:1
    });
    page.getData();
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

  // 加载更多
  loadMore: function () {
    console.log(this.data.hasMore);
    if (this.data.hasMore) {
      var page = this.data.page * 1 + 1;
      this.setData({
        page: page
      });
      this.getData();
    }
  },
});