var App = getApp()
var Bmob = require('../../../utils/bmob.js');
Page({
  data: {
    oneOrder:'',
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
  var Daiqu = Bmob.Object.extend("Daiqu");
  var query = new Bmob.Query(Daiqu);


  query.get(that.data.nowId,{
    success: function (results) {
      console.log(results);
      that.setData({
        oneOrder: results
      })
    },
    error: function (error) {
      console.log("查询失败");
    }
  });

}