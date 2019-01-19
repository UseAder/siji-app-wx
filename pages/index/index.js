const app = getApp()
Page({
  data: {},
  onShow: function() { //事件处理函数
    wx.checkSession({ //判断session_key 是否失效
      success: function () {   //session_key 未过期，并且在本生命周期一直有效
        if (app.globalData.sijiAppToken != '') {
          wx.switchTab({
            url: '../home/home'
          })
        } else {
          wx.redirectTo({
            url: '../logs/logs'
          })
        }
      },
      fail: function() {
        // session_key 已经失效，需要重新执行登录流程  wx.login() 重新登录 
        wx.redirectTo({
          url: '../logs/logs'
        })
      }
    })

    wx.setNavigationBarTitle({
      title: app.globalData.appSet.displayName
    })
  }
})