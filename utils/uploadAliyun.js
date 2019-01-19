const app = getApp()

const uploadFile = function (accessId, policy, signature, host ,filePath, dir, successc, failc) {
  let lastiIndex = filePath.lastIndexOf('/');
  const aliyunFileKey = dir + filePath.substring(lastiIndex+1);

  wx.uploadFile({
    url: host,
    filePath: filePath,
    name: 'file',//必须填file
    formData: {
      'key': aliyunFileKey,
      'policy': policy,
      'OSSAccessKeyId': accessId,
      'signature': signature,
      'success_action_status': '200',
    },
    success: function (res) {
      if (res.statusCode != 200) {
        failc(new Error('上传错误:' + JSON.stringify(res)))
        return;
      }
      successc(aliyunFileKey);
    },
    fail: function (err) {
      wx.showToast({
        title: '上传文件失败' + err.errMsg,
        icon: 'none',
        duration: 2000
      })
      failc(err);
    },
  })
}

module.exports = uploadFile;
