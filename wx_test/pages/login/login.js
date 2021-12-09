// pages/login/login.js
import{
  Login
} from "../../network/user"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    password:"",
    status:false,
    pwdStatus:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let loginStatus = wx.getStorageSync('loginStatus') || false;
    if(loginStatus){
      let username = wx.getStorageSync('username') ||""
      let password = wx.getStorageSync('password') ||""
      let status = true
      this.setData({
        username,
        password,
        status
      })
    }
  },
  //查看密码
  changePwdStatus(){
    this.setData({
      pwdStatus:!this.data.pwdStatus
    })
  },
  changestatus(){
    this.setData({
      status:!this.data.status
    })
    let flag = this.data.status;
    if(flag){
      wx.setStorageSync('loginStatus', true)
    }else{
      wx.setStorageSync('loginStatus', false)
    }
  },
  // 账号输入
  userNameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //密码输入
  userPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  handleLogin(){
    let username= this.data.username;
    let password = this.data.password;
    if(username!=""&&password!=""){
      wx.showLoading({
        title: 'Loading...',
      })
       Login({username,password}).then(res=>{
        //  console.log(res);
        wx.hideLoading()

         let {sessionToken} = res.data;
         let {userinfo} = res.data.tag;
         wx.setStorageSync('sessionToken', sessionToken);
         wx.setStorageSync('username', username);
         wx.setStorageSync('password', password)
         wx.setStorageSync('nick',res.data.nick);
         wx.setStorageSync('mEmail', res.data.email);
         wx.setStorageSync('mPhone', res.data.phone);
         wx.setStorageSync('objectId', res.data.objectId)
         wx.setStorageSync('userinfo', userinfo)
         wx.showToast({
           title: '登录成功！',
         })
         if(sessionToken){
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
          },1500)
         }
       }).catch(err=>{
        wx.hideLoading()
        wx.showToast({
          title: '登录失败！',
          icon:"error"
        })
       })
    }else{
      if(username==""){
        wx.showToast({
          title: '请输入身份证号',
          icon:"error",
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '请输入密码',
          icon:"error",
          duration: 2000
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
 
})