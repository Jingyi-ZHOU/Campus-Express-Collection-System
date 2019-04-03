var App = getApp()
var Bmob = require('../../../utils/bmob.js');

Page({
  data: {
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    daiquList:[],
    acceptOrder:false,
    hideOrder:false,
    nowId:'',
    jduser:''
  },
  onReady: function (e) {
  },
  onLoad:function(){
    // var k = 'http://bmob-cdn-12917.b0.upaiyun.com/2017/07/18/d99d3bb7400cb1ed808f34896bff6fcc.jpg';

    // var newUrl = k.replace("http://bmob-cdn-12917.b0.upaiyun.com", "https://bmob-cdn-12917.bmobcloud.com")

    // console.log(newUrl);
  },
  // noneWindows: function () {
  //   that.setData({
  //     hideOrder: "",
  //     acceptOrder: ""
  //   })
  // },
  onShow:function() {
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
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getList(this);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    getList(this);
  },
  inputTyping: function (e) {
    //搜索数据
    getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },

  toOrderPlus(e) {
    console.log(e)
    wx.navigateTo({
      url: '../plus/plus',
    })
  },

  toAcceptOrder:function(event){
    var that = this;
    var nowId = event.target.dataset.id;
    that.setData({
      acceptOrder: true,
      nowId:nowId,
      jduser: wx.getStorageSync('userName')
    });
    acceptOrder(that,event)
  },

}) 

function acceptOrder(t,e){
  var that = t;
  var acceptId = that.data.nowId;
  var jduser = that.data.jduser;
  var Daiqu = Bmob.Object.extend("Daiqu");
  var query = new Bmob.Query(Daiqu);
  query.get(acceptId, {
    success: function (res) {
      console.log("查询成功"+ res.get('isAccept'))
    },
    error: function (object, error) {
      // 查询失败
    }
  });
  query.get(acceptId,{
    success:function(res){
      res.set('isAccept',true);
      res.set('jduser',jduser)
      res.save();
      console.log("接单成功" + res.get('isAccept') + res.get('jduser'));
      wx.showToast({
        title: '接单成功',
        icon: 'success',
        duration: 1000
      })
      getList(that)
    },
    error:function(err){
      console.log("接单失败");
    }
  })

}


function getList(t) {
  var that = t;
  var Daiqu = Bmob.Object.extend("Daiqu");
  var query = new Bmob.Query(Daiqu);
  var query1 = new Bmob.Query(Daiqu);

  query.descending('createdAt');
  query.include("own")
  // 查询所有数据
  query.limit(that.data.limit);

  query.find({
    success: function (results) {
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        daiquList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}