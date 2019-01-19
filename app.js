//app.js
App({
  onLaunch: function() {

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            updateManager.applyUpdate()  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          }
        }
      })

    })
    updateManager.onUpdateFailed(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    var that = this
    if (that.globalData.appid){
      wx.request({
        url: that.globalData.serverUrl + '/appinfo/detail/' + that.globalData.appid,
        method: 'get',
        success: function (res) {
          if (res.data.data) {
            that.globalData.appSet = res.data.data
          }
        }
      })
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.globalData.userInfo = res.userInfo // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              that.globalData.rawData = res.rawData
              that.globalData.name = res.userInfo.nickName
              that.globalData.signature = res.signature
              that.globalData.encryptedData = res.encryptedData
              that.globalData.iv = res.iv
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    wx.getStorage({
      key: 'sijiAppToken',
      success: function(res) {
        that.globalData.sijiAppToken = res.data
      },
      fail: function() {}
    })
  },

  onShow: function() {
    var pages = getCurrentPages() //获取加载的页面
    if (pages && pages.length>0) {
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      var url = currentPage.route //当前页面url
      if (url != 'pages/logs/logs') {
        var that = this;
        wx.getLocation({
          type: 'gcj02', ///gcj02wgs84
          success: function(res) {
            var latitude = res.latitude
            var longitude = res.longitude
            wx.request({
              url: that.globalData.serverUrl + 'driverUser/sign', 
              data: {
                latitude: latitude,
                longitude: longitude
              },
              method: 'POST',
              header: {
                'content-type': 'application/json',
                'siji-app-token': that.globalData.sijiAppToken
              },
              success: function(res) {
            
              }
            })
          },
          fail: function(err) {
            
          }
        })
      }
    }
  },
  globalData: {
    appid: '',
    appSet:{
      displayName:'货速运司机端',
      logoUrl:'../../images/logo-img.png',
      technicalSupport:'杭州领华科技有限公司',
      indexImageUrl: '../../images/nav.png'
    },
    // serverUrl: 'http://47.98.107.83:18502/',//演示
    // serverUrl: 'https://siji.xcx.56linker.com/',//线上
    serverUrl: 'http://10.0.0.123:18502/',//测试
    // serverUrl: 'http://10.0.0.111:8671/',//演示
    // serverUrl: 'http://10.0.0.123:18502/',
    userInfo: {
    },
    picUrl: 'https://wuliu-yw-tms-test.file.56linker.com/',//演示 测试/
    // picUrl: 'https://wuliu-yw-tms.file.56linker.com/',//线上
    ossXJ: '?x-oss-process=image/resize,m_fill,h_200,w_200',
    rawData: '',
    name: '',
    signature: '',
    encryptedData: '',
    iv: '',
    sijiAppToken: '',

    //在token失效后调整登陆页标记，如果已跳转，其他请求在token失效时就不需要在跳转了。
    directLoginPageFlag: false
  }
})