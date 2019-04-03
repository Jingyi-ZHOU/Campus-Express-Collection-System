var app = getApp()
var Bmob = require('../../../utils/bmob.js');
var common = require('../getCode.js');
var that;

Page({
  data: {
    thisId:'',
    zsuser: '',
    zjuser: '',
    zscon:'',
    nowId:'',//相关订单
    isStart:false,//是否开始审理
    isDone:false,//是否结案
    isReply:false,//被告是否回复
    noteMaxLen: 200,//kscon最多字数
    noteNowLen: 0,//kscon当前字数
    showTopTips: false,
    TopTips: '',
    isLoading: '',
    loading: '',
    isdisabled: '',
    autoFocus: '',
  },

  //字数改变触发事件
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value, noteNowLen: len
    })
  },

  onLoad: function (options) {
    var that = this;
    console.log('onload+'+options.nowId);
    that.setData({
      zsuser: wx.getStorageSync('userName'),
      nowId: options.nowId,
      isStart: false,
      isDone: false,
      isReply: false,
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false,
    })
    //向 Daiqu 表中获取数据
    var Daiqu = Bmob.Object.extend("Daiqu")
    var daiqu = new Bmob.Query(Daiqu);
    console.log('本地数据nowID & zsuser:' + that.data.nowId + that.data.zsuser);
    daiqu.get(that.data.nowId, {
      success: function (res) {
        if (that.data.zsuser == res.get("xduser")) {
          that.setData({
            zjuser: res.get("jduser")
          })
          console.log("1仲裁被告用户" + that.data.zjuser);
        } else {
          that.setData({
            zjuser: res.get("xduser")
          })
          console.log("1仲裁被告用户" + that.data.zjuser);
        }
      },
      error: function (err) {
        console.log("数据获取失败")
      }

    })
  },
  onReady: function () {
    wx.hideToast()
  },

  onShow: function () {
    var that=this;
    var myInterval = setInterval(getReturn, 500); ////半秒定时查询
    function getReturn() {
      wx.getStorage({
        key: 'userName',
        success: function (ress) {
          if (ress.data) {
            clearInterval(myInterval)
            that.setData({
              loading: true
            })
          }
        }
      })
    }

  },

  showTopTips: function () {
    var that = this;
    that.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  submitForm: function (e) {
    var that = this;

    var isStart = that.data.isStart;
    var isDone = that.data.isDone;
    var isReply = that.data.isReply;
    var zsuser = that.data.zsuser;
    var zjuser = that.data.zjuser;
    var zscon = e.detail.value.zscon;
    //console.log(that.data.isStart + that.data.zjuser + e.detail.value.zscon)

    //先进行表单非空验证
    if (zscon == "") {
      that.setData({
        showTopTips: true,
        TopTips: '请填写申请理由'
      });
    } else {
      console.log('2校验完毕');
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      //向 Report 表中新增数据
      
      var Report = Bmob.Object.extend("Report");
      var report = new Report();

      report.set("isStart", isStart);
      report.set("isDone", isDone);
      report.set("isReply", isReply);
      report.set("ssno", zsuser);
      report.set("jsno", zjuser);
      report.set("zscon", zscon);//设置断点，以上成功
      report.set("hno", that.data.nowId);
      report.set("zscon", zscon);
      console.log("3读取缓存成功");
      //新增操作
      report.save(null, {
        success: function (result) {
          that.setData({
            thisId: result.id,
            isLoading: false,
            isdisabled: false,
          });
          console.log("申请成功:" + result.id);
          
          common.dataLoading("申请成功", "success", function () {
            //向 Daiqu 表中修改数据
            var Daiqu1 = Bmob.Object.extend("Daiqu");
            var daiqu1 = new Bmob.Query(Daiqu1);
            daiqu1.get(that.data.nowId, {
              success: function (rr) {
                rr.set('reportId', that.data.thisId);
                rr.save();
                console.log("Daiqu表更新成功" + that.data.nowId + that.data.thisId)
              },
              error: function (err) {
                console.log("数据更新失败")
              }

            })
            //重置表单
            that.setData({
              zsuser: '',
              zjuser: '',
              zscon: '',
              isStart: false,//是否开始审理
              isDone: false,//是否结案
              isReply: false,//被告是否回复
              noteNowLen: 0,//kscon当前字数
              isLoading: false,
              isdisabled: false,
              showTopTips: false,
              TopTips: ''
            })
          });
        },
        error: function (result) {
          //添加失败
          console.log("申请失败" );
          common.dataLoading("申请失败", "loading");
        }
      })

    };
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },
  
 
})