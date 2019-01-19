const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    villageConfirm: false,
    notSigned: {}, //进行中未签收的运单的列表
    jieDanHidden: false,
    jd: '', //经度
    wd: '', //纬度
    signInDate: '', //签到时间
    records: {}, //接单的列表
    progressText: '3',
    progressNum: 0,
    externalClasses: ['i-class'],
    options: {
      multipleSlots: true
    },
    tags: {
      name: '签到',
      checked: false, //边框
      color: 'qianhong'
    },
    imgUrls: [],
    indicatorDots: false, //指示面板
    autoplay: false, //自动切换
    circular: true, //衔接滑动
    interval: 3000,
    duration: 2000,
    idjiedan: '', //接的这个单的id
  },
  hideModal: function() {
    this.setData({
      villageConfirm: false,

    });
  },
  onCancel: function() { //取消
    this.hideModal();
  },
  receiptOreder(e) { //跳转接单详情
    wx.navigateTo({
      url: '../order/order?id=' + e.currentTarget.dataset.id
    });
  },
  weiqianshou: function(e) { //跳转未签收的运单
    wx.navigateTo({
      url: '../waybil/waybil?id=' + e.currentTarget.dataset.id
    });
  },
  signIn: function() { //签到处理
    var that = this;
    wx.getLocation({
      type: 'gcj02',///gcj02wgs84
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        util.signInFun({
          data: {
            latitude: latitude,
            longitude: longitude
          },
          header: {
            'content-type': 'application/json',
            'siji-app-token': app.globalData.sijiAppToken
          }
        }, function (err, res) {
          if (res.data.code == "200") {
            var d = new Date(res.header.Date);
            var mydate = d.getDate();
            var mymonth = d.getMonth() + 1;
            var gethours = d.getHours();
            var getminutes = d.getMinutes();
            var getseconds = d.getSeconds();
            if (d.getDate() < 10) {
              mydate = '0' + d.getDate(); //补齐
            }
            if (d.getMonth() < 10) {
              mymonth = '0' + mymonth; //补齐
            }
            if (d.getHours() < 10) {
              gethours = '0' + gethours; //补齐
            }
            if (d.getMinutes() < 10) {
              getminutes = '0' + getminutes; //补齐
            }
            if (d.getSeconds() < 10) {
              getseconds = '0' + getseconds; //补齐
            }
            that.setData({
              signInDate: d.getFullYear() + '-' + (mymonth) + '-' + mydate + ' ' + gethours + ':' + getminutes + ':' + getseconds
            })
            wx.showToast({
              title: '签到成功',
              icon: 'none',
              duration: 1000
            })
            return false;
          } else {
            wx.showToast({
              title: '签到失败,请先获取经纬度',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  that.setData({
                    villageConfirm: true
                  });
                }, 1000)
              }
            })
            return false;
          }
        });
      },
      fail: function (err) {
          that.setData({
            villageConfirm: true
          })
      }
    })
   
  },
  loadInfo: function () {//获取时间个人信息下的时间
    var that = this
    util.myInfoFun({
      header: {
        'content-type': 'application/json', // 默认值
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function (err, res) {
      if (res.data.code == "200") {
        that.setData({
          signInDate: res.data.data.lastLocateTime
        })
      } 
    })
  },
  onLoad: function () {
    let imgUrls = [app.globalData.appSet.indexImageUrl];
    this.setData({
      imgUrls: imgUrls
    })
  },
  onShow: function() {
    this.loadInfo();
    var that = this;
    wx.setNavigationBarTitle({
      title: app.globalData.appSet.displayName
    })
    util.listOrderFun({
      data: {
        status: 1
      },
      header: {
       
        'content-type': 'application/json',
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        if (res.data.records!=''){
          for (var item in res.data.records) {
            if (res.data.records[item].status == 1) {
              that.setData({
                jieDanHidden: true,
                records: res.data.records
              })
            }
          }
        }else{
          that.setData({
          jieDanHidden: false,
            records: res.data.records
          })
        }
      
      }
    });
    util.notSignedFun({
      data: {
        status: 5
      },
      header: {
        'content-type': 'application/json',
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        that.setData({
          notSigned: res.data.records
        })
      }
    });
  }, 
  onChange(event) { //轮播图
    const detail = event.detail;
    this.setData({
      ['tags.checked']: detail.checked
    })
  }
})