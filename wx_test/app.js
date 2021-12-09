//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    questionList: [
      {
        type:"判断",
        title:"马克思主义理论体系",
        answer:"A"
      },
      {
        type:"判断",
        title:"邓小平理论",
        answer:"B"
      },   {
        type:"判断",
        title:"毛泽东思想",
        answer:"A",
      },   {
        type:"判断",
        title:"中国社会主义理论体系",
        answer:"A"
      },   {
        type:"判断",
        title:"三个代表重要思想",
        answer:"A"
      },
      {
        type:"单选",
        title:'狭义的马克思主义是指:',
        answer:"A",
        answer_A:"马克思恩格斯创立的基本理论",
        answer_B:"列宁主义",
        answer_C:"毛泽东思想",
        answer_D:"邓小平理论"
      },
      {
        type:"单选",
        title:'第一次工业革命的内容是',
        answer:"A",
        answer_A:"机器大工业取代工厂手工业",
        answer_B:"提高社会劳动生产率",
        answer_C:"促进资本主义社会生产力的发展",
        answer_D:"推动资本主义进入新的阶段"
      },
      {
        type:"简答",
        title:"马克思主义最重要的理论体系",
        answer:"坚持一切从实际触发，理论联系实际，实事求是，在实践中检验和发展真理"
      },
      {
        type:"多选",
        title:"英国资产阶级古典政治经济学的主要代表人物",
        answer:"A,B",
        answer_A:"亚当.斯密",
        answer_B:"大卫.李嘉图",
        answer_C:"马尔萨斯",
        answer_D:"西斯蒙第",
        answer_E:"蒙戈齐夫斯基"
      }
    ]
  }
})