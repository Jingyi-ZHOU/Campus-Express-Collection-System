var App = getApp()
var Bmob = require('../../utils/bmob.js');
Page({
  data: {
    tabIndex: false,
    thisUser: '',
    sentList: [],
    tookList: [],
    nowId: '',
    nowJdUser: '',
    nowHprice: ''
  },
  changeTab: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      tabIndex: index,
    })
  },
  onLoad: function () {
  },
  onShow: function () {
    var that = this;
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

  toDetail(event) {
    var that = this;
    var nowId = event.target.dataset.id;
    that.setData({
      nowId: nowId,
    });
    wx.navigateTo({
      url: './detail/detail?nowId=' + that.data.nowId,
    })
  },
  toChat(e) {
    console.log(e)

  },
  toReply(event) {
    var that = this;
    var nowId = event.target.dataset.id;
    that.setData({
      nowId: nowId,
    });
    reply(that, event)
    wx.navigateTo({
      url: './reply/reply?nowId=' + that.data.nowId,
    })
  },

})

function reply(t, e) {
  var that = t;
  var reportId = that.data.nowId;
  var Report = Bmob.Object.extend("Report");
  var query = new Bmob.Query(Report);
  query.get(reportId, {
    success: function (res) {
      res.set('isReply', true);
      res.save();
      console.log("跳转成功" + res.get('isReply'));
      wx.showToast({
        title: '提交回复',
        icon: 'success',
        duration: 1000
      })
      getList(that)
    },
    error: function (error) {
      console.log("回复失败");
    }
  });
}

function getList(t) {
  var that = t;
  that.setData({
    thisUser: wx.getStorageSync('userName'),
  });
  var Report = Bmob.Object.extend("Report");
  var query = new Bmob.Query(Report);
  var query1 = new Bmob.Query(Report);

  query.equalTo("ssno", that.data.thisUser);
  query1.equalTo("jsno", that.data.thisUser);

  query.descending('createdAt');
  query.include("own")
  query.limit(that.data.limit);

  query1.descending('createdAt');
  query1.include("own")
  query1.limit(that.data.limit);

  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        sentList: results
      })
    },
    error: function (error) {
      console.log("查询失败" );
    }
  });

  query1.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        tookList: results
      })
    },
    error: function (error) {
      console.log("查询失败");
    }
  });
}