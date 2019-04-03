//app.js
const Bmob = require('utils/bmob.js');
Bmob.initialize("107ffd7363630bea5c6361b585230b7d", "0d28561af4bb20b8d6811e365b154d32");


var app = getApp();

App({
/*  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {

      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },*/
  onShow() {
    console.log('onShow')
  },
  onHide() {
    console.log('onHide')
  }
})