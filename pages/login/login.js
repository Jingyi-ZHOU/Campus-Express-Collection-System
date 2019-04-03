var Bmob = require('../../utils/bmob.js');
var app = getApp()

Page({
  data: {
    userName: '',
    password: '',
    userHead:''
  },
  // 获取输入账号 
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  onLoad:function(){
    // var User = Bmob.Object.extend("AAA");
    // var query = new Bmob.Query(User);
    // query.find({
    //   success: function (res) {
    //     console.log("数据条数："+res.length)
    //   },
    //   error: function (error) {
    //     console.log("查询失败: " + error.code + " " + error.message);
    //   }
    // });
    
    // query.equalTo("sname", "zhoujingyi");
    // query.find({
    //   success:function(rr){
    //     console.log('共查询到' + rr.length + '条数据');
    //   },
    //   error:function(err){
    //     console.log("fail")
    //   }
    // })

  },
  // 登录 
  login: function () {
    var that = this;
    var User = Bmob.Object.extend("AAA");
    var query = new Bmob.Query(User);
    query.equalTo("sname", that.data.userName);
    wx.setStorageSync('userName', that.data.userName);//缓存name
    query.find({
      success: function (rr) {
        console.log('共查询到' + rr.length + '条数据！');
        var object = rr[0];
        console.log(object.get('sname') + "用户积分" + object.get('snum'));
        wx.setStorageSync('userNum', object.get('snum'));//缓存积分
        if (that.data.userName.length == 0 || that.data.password.length == 0) {
          wx.showToast({
            title: '请填写完整',
            icon: 'loading',
            duration: 2000
          })
        } else if (that.data.password == object.get('scode')) {
          that.data.userHead = object.get('headurl');
          wx.setStorageSync('userHead', that.data.userHead);//缓存头像
          wx.switchTab({
            url: '../home/home',
          })
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'loading',
            duration: 2000
          })
        }
      },
      error: function (err) {
        console.log("fail")
      }
    })    
  }
})