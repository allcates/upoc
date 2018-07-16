// pages/pay/order.js

var encrypt = require('../../utils/encrypt.js');

let app = getApp();
let page;
//https://testh5bm.staff.xdf.cn/1/html/order.html?U2AT=911fd254-de7d-4468-bdb4-1ca12307d9aa&appId=upocAppletApp&t=20180604&systemSource=?&schoolId=1&studentCode=123&classCodes=PHD6M06,PHD5M06,PHD4M06,PHD3M06#/
// h5bm.xdf.cn


Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

    var paytype = options.paytype;
    var classCodes = options.classCodes;

    try {
      var sign = wx.getStorageSync(app.globalData.storageKey_user_sign) || '';
      var token = wx.getStorageSync(app.globalData.storageKey_user_token) || '';

      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var targetUrl = app.globalData.order_url + "?sign=" + sign
        + "&appId=" + encrypt.WebPayAppId
        + "&t=" + year + (month < 10 ? '0' + month : month) + (day < 10 ? '0' + day : day)
        + "&systemSource=upocmini"
        + "&accessToken=" + token
        + "&schoolId=1&classCodes=" + classCodes  // +"BJS6" //
        + "&studentCode=" + (app.globalData.userInfo ? app.globalData.userInfo.UserId : '');

      console.log(targetUrl);
      // console.log(encodeURIComponent(targetUrl));

      // 直接支付
      if (paytype == 1) {
        var url = app.globalData.u2login_url + "?method=AppWebV5&token=" + token
          + "&sign=" + sign
          + "&appId=" + encrypt.U2AppId
          + "&targetUrl=" + encodeURIComponent(targetUrl);

        page.setData({
          url: url
        });
      }
      else {
        wx.setClipboardData({
          data: targetUrl,
          success: function (res) {

            wx.showModal({
              title: '提示',
              content: '您已将支付地址复制到了粘贴版',
              confirmText: '找人代付',
              cancelText: '重新报名',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 100
                  })
                } else if (res.cancel) {
                  wx.switchTab({
                    url: '/pages/enroll/signup'
                  })
                }
              }
            });

          }
        })
      }

    }
    catch (e) {
      console.log(e);
    }

  }
})