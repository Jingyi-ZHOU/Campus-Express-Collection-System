var Bmob = require('../../utils/bmob.js');
var app = getApp()

Page({
  data: {
    userName:'',
    userHead:'',
    items: [
      {
        icon: '../images/order-selected.png',
        text: '我的订单',
        path: '../order/order'
      },
      {
        icon: '../images/report.png',
        text: '我的仲裁',
        path: '../address/box/box'
      },
      {
        icon: '../images/point.png',
        text: '积分查询',
        path: '../point/point',
      },
      {
        icon: '../images/fankui.png',
        text: '业务咨询',
        path: '13739257265',
      },
    ],
    settings: [
      {
        icon: '../images/clear.png',
        text: '清除缓存',
        path: '0.0KB'
      },
      {
        icon: '../images/about.png',
        text: '关于我们',
        path: '../about/about'
      },
    ]
  },
  onLoad() {
    this.getStorageInfo();//读取缓存容量信息
   // var userName = wx.getStorageSync('userName');//读取缓存指定内容
    this.setData({ userName: wx.getStorageSync('userName')})
    this.setData({ userHead: wx.getStorageSync('userHead') })
    //this.setData({ userSum: wx.getStorageSync('userSum') })
   // console.log(userName);
   // var userHead = wx.getStorageSync('userHead');
   // console.log(userHead);
 
  },
  navigateTo(e) {
    const index = e.currentTarget.dataset.index
    switch (index) {
      case 0:
        wx.navigateTo({
          url: '../order/order',
        })
        break
      case 1:
        wx.navigateTo({
          url: '../report/report',
        })
        break
      case 2:
        wx.navigateTo({
          url: '../point/point',
        })
        break
      case 3:
        wx.makePhoneCall({
          phoneNumber: '13739257265'
        })
        break
    }
  },

  getStorageInfo(){
    var that = this;
    wx.getStorageInfo({
      key:'key',
      success: function (res) {
        console.log(res.currentSize)
        that.setData({
      'settings[0].path': `${res.currentSize}KB`
    })
      }
    })
  },

  bindtap(e) {
    const index = e.currentTarget.dataset.index
    var that = this;
    switch (index) {
      case 0:
        wx.showModal({
          title: '友情提示',
          content: '确定要清除缓存吗？',
          success: function(res){
            if(res.confirm){
              console.log('确定清除'),
              wx.clearStorage({
                success: function (res) {
                  console.log('清除成功')
                //  that.getStorageInfo() 为什么清除成功还是1kb？？
                }
              })
            }else if(res.cancel){
              console.log('取消清除')
            }
          },
        })
        break
      case 1:
        wx.navigateTo({
          url: '../about/about',
        })
    }
  },
  logout() {
    wx.showModal({
      title: '友情提示',
      content: '确定要登出吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '../start/start',
          })
          wx.clearStorage({
            success: function (res) {
              console.log('清除缓存并退出')
              //  that.getStorageInfo() 为什么清除成功还是1kb？？
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})
