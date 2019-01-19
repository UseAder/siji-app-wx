// pages/myorder/imation/imation.js
const app = getApp()
var util = require('../../../utils/util.js')
const uploadFile = require('../../../utils/uploadAliyun.js');
var flag = 1
Page({
  data: {

    canIUse: '',
    myInfoFun: {},

    idCardBehind: [],
    idCardFront: [],
    driverLicensePic: [],
    truckLicensePic: [],
    truckPicOne: [],
    truckPicTwo: [],

    idCardBehindNew: [],
    idCardFrontNew: [],
    driverLicensePicNew: [],
    truckLicensePicNew: [],
    truckPicOneNew: [],
    truckPicTwoNew: []
  },
  perPhoto: function(flag, filePath) {
    var that = this;
    util.uploadFileFun(
      {
      header: {
        'content-type': 'application/json',
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function(err, res) {
      let data = res.data.data;
      uploadFile(
        data.accessid,
        data.policy,
        data.signature,
        data.host,
        filePath,
        data.dir,
        function(res) {
          switch (flag) {
            case 1:
              {
                that.setData({
                  idCardFront: app.globalData.picUrl + res + app.globalData.ossXJ,
                  idCardFrontNew: app.globalData.picUrl + res
                });
              }
              break;
            case 2:
              {
                that.setData({
                  idCardBehind: app.globalData.picUrl + res + app.globalData.ossXJ,
                  idCardBehindNew: app.globalData.picUrl + res
                });

              }
              break;
            case 3:
              {
                that.setData({
                  driverLicensePic: app.globalData.picUrl + res + app.globalData.ossXJ,
                  driverLicensePicNew: app.globalData.picUrl + res
                });
              }
              break;
            case 4:
              {
                that.setData({
                  truckLicensePic: app.globalData.picUrl + res + app.globalData.ossXJ,
                  truckLicensePicNew: app.globalData.picUrl + res
                });
              }
              break;
            case 5:
              {
                that.setData({
                  truckPicOne: app.globalData.picUrl + res + app.globalData.ossXJ,
                  truckPicOneNew: app.globalData.picUrl + res
                });
              }
              break;
            case 6:
              {
                that.setData({
                  truckPicTwo: app.globalData.picUrl + res + app.globalData.ossXJ,
                  truckPicTwoNew: app.globalData.picUrl + res
                });
              }
              break;
              perPhotoFun
          }
          //向服务器保存最新图片路径
          util.perPhotoFun({
            data: {
              flag: flag,
              picture: res
            },
            header: {
              'content-type': 'application/json',
              'siji-app-token': app.globalData.sijiAppToken
            }
          }, function(err, res) {
            if (res.data.code == "200") {
              wx.showToast({
                title: '上传更新成功',
                icon: 'none',
                duration: 2000
              })
            }
          }, {
            False: false
          })
        },
        function(err) {
          wx.showToast({
            title: err,
            icon: 'none',
            duration: 2000
          })
        });
      },"FALSE")
  },
  previewImage: function(e) { //上传照片
    var previewImageUrls = []
    previewImageUrls.push(this.data.idCardFrontNew)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: previewImageUrls // 需要预览的图片http链接列表
    })
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        flag = 1
        that.perPhoto(flag, res.tempFilePaths[0])
      }
    })
  },
  previewImage1: function(e) { //上传照片
    var previewImageUrls = []
    previewImageUrls.push(this.data.idCardBehindNew)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: previewImageUrls // 需要预览的图片http链接列表
    })
  },
  chooseImage1: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        flag = 2
        that.perPhoto(flag, res.tempFilePaths[0])
      }
    })
  },
  previewImage2: function(e) { //上传照片
    var previewImageUrls = []
    previewImageUrls.push(this.data.driverLicensePicNew)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: previewImageUrls // 需要预览的图片http链接列表
    })
  },
  chooseImage2: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        flag = 3
        that.perPhoto(flag, res.tempFilePaths[0])
      }
    })
  },
  previewImage3: function(e) { //上传照片
    var previewImageUrls = []
    previewImageUrls.push(this.data.truckLicensePicNew)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: previewImageUrls // 需要预览的图片http链接列表
    })
  },
  chooseImage3: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        flag = 4
        that.perPhoto(flag, res.tempFilePaths[0])
      }
    })
  },
  previewImage4: function(e) { //上传照片
    var previewImageUrls = []
    previewImageUrls.push(this.data.truckPicOneNew)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: previewImageUrls // 需要预览的图片http链接列表
    })
  },
  chooseImage4: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        flag = 5
        that.perPhoto(flag, res.tempFilePaths[0])
      }
    })
  },

  previewImage5: function(e) { //上传照片
    var previewImageUrls = []
    previewImageUrls.push(this.data.truckPicTwoNew)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: previewImageUrls // 需要预览的图片http链接列表
    })
  },
  chooseImage5: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        flag = 6
        that.perPhoto(flag, res.tempFilePaths[0])
      }
    })
  },
  onShow: function() {
    var _this = this;
    util.myInfoFun({
      header: {
        'content-type': 'application/json', // 默认值
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function(err, res) {
      
      if (res.data.code == "200") {
        let data = res.data.data;
        let idCardBehind = null,
          idCardFront = null,
          driverLicensePic = null,
          truckLicensePic = null,
          truckPicOne = null,
          truckPicTwo = null;
        let idCardBehindNew = null,
          idCardFrontNew = null,
          driverLicensePicNew = null,
          truckLicensePicNew = null,
          truckPicOneNew = null,
          truckPicTwoNew = null;
        if (data.idCardBehind != '') {
          idCardBehind = app.globalData.picUrl + data.idCardBehind + app.globalData.ossXJ;
          idCardBehindNew = app.globalData.picUrl + data.idCardBehind;
        }
        if (data.idCardFront != '') {
          idCardFront = app.globalData.picUrl + data.idCardFront + app.globalData.ossXJ;
          idCardFrontNew = app.globalData.picUrl + data.idCardFront;
        }
        if (data.driverLicensePic != '') {
          driverLicensePic = app.globalData.picUrl + data.driverLicensePic + app.globalData.ossXJ;
          driverLicensePicNew = app.globalData.picUrl + data.driverLicensePic;
        }
        if (data.truckLicensePic != '') {
          truckLicensePic = app.globalData.picUrl + data.truckLicensePic + app.globalData.ossXJ;
          truckLicensePicNew = app.globalData.picUrl + data.truckLicensePic;
        }
        if (data.truckPicOne != '') {
          truckPicOne = app.globalData.picUrl + data.truckPicOne + app.globalData.ossXJ;
          truckPicOneNew = app.globalData.picUrl + data.truckPicOne;
        }
        if (data.truckPicTwo != '') {
          truckPicTwo = app.globalData.picUrl + data.truckPicTwo + app.globalData.ossXJ;
          truckPicTwoNew = app.globalData.picUrl + data.truckPicTwo;
        }
        _this.setData({
          myInfoFun: data,
          idCardBehind: idCardBehind,
          idCardFront: idCardFront,
          driverLicensePic: driverLicensePic,
          truckLicensePic: truckLicensePic,
          truckPicOne: truckPicOne,
          truckPicTwo: truckPicTwo,

          idCardBehindNew: idCardBehindNew,
          idCardFrontNew: idCardFrontNew,
          driverLicensePicNew: driverLicensePicNew,
          truckLicensePicNew: truckLicensePicNew,
          truckPicOneNew: truckPicOneNew,
          truckPicTwoNew: truckPicTwoNew
        })
      }
    });
  }
})