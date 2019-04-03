// pages/order/order.js
var App = getApp()
var Bmob = require('../../utils/bmob.js');
Page({
  data: {
    tabIndex: false,
    thisUser:'',
    sentList:[],
    tookList:[],
    nowId:'',
    nowJdUser:'',
    nowHprice:''
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
      url: './detail/detail?nowId='+that.data.nowId,
    })
  },

  toChat(e) {
    console.log(e)

  },
  toConfirmQu(e) {
    var that = this;
    var nowId = e.target.dataset.id;
    that.setData({
      nowId: nowId
    })
    console.log(that.data.nowId);
    quHuo(that, e)

  },
  toConfirmShou(e) {
    var that = this;
    var nowId = e.target.dataset.id;
    that.setData({
      nowId: nowId
    })
    console.log(that.data.nowId);
    shouHuo(that,e)
  },
  toReport(e) {
    var that = this;
    var nowId = e.target.dataset.id;
    that.setData({
      nowId: nowId
    })
    console.log(that.data.nowId);
    report(that,e)
    wx.navigateTo({
      url: '../report/plus/plus?nowId=' + that.data.nowId,
    })
  },

})

function report(t,e){
  var that = t;
  var reportId = that.data.nowId;
  var Daiqu = Bmob.Object.extend("Daiqu");
  var query = new Bmob.Query(Daiqu);
  query.get(reportId, {
    success: function (res) {
      res.set('isReport', true);
      res.save();
      console.log("跳转成功" + res.get('isReport'));
      wx.showToast({
        title: '申请仲裁',
        icon: 'success',
        duration: 1000
      })
      getList(that)
    },
    error: function (error) {
      console.log("反馈失败");
    }
  });
}

function shouHuo(t,e){
  var that = t;
  var shouId = that.data.nowId;
  var Daiqu = Bmob.Object.extend("Daiqu");
  var query = new Bmob.Query(Daiqu);
  query.get(shouId, {
    success: function (res) {
      that.setData({
        nowJdUser: res.get('jduser'),
        nowHprice: res.get('hprice')
      })
      res.set('isShou', true);
      res.save();

      //向 AAA 表中修改数据
      var AAA = Bmob.Object.extend("AAA")
      var aaa = new Bmob.Query(AAA);
      aaa.equalTo("sname", that.data.nowJdUser);
      aaa.find({
        success: function (result) {
          console.log("就一条数据啊" + result.length);
          var object = result[0];
          console.log(object.get('sname') + "原有积分" + object.get('snum'));
          var newSum = object.get('snum') + that.data.nowHprice;
          object.set('snum', newSum);
          object.save();
          console.log(object.get('sname') + "现有积分" + object.get('snum'));
        },
        error: function (err) {
          console.log("积分更新失败")
        }
      })
      console.log("收货成功" + res.get('isShou'));
      wx.showToast({
        title: '收货成功',
        icon: 'success',
        duration: 1000
      })
      getList(that)
    },
    error: function (error) {
      console.log("收货失败");
    }
  });

}

function quHuo(t, e) {
  var that = t;
  var quId = that.data.nowId;
  var Daiqu = Bmob.Object.extend("Daiqu");
  var query = new Bmob.Query(Daiqu);
  query.get(quId, {
    success: function (res) {
      res.set('isQu', true);
      res.save();
      console.log("取货成功" + res.get('isQu'));
      wx.showToast({
        title: '取货成功',
        icon: 'success',
        duration: 1000
      })
      getList(that)
    },
    error: function (error) {
      console.log("取货失败");
    }
  });
}

function getList(t) {
  var that = t;
  that.setData({
    thisUser: wx.getStorageSync('userName'),
  });
  var Daiqu = Bmob.Object.extend("Daiqu");
  var query = new Bmob.Query(Daiqu);
  var query1 = new Bmob.Query(Daiqu);

  query.equalTo("xduser", that.data.thisUser);
  query1.equalTo("jduser", that.data.thisUser);

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
      console.log("查询失败");
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