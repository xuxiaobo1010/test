const request = function (obj) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: obj.url,
      dataType: obj.dataType || 'json',
      method: obj.method || 'GET',
      header: obj.header||{
        'content-type': 'application/json',
        'sessionToken':wx.getStorageSync('sessionToken')||''
        // 'content-type': 'text/plain' // 默认值
      },
      data: obj.data,
      success: function (res) {
        // console.log("res=>",res);
        if (res.statusCode == 200 ||res.statusCode == 201) {
          // console.log("res=>",res);
            resolve(res);
        }else if(res.statusCode==401 &&res.data.code==209){
          console.log("401,209",res);
          // wx.clearStorageSync()
          wx.setStorageSync('sessionToken', '')
          wx.showToast({
            title: '登录已经失效，请重新登录',
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '/pages/login/login',
            })
          },1500)
          // reject(res)
        }else{
          reject(res)
        }
      },
      fail: function (err) {
        reject(err)
      },
    })
  })
}
module.exports = {
  request,
}