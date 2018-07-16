// pages/enroll/selectCourse.js
let app = getApp();
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [],
    total: 0,
    selectedAll: true,
    btn_disabled: false,
    tips_show: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

  },

  onShow: function (options) {
    page.getData();
  },

  // 加在选课单
  getData: function () {
    // 获取已选择的班级
    wx.getStorage({
      key: app.globalData.storageKey_dake_classlist_all,
      success: function (res) {
        var classList = res.data;
        var total = 0;
        for (var x1 = 0; x1 < classList.length; x1++) {
          classList[x1].selected = true;
          total += classList[x1].Fee * 1;
        }
        page.setData({
          classList: classList,
          total: total
        });
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },

  // 移除某个班级
  removeItem: function (e) {
    var removeItem = e.currentTarget.dataset.code;
    var classCode = removeItem.ClassCode;
    var className = removeItem.ClassName;
    wx.showModal({
      title: '删除提示',
      content: '您确定要删除' + className + '吗？',
      success: function (res) {
        if (res.confirm) {
          var classList = page.data.classList;
          for (var x1 = 0; x1 < classList.length; x1++) {
            if (classList[x1].ClassCode == classCode) {
              classList.splice(x1, 1);
              break;
            }
          }
          page.resetData(classList);
        }
      }
    })
  },

  // 点击
  clickItem: function (e) {
    var code = e.currentTarget.dataset.code;
    var classList = page.data.classList;
    for (var x1 = 0; x1 < classList.length; x1++) {
      if (classList[x1].ClassCode == code) {
        classList[x1].selected = !classList[x1].selected;
        break;
      }
    }
    page.resetData(classList);
  },

  // 全选或取消 
  selectAll: function () {
    var selectedAll = page.data.selectedAll;
    var classList = page.data.classList;
    for (var x1 = 0; x1 < classList.length; x1++) {
      classList[x1].selected = !selectedAll;
    }
    var total = 0;
    for (var x1 = 0; x1 < classList.length; x1++) {
      if (classList[x1].selected) {
        total += classList[x1].Fee * 1;
      }
    }
    page.setData({
      classList: classList,
      total: total,
      selectedAll: !selectedAll,
      btn_disabled: total == 0
    });
  },

  // 去支付
  toOrder: function (e) {
    // 支付类型
    var paytype = e.currentTarget.dataset.paytype;

    var classList = page.data.classList;
    var classCodes = '';
    for (var x1 = 0; x1 < classList.length; x1++) {
      if (classList[x1].selected) {
        classCodes += classList[x1].ClassCode + ',';
      }
    }
    if (classCodes.length > 0) {
      classCodes = classCodes.substr(0, classCodes.length - 1);
    }
    if (classCodes == '') {
      wx.showToast({
        title: '您要支付的选课单为空哦～',
        icon: 'none'
      });
    }
    else {

      if (!app.globalData.isNetWork) {
        wx.showToast({
          title: '当前网络未连接',
          icon: 'none'
        });
        return;
      }

      var sign = wx.getStorageSync(app.globalData.storageKey_user_sign) || '';
      var token = wx.getStorageSync(app.globalData.storageKey_user_token) || '';
      if ((paytype==1) && (sign == "" || token == '')) {
        wx.showModal({
          title: '提示',
          content: '请先登录再去选课单支付',
          confirmText: '去登录',
          cancelText: '我再想想',
          success: function (res) {
            if (res.confirm) {
              // wx.switchTab({
              //   url: '/pages/account/login',
              // })
              wx.navigateTo({
                url: '/pages/account/login',
              })
            } else if (res.cancel) {
              wx.switchTab({
                url: '/pages/enroll/selectCourse',
              })
            }
          }
        })
      }
      else {
        for (var x1 = classList.length - 1; x1 >= 0; x1--) {
          if (classList[x1].selected) {
            classList.splice(x1, 1);
          }
        }
        try {
          wx.setStorageSync(app.globalData.storageKey_dake_classlist_all, classList);
        }
        catch (e) {
        }

        wx.navigateTo({
          url: '/pages/pay/order?paytype=' + paytype+'&classCodes=' + classCodes,
        })
      }
    }
  },

  // 隐藏提示语
  tipsHide: function () {
    page.setData({
      tips_show: false
    });
  },

  // 重置
  resetData: function (classList) {
    var total = 0;
    var selectedAll = true;
    var selectedNone = true;
    for (var x1 = 0; x1 < classList.length; x1++) {
      if (classList[x1].selected) {
        total += classList[x1].Fee * 1;
        selectedNone = false;
      }
      else {
        selectedAll = false;
      }
    }

    try {
      wx.setStorageSync(app.globalData.storageKey_dake_classlist_all, classList);
    }
    catch (e) {
    }

    page.setData({
      classList: classList,
      total: total,
      selectedAll: selectedAll,
      btn_disabled: selectedNone
    });
  },

  // 去报名
  toSignup: function () {
    wx.switchTab({
      url: '/pages/enroll/signup'
    })
  }

})