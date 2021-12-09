Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatar: "",
    nick:"",
    userinfo: wx.getStorageSync('userinfo')||{},
    menuitems: [
      {
        text: '意见反馈',
        url: '/pages/myinfo/feedback/feedbook',
        icon: '/images/yijianfankui.png',
      },
      // {
      //   text: '打赏',
      //   url: '/pages/myinfo/dashang/dashang',
      //   icon: '/images/dashang.png',
      // },
      {
        text: '信息管理',
        url: '/pages/myinfo/logs/logs',
        icon: '/images/rizhi.png',
      },
      {
        text: '加入我们',
        url: '/pages/myinfo/guanyu/guanyu',
        icon: '/images/guanyuwomen.png',
      }
    ]
  },
  onLoad(){
 
  },
  onShow(){
    let userinfo =  wx.getStorageSync('userinfo')||{};
    let nick =  wx.getStorageSync('nick')||""
    this.setData({
      userinfo,
      nick
     })
  },
  // 退出登录
  handleQuit(){
    wx.setStorageSync('sessionToken', "");
    wx.setStorageSync('nick', "");
    wx.setStorageSync('userinfo','')
     wx.navigateTo({
       url: '/pages/login/login',
     })
  },
  //
  gotoLogin(){
    wx.setStorageSync('sessionToken', "");
    wx.setStorageSync('nick', "");
     wx.navigateTo({
       url: '/pages/login/login',
     })
  },
  //使用微信登录
  toLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
    // var that = this
    // var openid = "";
    // var uid = 0;
    // var name = "";
    // var mytouxiang = "";
    // var city = "";
    // var province = ""
    // //获取用户信息
    // // console.log("ccc")
    // wx.getUserInfo({
    //   success: function (res) {
    //     console.log("用户信息",res.userInfo)
    //     name = res.userInfo.nickName;
    //     mytouxiang = res.userInfo.avatarUrl
    //     city = res.userInfo.city,
    //     province = res.userInfo.province;
    //     let userinfo = {};
    //     userinfo.nickName = res.userInfo.nickName;
    //     userinfo.avatar = res.userInfo.avatarUrl;
    //     wx.setStorageSync('userinfo',userinfo);
    //     that.setData({
    //       userinfo,
    //     })
    //     wx.setStorageSync('uid', '111')
    //   }
    // })
    // return;
    //获取到用户的openid
    wx.login({
      success(res){
        console.log('res', res.code)
      
        缓存返回过来的用户信息
        let userinfo = {name:'nick'};
       
        return;

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://xlyt.zlzyy.club:444/API/wxapi.asmx/OpenID',
          method: "POST",
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
          success: function(res) {
            console.log('openid', res.data)
            return ;
            var openid = res.data
            console.log("name:",name)
            wx.request({
              url: 'https://xlyt.zlzyy.club:444/API/get_userinfo.aspx',
              data: {
                openid: openid,
                nickName: name,
                avatarUrl: mytouxiang,
                city: city,
                province: province
              },
              success: function(res) {
                console.log("返回过来的值", res.data[0])
                that.setData({
                  userinfo:res.data[0]
                })
                wx.setStorageSync('uid', res.data[0].uid)
                //缓存返回过来的用户信息
                wx.setStorageSync('userinfo', res.data[0])

              }
            })
          }

        })
        // wx.setStorageSync('userInfo', res1.data.data)
        //
      },
    })

  }
})