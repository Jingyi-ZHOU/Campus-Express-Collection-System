var App = getApp()
var Bmob = require('../../utils/bmob.js');

Page({
  data: {
    thisUser: '',
    numUser:'',
    numList: [],
    nowId: ''
  },
  onLoad: function () {
  },
  onShow: function () {
    var that = this;
    that.setData({
      thisUser: wx.getStorageSync('userName')
    })
    var AAA = Bmob.Object.extend("AAA")
    var aaa = new Bmob.Query(AAA);
    aaa.equalTo("sname", that.data.thisUser);
    aaa.find({
      success: function (result) {
        console.log("就一条数据啊" + result.length);
        var object = result[0];
        console.log(object.get('sname') + "用户积分" + object.get('snum'));
        that.setData({
          numUser: object
        })
      },
      error: function (err) {
        console.log("查询失败")
      }
    })
    getList(this);
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullUpLoad: function (e) {
    var that = this;
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
})



function getList(t) {
  var that = t;
  var Daiqu = Bmob.Object.extend("Daiqu");
  var query = new Bmob.Query(Daiqu);
  var query1 = new Bmob.Query(Daiqu);

  query.equalTo("xduser", that.data.thisUser);
  query1.equalTo("jduser", that.data.thisUser);

 // query.descending('createdAt');
  query.include("own")
  query.limit(that.data.limit);

  //query1.descending('createdAt');
  query1.include("own")
  query1.limit(that.data.limit);

  var mainQuery = Bmob.Query.or(query,query1);
  mainQuery.descending('createdAt');
  mainQuery.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        numList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });

}