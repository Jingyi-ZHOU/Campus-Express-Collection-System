var app = getApp()
var Bmob = require('../../../utils/bmob.js');
var common = require('../getCode.js');
var that;

Page({
  data: {
    jsreply: '',
    nowId: '',//相关订单
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
    console.log('onload+' + options.nowId);
    that.setData({
      nowId: options.nowId,
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false,
    })
  },
  onReady: function () {
    wx.hideToast()
  },

  onShow: function () {
    var that = this;
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
    var jsreply = e.detail.value.jsreply;
    //先进行表单非空验证
    if (jsreply == "") {
      that.setData({
        showTopTips: true,
        TopTips: '请填写仲裁回复'
      });
    } else {
      console.log('2校验完毕');
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      //向 Report 表中新增数据
      var replyId = that.data.nowId;
      var Report = Bmob.Object.extend("Report");
      var query = new Bmob.Query(Report);
      query.get(replyId, {
        success: function (res) {
          that.setData({
            isLoading: false,
            isdisabled: false,
          })
          res.set('jsreply', jsreply);
          res.save();
          console.log("回复成功" + res.get('jsreply'));
          common.dataLoading("回复成功", "success", function () {

            //重置表单
            that.setData({
              jsreply: '',
              noteNowLen: 0,//kscon当前字数
              isLoading: false,
              isdisabled: false,
              showTopTips: false,
              TopTips: ''
            })
          });
        },
        error: function (error) {
          console.log("回复失败");
        }
      });

    };
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },


})