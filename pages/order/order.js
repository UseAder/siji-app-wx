// pages/allwb/allwb.js
var app = getApp()
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderDetailsStatusOne: 0,
    id: -1,
    orderDetails: {},
    progressText: '3', //运输中
    progressNum: 0, //运输中
    progress: 40, //运输中
    map: {
      lat: 23.099994,
      lng: 113.324520,
      markers: [],
      hasMarkers: false //解决方案  
    },
    idjiedan: '', //接的这个单的id
    allReceiptvisible: false
  },
  ydxq: function(e) {
    wx.navigateTo({
      url: '../waybil/waybil?id=' + e.currentTarget.dataset.id
    });
  },
  onCancel: function() { //取消
    this.setData({
      allReceiptvisible: false
    });
  },
  receipt: function(e) { //接单操作
    this.data.idjiedan = e.currentTarget.dataset.id.id
    this.setData({
      allReceiptvisible: true
    });
  },
  onAllReceiptClickConfirm() {
    var that = this
    that.setData({
      allReceiptvisible: false,
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        util.receiptFun({
          data: {
            id: that.data.idjiedan,
            latitude: latitude,
            longitude: longitude
          },
          header: {
            'content-type': 'application/json',
            'siji-app-token': app.globalData.sijiAppToken
          }
        }, function(err, res) {
          if (res.data.code == "200") {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              orderDetailsStatusOne: 5,
            });
          } else {
            wx.showToast({
              title: '接单失败,请重试',
              icon: 'none',
              duration: 2000,
              success: function(res) {
                that.onShow()
              }
            })
          }
        });
      }
    })
  },
  markertap(e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id;
    var that = this;
    util.orderDetailsFun({
      id: that.data.id,
      header: {
        'content-type': 'application/json',
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function(err, res) {
      

      if (res.data.code == "200") {
        let data = res.data.data;

        var markers_new = []
        for (var i = 0; i < data.waybillList.length; i++) {
          if (data.waybillList[i].consigneeLat!=null && data.waybillList[i].consigneeLng!=null){
            markers_new.push({
              latitude: data.waybillList[i].consigneeLat,
              longitude: data.waybillList[i].consigneeLng,
              id: i,
              callout: {
                content: data.waybillList[i].goodsName,
                color: "#000",
                fontSize: "16",
                borderRadius: "10",
                bgColor: "#f8f8f8",
                padding: "10",
                display: "BYCLICK"
              }
            })
          }
        }
        that.setData({
          orderDetails: data,
          orderDetailsStatusOne: data.status
        })
        if (markers_new.length>0){

          that.setData({
            'map.lat': markers_new[0].latitude,
            'map.lng': markers_new[0].longitude,
            'map.markers': markers_new,
            'map.hasMarkers': true //解决方案  
          })
        }else{
          that.setData({
            'map.hasMarkers': true //解决方案  
          })
        }
      }
    });

    var progressNum = 40;
    var timer = setInterval(function() {
      progressNum++;
      if (progressNum >= 100) {
        clearInterval(timer);
      }
      that.setData({
        progress: progressNum
      })
    }, 500)

  },
  onShow: function() {
    var that = this;
    util.orderDetailsFun({
      id: that.data.id,
      header: {
        'content-type': 'application/json',
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
        that.setData({
          orderDetails: res.data.data,
          orderDetailsStatusOne: res.data.data.status
        })
      }
    });

  }
})