// pages/dake/signup.js
let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        "title": "第零期",
        "date": "7月3日--7月11日",
        "morning": { "label": "上午", "begin": "09:30", "end": "11:30", data: ["语", "数", "英"] },
        "noon": { "label": "中午", "begin": "12:30", "end": "14:30", data: ["语", "物", "英"] },
        "afternoon": { "label": "下午", "begin": "15:30", "end": "17:30", data: ["化"] },
        "night": { "label": "晚上", "begin": "18:30", "end": "20:30", data: ["生", "数", "英"] },
        "show": true
      },
      {
        "title": "第一期",
        "date": "7月11日--7月21日",
        "morning": { "label": "上午", "begin": "09:30", "end": "11:30", data: ["语", "数", "英"] },
        "noon": { "label": "中午", "begin": "12:30", "end": "14:30", data: ["语", "物", "英"] },
        "afternoon": { "label": "下午", "begin": "15:30", "end": "17:30", data: ["化"] },
        "night": { "label": "晚上", "begin": "18:30", "end": "20:30", data: ["生", "数", "英"] },
        "show": true
      },
      {
        "title": "第二期",
        "date": "8月3日--8月11日",
        "morning": { "label": "上午", "begin": "09:30", "end": "11:30", data: ["语", "数", "英"] },
        "noon": { "label": "中午", "begin": "12:30", "end": "14:30", data: ["语", "物", "英"] },
        "afternoon": { "label": "下午", "begin": "15:30", "end": "17:30", data: ["化"] },
        "night": { "label": "晚上", "begin": "18:30", "end": "20:30", data: ["生", "数", "英"] },
        "show": true
      },
      {
        "title": "第三期",
        "date": "9月13日--9月11日",
        "morning": { "label": "上午", "begin": "09:30", "end": "11:30", data: ["语", "数", "英"] },
        "noon": { "label": "中午", "begin": "12:30", "end": "14:30", data: ["语", "物", "英"] },
        "afternoon": { "label": "下午", "begin": "15:30", "end": "17:30", data: ["化"] },
        "night": { "label": "晚上", "begin": "18:30", "end": "20:30", data: ["生", "数", "英"] },
        "show": true
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;

  },

  showToggle:function(e){
    var item = e.currentTarget.dataset.item;
    var list = page.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].title == item.title){
        list[i].show = !list[i].show;
        break;
      }   
    }
    page.setData({
      list: list
    });
  }
})