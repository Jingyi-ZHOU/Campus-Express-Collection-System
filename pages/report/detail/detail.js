var App = getApp()
var Bmob = require('../../../utils/bmob.js');
Page({
  data: {
    oneReport: '',
    nowId: '',

  },
  onLoad: function (options) {
    var that = this;
    console.log(options.nowId);
    that.setData({
      nowId: options.nowId
    })

  },
  onShow: function () {
    var that = this;
    getOne(this);
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },



})

function getOne(t) {
  var that = t;
  var Report = Bmob.Object.extend("Report");
  var query = new Bmob.Query(Report);


  query.get(that.data.nowId, {
    success: function (results) {
      console.log(results);
      that.setData({
        oneReport: results
      })
    },
    error: function (error) {
      console.log("查询失败");
    }
  });

}