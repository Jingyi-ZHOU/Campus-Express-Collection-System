//获取应用实例
var app = getApp()
var Bmob = require('../../../utils/bmob.js');
var common = require('../getCode.js')
var that;
var myDate = new Date();
var myDate2 = new Date();
var myTime = new Date();
var myTime2 = new Date();

//格式化日期
function formate_data(myDate) {
  let month_add = myDate.getMonth() + 1;
  var formate_result = myDate.getFullYear() + '-'
    + month_add + '-'
    + myDate.getDate()
  return formate_result;
}
//格式化时间
function formate_data2(myTime) {
  //let month_add = myTime.getMonth() + 1;
  var formate_result = myTime.getHours() + ':'
    + myTime.getMinutes()
  return formate_result;
}
//yyyy-MM-dd - HH:mm:ss
Page({
  /**
   * 页面的初始数据
   */
  data: {
    xduser: '',
    sperson: '',
    stel: '',
    dno: '',
    kdno: '',
    kcon: '',
    saddress: '',
    hprice: '',
    hprice0: '',
    hps: '',
    kdate: '',
    kdate2:'',
    htime: '',
    htime2:'',
    isHide:false,//是否隐藏
    isAccept:false,//是否接单
    isQu:false,//是否取件
    isShou:false,//是否确认收货
    isReport:false,// 是否存在问题
    date: formate_data(myDate),
    date2: formate_data(myDate2),
    time: formate_data2(myTime),
    time2: formate_data2(myTime2),
    showTopTips: false,
    TopTips: '',
    noteMaxLen: 200,//备注最多字数
    noteNowLen: 0,//备注当前字数
    types: ["东门中通", "南村圆通", "南村顺丰", "南村天天", "南村百世", "西门申通", "西门韵达", "南门京东", "其他备注"],
    typess:["图书馆","科技楼","宿舍楼2N","宿舍楼3S"],
    typeIndex: "0",
    typesIndex: "0",
    dtypeName:'',
    stypeName:'',
    autoFocus: '',
    isLoading: '',
    loading: '',
    isdisabled: '',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({//初始化数据
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false,
      // xduser: wx.getStorageSync('userName') 
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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

  //改变日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindDateChange2: function (e) {
    this.setData({
      date2: e.detail.value
    })
  },

  //改变时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindTimeChange2: function (e) {
    this.setData({
      time2: e.detail.value
    })
  },

  //改变取件点
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  //改变收件点
  bindTypesChange: function (e) {
    this.setData({
      typesIndex: e.detail.value
    })
  },

  //表单验证
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  //提交表单
  submitForm: function (e) {
    var that = this;
    that.setData({
      xduser: wx.getStorageSync('userName') 
    });
    var isHide = that.data.isHide;
    var isAccept = that.data.isAccept;
    var isQu = that.data.isQu;
    var isShou = that.data.isShou;
    var isReport = that.data.isReport;
    var xduser = that.data.xduser;
    var sperson = e.detail.value.sperson;
    var stel = e.detail.value.stel;
    var kdno = e.detail.value.kdno;
    var kcon = e.detail.value.kcon;
    var hprice = e.detail.value.hprice;
    var hprice0 = parseInt(hprice);
    var kdate = that.data.date;
    var htime = that.data.date2;
    var kdate2 = that.data.time;
    var htime2 = that.data.time2;
    var hps = e.detail.value.hps;
    var typeIndex = this.data.typeIndex;
    var dtype = 1 + parseInt(typeIndex);
    var dtypename = getTypeName(dtype); //获得取件点名称
    var dno = dtypename;
    var typesIndex = this.data.typesIndex;
    var stype = 1 + parseInt(typesIndex);
    var stypename = getsTypeName(stype); //获得收件点名称
    var saddress = stypename;

    // var wxReg = new RegExp("^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$");
    // var qqReg = new RegExp("[1-9][0-9]{4,}");
    // var phReg = /^1[34578]\d{9}$/;
    // var nameReg = new RegExp("^[\u4e00-\u9fa5]{2,4}$");

    //先进行表单非空验证
    var yzUserSum = wx.getStorageSync('userNum');
    if (yzUserSum < 10) {
      this.setData({
        showTopTips: true,
        TopTips: '积分不足'
      });
    }else if (sperson == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入收件人'
      });
    } else if (stel == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入手机号'
      });
    } else if (kdno == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入取件号'
      });
    } else if (kcon == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入快递内容'
      });
    } else if (hprice == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入订单价值'
      });
    } else if (typeIndex == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入取件地点'
      });
    } else if (typesIndex == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入收件地点'
      });
    } else if (kdate == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入到货日期'
      });
    } else if (kdate2 == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入到货日期'
      });
    } else if (htime == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入收件时间'
      });
    } else if (htime2 == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入收件时间'
      });
    } else {
      console.log('校验完毕');
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      //向 Daiqu 表中新增数据
      console.log("读取缓存成功");
      var Daiqu = Bmob.Object.extend("Daiqu");
      var daiqu = new Daiqu();

      daiqu.set("isHide", isHide);
      daiqu.set("isAccept", isAccept);
      daiqu.set("isQu", isQu);
      daiqu.set("isShou", isShou);
      daiqu.set("isReport", isReport);
      daiqu.set("xduser", xduser);
      daiqu.set("sperson", sperson);
      daiqu.set("stel", stel);
      daiqu.set("kdno", kdno);
      daiqu.set("kcon", kcon);
      daiqu.set("hprice",hprice0);
      daiqu.set("dno", dno);
      daiqu.set("saddress", saddress);
      daiqu.set("kdate", kdate+' '+kdate2);
      daiqu.set("htime", htime+' '+htime2);
      daiqu.set("hps", hps);

      //新增操作
      daiqu.save(null, {
        success: function (result) {

          console.log("发布成功:" + result.id);
          that.setData({
            isLoading: false,
            isdisabled: false,
            // eventId: result.id,
          })
          //添加成功，返回成功之后的objectId(注意，返回的属性名字是id,而不是objectId)
          common.dataLoading("下单成功", "success", function () {
            //重置表单
            that.setData({
              xduser: '',
              sperson: '',
              stel: '',
              dno: '',
              kdno: '',
              kcon: '',
              saddress: '',
              hprice: '',
              hprice0:'',
              hps: '',
              kdate: '',
              htime: '',
              isHide: false,//是否隐藏
              isAccept: false,//是否接单
              isQu: false,//是否取件
              isShou: false,//是否确认收货
              isReport: false,// 是否存在问题
              date: formate_data(myDate),
              date2: formate_data(myDate2),
              showTopTips: false,
              TopTips: '',
              noteNowLen: 0,//备注当前字数
              typeIndex: "0",
              typesIndex: "0",
            })
          });
        },
        error: function (result, error) {
          //添加失败
          console.log("下单失败=" + error);
          common.dataLoading("下单失败", "loading");
          that.setData({
            isLoading: false,
            isdisabled: false
          })
        }
      })

      //向 AAA 表中修改数据
      var AAA = Bmob.Object.extend("AAA")
      var aaa = new Bmob.Query(AAA);

      aaa.equalTo("sname",that.data.xduser);
      aaa.find({
        success:function(res){
          console.log("就一条数据啊"+res.length);
          var object = res[0];
          console.log(object.get('sname') + "原有积分" + object.get('snum'));
          var newSum = object.get('snum') - hprice;
          object.set('snum',newSum);
          object.save();
          console.log(object.get('sname') + "现有积分" + object.get('snum'));
        },
        error:function(err){
          console.log("积分更新失败")
        }
      })
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },
})

//根据取件地点获取取件地点名称
function getTypeName(dtype) {
  var dtypeName = "";
  if (dtype == 1) dtypeName = "东门中通";
  else if (dtype == 2) dtypeName = "南村圆通";
  else if (dtype == 3) dtypeName = "南村顺丰";
  else if (dtype == 4) dtypeName = "南村天天";
  else if (dtype == 5) dtypeName = "南村百世";
  else if (dtype == 6) dtypeName = "西门申通";
  else if (dtype == 7) dtypeName = "西门韵达";
  else if (dtype == 8) dtypeName = "南门京东";
  else if (dtype == 9) dtypeName = "其他备注";
  return dtypeName;
}
//根据收件地点获取收件地点名称
function getsTypeName(stype) {
  var stypeName = "";
  if (stype == 1) stypeName = "图书馆";
  else if (stype == 2) stypeName = "科技楼";
  else if (stype == 3) stypeName = "宿舍楼2N";
  else if (stype == 4) stypeName = "宿舍楼3S";
  return stypeName;
}