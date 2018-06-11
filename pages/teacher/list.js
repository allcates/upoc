// pages/teacher/list.js

let app = getApp();
let page;

let grades = require('../../utils/grades.js');
let subjects = require('../../utils/subjects.js');

var util = require('../../utils/util.js');
var encrypt = require('../../utils/encrypt.js');

var pageSize = 60;

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
    scrollview_height: "100vh",
    beforeLoaded: true, 
    selectedGrade: '全部',
    selectedCourse: '全部',
    page: 1,
    hasMore: true,
    toView:''
  },

  onLoad: function () {
    page = this;
    page.getData();

    // 年纪|科目 数组各插入一个[全部]
    var gradeList = page.data.gradeList || [];
    var subjectList = page.data.subjectList || [];
    gradeList.unshift({ "id": "0", "name": "全部", "selected": true });
    subjectList.unshift({ "id": "0", "name": "全部", "selected": true });
    page.setData({
      gradeList: gradeList,
      subjectList: subjectList
    });

    // 设置滚动高度
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          scrollview_height: (res.windowHeight * 1 - res.statusBarHeight * 1 - 30) + "px"
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
  clickGrade: function (e) {
    var grade = e.currentTarget.dataset.item;
    var grades = page.data.gradeList;
    var selectedGrade = '全部';
    for (var i = 0; i < grades.length; i++) {
      if (grades[i].id == grade.id) {
        grades[i].selected = true;
        selectedGrade = grade.name;
      }
      else {
        grades[i].selected = false;
      }
    }
    page.setData({
      gradeList: grades,
      gradeModal: false,
      selectedGrade: selectedGrade,
      page: 1,
      hasMore: true
    });
    page.getData();
  },

  // 选择科目
  clickSubject: function (e) {
    var subject = e.currentTarget.dataset.item;
    var subjects = page.data.subjectList;
    var selectedCourse = '全部';
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id == subject.id) {
        subjects[i].selected = true;
        selectedCourse = subjects[i].name;
      }
      else {
        subjects[i].selected = false;
      }
    }
    page.setData({
      subjectList: subjects,
      subjectModal: false,
      selectedCourse: selectedCourse,
      page:1,
      hasMore:true
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

  // 加载更多
  loadMore: function () {
    if (this.data.hasMore) {
      var page = this.data.page * 1 + 1;
      this.setData({
        page: page
      });
      this.getData();
    }
  },

  /*
  * 获取所有教师列表数据
  */
  getData: function () {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    });

    var keywordsEncrpty = encrypt.Encrypt('');
    var gradeEncrpty = encrypt.Encrypt(page.data.selectedGrade);
    var courseEncrpty = encrypt.Encrypt(page.data.selectedCourse);
    var pageEncrpty = encrypt.Encrypt(page.data.page);
    var pageSizeEncrpty = encrypt.Encrypt(pageSize);
    var params = [];
    params[0] = ['method', 'getTeacherList'];
    params[1] = ['keywords', keywordsEncrpty];
    params[2] = ['grade', gradeEncrpty];
    params[3] = ['course', courseEncrpty];
    params[4] = ['page', pageEncrpty];
    params[5] = ['pagesize', pageSizeEncrpty];
    var signX = encrypt.Sign(params);
    wx.request({
      url: app.globalData.apiHost + 'upoc/index',
      data: {
        "appid": app.globalData.appId,
        "method": "getTeacherList",
        "keywords": keywordsEncrpty,
        "grade": gradeEncrpty,
        "course": courseEncrpty,
        "page": pageEncrpty,
        "pagesize": pageSizeEncrpty,
        "sign": signX
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.State == 1) {
          var dataCount = res.data.DataCount;
          if (dataCount < pageSize) {
            page.setData({
              hasMore: false
            });
          }
          var teacherList = [];
          if(page.data.page > 1){
            teacherList = page.data.teacherList;
          }
          var pageList = res.data.Data;
          var lastLetter = '';
          for (var x1 = 0; x1 < teacherList.length; x1++) {
            for (var x2 = 0; x2 < pageList.length; x2++) {
              if (teacherList[x1].Letter == pageList[x2].Letter) {
                lastLetter = teacherList[x1].Letter;
                teacherList[x1].TeacherList.push.apply(teacherList[x1].TeacherList, pageList[x2].TeacherList);
                break;
              }
            }
          }
          for (var x2 = 0; x2 < pageList.length; x2++) {
            if (pageList[x2].Letter != lastLetter) {
              teacherList.push(pageList[x2]);
            }
          }
          page.setData({
            teacherList: teacherList,
          });

          if(page.data.page==1){
            page.setData({
              toView:'index0'
            });
          }
        }
      },
      complete: function () {
        page.setData({
          beforeLoaded: false
        })
      }
    })
  },
})