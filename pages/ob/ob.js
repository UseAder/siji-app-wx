const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    tabs: [{
        current: '',
        name: '全部'
      },
      {
        current: 1,
        name: '待发车'
      },
      {
        current: 5,
        name: '运输中'
      },
      {
        current: 10,
        name: '已完成'
      }
    ],
    activeIndex: 0,
    records: {},
    current: '', //tab部分
    pageNo: 1,
    hasMoreData: false
  },
  handleChange(e) { //tab部分
    this.setData({
      pageNo: 1,
      current: e.currentTarget.dataset.id,
      activeIndex: e.currentTarget.dataset.id

    });
    this.loadData();
  },
  yushuzhong(e) {
    wx.navigateTo({
      url: '../order/order?id=' + e.currentTarget.dataset.id
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      pageNo: 1,
    })
    that.loadData();
  },
  onReachBottom: function() {
    if (this.data.hasMoreData) {
      this.loadData()
    } else {
      wx.showToast({
        title: '没有更多数据了',
        duration: 1000
      })
    }
  },
  loadData: function() {
    var that = this;
    util.listOrderFun({
        data: {
          status: this.data.current,
          pageNo: this.data.pageNo
        },
        header: {
          'content-type': 'application/json',
          'siji-app-token': app.globalData.sijiAppToken
        }
      }, function(err, res) {
        var recordslistTem = that.data.records
        var recordslist = res.data.records
        if (that.data.pageNo == 1) {
          recordslistTem = []
        }
        if (that.data.pageNo >= res.data.totalPage) {
          that.setData({
            records: recordslistTem.concat(recordslist),
            hasMoreData: false,
          })
        } else {
          that.setData({
            records: recordslistTem.concat(recordslist),
            hasMoreData: true,
            pageNo: that.data.pageNo + 1,
          })
        }
      },
      function(res) {
        wx.stopPullDownRefresh()
      });
  },
  onShow: function (options) {

    this.setData({
      pageNo: 1
    })  
    this.loadData();
  }
})