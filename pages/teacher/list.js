// pages/teacher/list.js

let grades = require('../../utils/grades.js');
let subjects = require('../../utils/subjects.js');

let app = getApp();
let page;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    teacherList: [],
    gradeModal: false,
    subjectModal: false,
    gradeList: grades,
    subjectList: subjects,
    scrollview_height: "100vh"
  },

  onLoad:function(){
    page = this;
    page.getData();

    // 设置滚动高度
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          scrollview_height: (res.windowHeight * 1 - res.statusBarHeight * 1 - 40) + "px"
        })
      }
    });
  },

  // 弹出或关闭年级modal
  filterGrade: function () {
    page.setData({
      gradeModal: !page.data.gradeModal,
      subjectModal: false
    });
  },

  // 弹出或关闭科目modal
  filterSubject: function () {
    page.setData({
      gradeModal: false,
      subjectModal: !page.data.subjectModal
    });
  },

  // 关闭遮罩和modal层
  hideModal: function () {
    page.setData({
      gradeModal: false,
      subjectModal: false
    });
  },

  // 选择年级
  clickGrade:function(e){
    var grade = e.currentTarget.dataset.item;
    var grades = page.data.gradeList;
    for(var i=0;i<grades.length;i++){
      if(grades[i].id==grade.id){
        grades[i].selected = true;
      }
      else{
        grades[i].selected = false;
      }
    }
    page.setData({
      gradeList: grades,
      gradeModal: false
    });
    page.getData();
  },

  // 选择科目
  clickSubject: function (e) {
    var subject = e.currentTarget.dataset.item;
    var subjects = page.data.subjectList;
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id == subject.id) {
        subjects[i].selected = true;
      }
      else {
        subjects[i].selected = false;
      }
    }
    page.setData({
      subjectList: subjects,
      subjectModal: false
    });
    page.getData();
  },

  // 跳转到教师详情页
  toTeacherDetail: function (e) {
    var tourl = '/pages/teacher/detail';
    var teacher = e.currentTarget.dataset.item;
    tourl = tourl + '?code=' + teacher.Code + '&name=' + teacher.Name;
    wx.navigateTo({
      url: tourl,
    })
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
      url: app.globalData.apiHost + 'home/getteacherlist',
      data: {
        keywords: '丽'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.ErrorCode == 0) {
          // console.log(res.data.Data);
          page.setData({
            teacherList: res.data.Data,
          });
        }
      }
    })
  },
})