// pages/home/home.js
var Bmob = require('../../utils/bmob.js');
var app = getApp()


Page({
  data: {
    //轮播图
    movies: [
      '../images/swiper1.jpg',
      '../images/swiper2.jpg'
    ],
  },
  /*onLoad: function () {
    var Test = Bmob.Object.extend("Test");
    var query = new Bmob.Query(Test);
    var test = new Test();

    query.first({
      success:function(result){
        console.log(result)
      },
      error:function(error){
        console.log("查询失败："+error.code+""+error.message)
      }

    });

    test.set("title"," 敲里吗");
    test.save(null,{
      success:function(result){
        console.log("插入数据成功,objectID"+result.id);
      },
      error:function(result,error){
        console.log("插入数据失败");
      }
    });


  },*/
  /*转到购物列表*/
  golist: function () {
    wx.switchTab({
      url: '../comunity/list/list'
    })
  }
})
