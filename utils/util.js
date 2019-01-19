const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//GET请求

function orderDetailsFun(paraData, cb) { //// 订单详情
  requestGetApi('order/detail/' + paraData.id, cb, paraData.header)
}
function detailsOfTheWaybillFun(paraData, cb) { //// 运单详情
  requestGetApi('order/waybill/detail/' + paraData.id, cb, paraData.header)
}
function myInfoFun(paraData, cb) { //// 个人信息
  requestGetApi('/driverUser/detail', cb, paraData.header,)
} 

//POST请求
function codeFun(paraData, cb) { //// 调用登录接口获取临时登录凭证（code）sijiAppToken
  requestPostApi('login/wx/token',paraData, cb)
}
function signInFun(paraData, cb,FALSE) { //// 首页签到
  requestPostApi('driverUser/sign', paraData, cb, FALSE)
}
function showTopTipsFun(paraData, cb) { //// 修改个人信息
  requestPostApi('driverUser/update', paraData, cb)
}
function normalReceiptFun(paraData, cb) { ////签收
  requestPostApi('order/waybill/sign', paraData, cb)
}
function receiptFun(paraData, cb) { //// 接单
  requestPostApi('order/transport', paraData, cb)
}
function saveFun(paraData, cb) { //登入
  requestPostApi('login/wx/bind/phone', paraData, cb)
}
function obtainYzmFun(paraData, cb) { //获取验证码
  requestPostApi('mobile/vcode', paraData, cb)
}
function getPhoneNumberFun(paraData, cb) { //微信快捷登入
  requestPostApi('login/wx/quick', paraData, cb)
}
function listOrderFun(paraData, cb, completeCallback) { //// 订单列表
  requestPostApi('order/list', paraData, cb, completeCallback)
}
function uploadFileFun(paraData, cb,FALSE) { //OSS图片上传
  requestPostApi('file/oss/sign/policy', paraData, cb, null, FALSE)
}
function perPhotoFun(paraData, cb, FALSE) { ////  //向服务器保存最新图片路径
  requestPostApi('driverUser/update/picture', paraData, cb,null, FALSE)
}
function notSignedFun(paraData, cb) { //未签收列表
  requestPostApi('order/waybill/list', paraData, cb)
}

function picUpdateFun(paraData, cb) { //
  requestPostApi('order/waybill/pic/update', paraData, cb)
}
function requestPostApi(ApiName, PostData, cb, completeCallback, isShowLoading) {
  if (isShowLoading){
  }else{
    wx.showLoading({
      title: '数据加载中',
    })
  }
  wx.request({
    url: app.globalData.serverUrl + ApiName,
    data: PostData.data,
    method: 'POST',
    header: PostData.header,
    success: function(res) {
      // console.log(res)
    
      if (isShowLoading) {
      } else {
        wx.hideLoading();

      }
      if (res.data.code == '200') {
        typeof cb == "function" && cb(null, res)
      } else if (res.data.code == 'SOCIALACCOUNT_NOT_EXIST' || res.data.code == 'TOKEN_WRONG' || res.data.code == 'WX_TOKEN_NOT_EXIST' || res.data.code == 'TOKEN_OUT_TIME') {
        if (app.globalData.sijiAppToken == PostData.header['siji-app-token'] 
          && !app.globalData.directLoginPageFlag) {
          app.globalData.directLoginPageFlag = true
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      } else if (res.data.code == '400'){
    
        typeof cb == "function" && cb(null, res)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function (res) {
      console.log(res)
      
      if (isShowLoading) {
      } else {
        wx.hideLoading();

      }
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 4000
      })
    },
    complete: function (res) {
     
      typeof completeCallback == "function" && completeCallback(res)
    } 
  })
}

function requestGetApi(ApiName, cb, headers, completeCallback) {
  wx.showLoading({
    title: '数据加载中',
  })
  wx.request({
    url: app.globalData.serverUrl + ApiName,
    header:headers,
    success: function(res) {
      wx.hideLoading();
      if (res.data.code == '200') {
        typeof cb == "function" && cb(null, res)
      } 
      else if (res.data.code == 'SOCIALACCOUNT_NOT_EXIST' || res.data.code == 'TOKEN_WRONG' || res.data.code == 'WX_TOKEN_NOT_EXIST' || res.data.code == 'TOKEN_OUT_TIME') {

        if (app.globalData.sijiAppToken ==headers['siji-app-token']
          && !app.globalData.directLoginPageFlag) {
          app.globalData.directLoginPageFlag = true
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      } 
      else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function (res) {
      console.log(res)
      wx.hideLoading();
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 4000
      })
    },
    complete: function(res) {
      typeof completeCallback == "function" && completeCallback(res)
    } 
  })
}

module.exports = {
  formatTime: formatTime,
  saveFun,
  obtainYzmFun,
  getPhoneNumberFun,
  codeFun,
  listOrderFun,
  orderDetailsFun,
  detailsOfTheWaybillFun,
  receiptFun,
  normalReceiptFun,
  myInfoFun,
  showTopTipsFun,
  signInFun,
  uploadFileFun,
  perPhotoFun,
  notSignedFun,
  picUpdateFun
}