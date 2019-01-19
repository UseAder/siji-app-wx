// pages/myorder/imation/imation.js
const app = getApp()
const util = require('../../utils/util.js')
const uploadFile = require('../../utils/uploadAliyun.js');
Page({
  data: {
    // markers: [],
    map: {
      lat: 23.099994,
      lng: 113.324520,
      markers: [],
      hasMarkers: false //解决方案  
    },
    id: -1, 
    detailsOfTheWaybill: {}, 
    detailsOfTheWaybillsignTime: '', 
    detailsOfTheWaybillstatus: "",
    normalvisible: false,
    pohtovisible: false,

    goodsPic: [],
    receiptPic: [],
    goodsPicView: [],
    receiptPicView: [],
    goodsPicViewNew: [],
    receiptPicViewNew: [], 
    goodsReceiptHidden: false,
   
    goodsPicViewUpdate:[],
    receiptPicViewUpdate:[],
    receiptNum: '',
    dfFee: '',
  },
  hideModal: function() {
    this.setData({
      pohtovisible: false,
      normalvisible: false
     
    });
  },
  onCancel: function() { //取消
    this.hideModal();
  },
  normalReceiptClickOpen() {
    if (this.data.receiptPicView != '' && this.data.goodsPicView != '') { //判断是否有照片 没有跳出
      this.setData({
        normalvisible: true
      });
    } else {
      this.setData({
        pohtovisible: true
      });

    } 
  },
  onPohtoReceiptClickConfirm() {
    this.setData({
      pohtovisible: false,
      normalvisible: true
    });
  }, 
  onNormalvisibleConfirm() {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        util.normalReceiptFun({
          data: {
            flag: 1,
            latitude: latitude,
            longitude: longitude,
            id: _this.data.id,
            goodsPic: _this.data.goodsPic,
            receiptPic: _this.data.receiptPic,
          },
          header: {
            'content-type': 'application/json',
            'siji-app-token': app.globalData.sijiAppToken
          }
        }, function(err, res) {
          _this.setData({
            normalvisible: false,
          });
          if (res.data.code == "400") {
            wx.showToast({
              title: '签收失败，res.data.message',
              icon: 'none',
              duration: 3400
            })
          }
          if (res.data.code == "200") {
            wx.showToast({
              title: '签收成功',
              icon: 'success',
              duration: 3400,
              success: function(res) {
                var d = new Date();
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
                _this.setData({
                  detailsOfTheWaybillstatus: 10,
                  detailsOfTheWaybillsignTime: d.getFullYear() + '-' + (mymonth) + '-' + mydate + ' ' + gethours + ':' + getminutes + ':' + getseconds,
                  goodsReceiptHidden: true
                });
              }
            })
          }
        });
      }
    })
  },

  goodsPicPreviewImageIcon: function(e) {
    this.data.goodsPic.splice(e.currentTarget.dataset.index, 1)
    this.data.goodsPicView.splice(e.currentTarget.dataset.index, 1)
    this.data.goodsPicViewNew.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      goodsPic: this.data.goodsPic,
      goodsPicView: this.data.goodsPicView,
      goodsPicViewNew: this.data.goodsPicViewNew
    });
    this.picUpdateFun()
    wx.showToast({
      title: '货物图片已删除',  //标题
      duration: 1000, //提示的延迟时间，单位毫秒，默认：1500
      mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
      success: function () {
      }
    })
  },
   receiptPicPreviewImageIcon: function(e) {
     this.data.receiptPic.splice(e.currentTarget.dataset.index, 1)
     this.data.receiptPicView.splice(e.currentTarget.dataset.index, 1)
     this.data.receiptPicViewNew.splice(e.currentTarget.dataset.index, 1)
     this.setData({
       receiptPic: this.data.receiptPic,
       receiptPicView: this.data.receiptPicView,
       receiptPicViewNew: this.data.receiptPicViewNew,
       receiptPicPreviewImageIconvisible: false
     });
     var that=this
     that.picUpdateFun()
     wx.showToast({
       title: '回单图片已删除',  //标题
       duration: 1000, //提示的延迟时间，单位毫秒，默认：1500
       mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
       success: function () {
       }
     })
  },
  goodsPicPreviewImage: function(e) { //上传照片
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.goodsPicViewNew // 需要预览的图片http链接列表
    })
  },
  goodsPicChooseImage: function(e) { //上传照片
    var that = this;

    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        if (!res.tempFilePaths) {
          wx.showModal({
            title: '图片错误',
            content: '请重试',
            showCancel: false,
          })
          return;
        }
        let filePath = res.tempFilePaths;
        util.uploadFileFun({
          header: {
            'content-type': 'application/json',
            'siji-app-token': app.globalData.sijiAppToken
          }
        }, function(err, res) {
          let data = res.data.data;
          for (var i = 0; i < filePath.length; i++) {
            uploadFile(
              data.accessid,
              data.policy,
              data.signature,
              data.host,
              filePath[i],
              data.dir,
              function(res) {
                that.data.goodsPic.push(res);
                that.setData({
                  goodsPicView: that.data.goodsPicView.concat(app.globalData.picUrl + res + app.globalData.ossXJ),
                  goodsPicViewNew: that.data.goodsPicViewNew.concat(app.globalData.picUrl + res)
                });
                that.picUpdateFun()
              },
              function(res) {
              });
          }
        }) 
      }
    })
  },
  picUpdateFun: function() {
    var that = this;
    util.picUpdateFun({
      data: {
        id: that.data.id,
        goodsPic: that.data.goodsPic,
        receiptPic: that.data.receiptPic
      },
      header: {
        'content-type': 'application/json',
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function(err, res) {
      if (res.data.code == "200") {
    
      } 
    });
  },

  receiptPicPreviewImage: function(e) { //上传照片
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.receiptPicViewNew // 需要预览的图片http链接列表
    })
  },
  receiptPicChooseImage: function(e) { //上传照片
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        if (!res.tempFilePaths) {
          wx.showModal({

            title: '图片错误',
            content: '请重试',
            showCancel: false,
          })
          return;
        }
        let filePath = res.tempFilePaths;

        util.uploadFileFun({
          header: {
            'content-type': 'application/json',
            'siji-app-token': app.globalData.sijiAppToken
          }
        }, function(err, res) {
          let data = res.data.data; 
          for (var i = 0; i < filePath.length; i++) {
            uploadFile(
              data.accessid,
              data.policy,
              data.signature,
              data.host,
              filePath[i],
              data.dir,
              function(res) {
                that.data.receiptPic.push(res); 
                that.setData({
                  receiptPicView: that.data.receiptPicView.concat(app.globalData.picUrl + res + app.globalData.ossXJ),
                  receiptPicViewNew: that.data.receiptPicViewNew.concat(app.globalData.picUrl + res)
                });
                that.picUpdateFun()
              },
              function(res) {});
          }
        })
      }

    })
  },
  markertap(e) {
    console.log(e)
  },
  onShow: function() {
    var _this = this;
    util.detailsOfTheWaybillFun({
      id: _this.data.id,
      header: {
        'content-type': 'application/json',
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function(err, res) {

      if (res.data.code == "200") {
        let d = res.data.data;
        _this.setData({
          receiptNum: d.receiptNum,
          dfFee: d.dfFee,

        })
        var markers_new = [{
          latitude: d.consigneeLat,
          longitude: d.consigneeLng,

          id: 1,
          callout: {
            content: d.goodsName,
            color: "#000",
            fontSize: "16",
            borderRadius: "10",
            bgColor: "#f8f8f8",
            padding: "10",
            display: "BYCLICK"
          }
        }]

        if (d.goodsPic) {
          let gp = [];
          let gpN = []
          for (var i in d.goodsPic) {
            gp.push(app.globalData.picUrl + d.goodsPic[i] + app.globalData.ossXJ);
            gpN.push(app.globalData.picUrl + d.goodsPic[i]);
          }
          _this.setData({
            goodsPicViewUpdate: d.goodsPic,
            goodsPic: d.goodsPic,
            goodsPicView: gp,
            goodsPicViewNew: gpN,

          })
        }
        if (d.receiptPic) {
          let rp = [];
          let rpN = []
          for (var i in d.receiptPic) {
            rp.push(app.globalData.picUrl + d.receiptPic[i] + app.globalData.ossXJ);
            rpN.push(app.globalData.picUrl + d.receiptPic[i]);
          }
          _this.setData({
            receiptPicViewUpdate: d.receiptPic,
            receiptPic: d.receiptPic,
            receiptPicView: rp,
            receiptPicViewNew: rpN
          })
        }
        if (d.consigneeLat != null && d.consigneeLng != null) {
          _this.setData({
            'map.lat': d.consigneeLat,
            'map.lng': d.consigneeLng,
            'map.markers': markers_new,
            'map.hasMarkers': true //解决方案  
          })
        } else {
          _this.setData({
            'map.hasMarkers': true //解决方案  
          })

        }
        _this.setData({
          detailsOfTheWaybill: d,
          detailsOfTheWaybillstatus: d.status,
          detailsOfTheWaybillsignTime: d.signTime,
        });

      }
    });
  },
  onLoad: function(options) {

    this.data.id = options.id


  }
})