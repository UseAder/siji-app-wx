var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    NewName: false,
    name: '',
    account: '',
    idCard: '',
    plateNumbe: '',
    truckModel: '',
    driverLicense: '',
    truckLicense: '',
    truckModelTrue:false
  },
  name: function(e) { //获取input输入的值
    var that = this;
    that.setData({
      NewName: false,
      name: e.detail.value
    })
  },
  truckModel: function(e) { //获取input输入的值
    var that = this;
    that.setData({
      truckModel: e.detail.value
    })
    var truckModelRegex = /^[\u4E00-\u9FFF]+$/; //车型
    if (!truckModelRegex.test(this.data.truckModel)) {
      wx.showToast({
        title: '请输入正确的车型',
        icon: 'none',
        duration: 1000
      })
      return false;
    }else{
      that.setData({
        truckModelTrue:true
      })
    }
  },
  idCard: function(e) { //获取input输入的值
    var that = this;
    that.setData({
      idCard: e.detail.value
    })
  },
  plateNumbe: function(e) { //获取input输入的值
    var that = this;
    that.setData({
      plateNumbe: e.detail.value
    })
  },

  driverLicense: function(e) { //获取input输入的值
    var that = this;
    that.setData({
      driverLicense: e.detail.value
    })
  },
  truckLicense: function(e) { //获取input输入的值
    var that = this;
    that.setData({
      truckLicense: e.detail.value
    })
  },
  showTopTips: function() {
    var _this = this;

  
    var idCardRegex = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
    var plateNumbeRegex = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{4}[a-zA-Z_0-9_\u4e00-\u9fa5]$/; //车牌号
    if (!idCardRegex.test(_this.data.idCard)) {
      wx.showToast({
        title: '请输入正确的身份证',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!plateNumbeRegex.test(_this.data.plateNumbe)) {
      wx.showToast({
        title: '请输入正确的车牌号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    util.showTopTipsFun({
      data: {
        name: _this.data.name,
        idCard: _this.data.idCard,
        plateNumbe: _this.data.plateNumbe,
        truckModel: _this.data.truckModel,
        driverLicense: _this.data.driverLicense,
        truckLicense: _this.data.truckLicense
      },
      header: {
        'content-type': 'application/json', // 默认值
        'siji-app-token': app.globalData.sijiAppToken
      }
    }, function(err, res) {
      if (res.data.code == "400") {
        wx.showToast({
          title: "信息修改不允许传空值",
          icon: 'none',
          duration: 2000
        })
      }
      if (res.data.code == "200") {
        wx.showToast({
          title: "您已成功修改个人信息",
          icon: 'none',
          duration: 2000,
          success: function(res) {
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)

          }
        })
      }
    });
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
        if (res.data.data.name == '') {
          if (app.globalData.userInfo.nickName) {
            _this.setData({
              name: app.globalData.userInfo.nickName,
            })
          } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
              success: res => {
                app.globalData.userInfo = res.userInfo
                _this.setData({
                  name: app.globalData.userInfo.nickName
                })
              }
            })
          }
        } else {
          _this.setData({
            name: res.data.data.name,
          })
        }
        _this.setData({

          account: res.data.data.account,
          idCard: res.data.data.idCard,
          plateNumbe: res.data.data.plateNumbe,
          truckModel: res.data.data.truckModel,
          driverLicense: res.data.data.driverLicense,
          truckLicense: res.data.data.truckLicense
        })
      }
    });
  }

});