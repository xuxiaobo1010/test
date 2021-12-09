import{
  ChangeUserInfo
} from "../../../network/user"
Page({
  data: {
    newsList: [{
      "desc": "“杏林有题”开始启动",
      "time": "2019-5-26",
    }, {
        "desc": "“杏林有题”完成v1.0.0基础版本,使用者可使用其进行‘毛概’答题，功能包括，顺序答题、专题答题、章节答题、收藏题和查看错题等",
      "time": "2019-6-6",
      }, {
        "desc": "修改因非open-type=‘getUserInfo’获取不到用户信息的原因",
        "time": "2019-6-7",
      }, ,{
        "desc": "修改错误页面bug,并添加简答题答案",
        "time": "2019-6-18",
      }] ,
      mNick:"",
      mPhone:"",
      // mEmail:"225865676@qq.com",
      show:0,
     
  },
  onLoad(options) {
    let mNick =  wx.getStorageSync('nick')||"";
    let mPhone = wx.getStorageSync('mPhone')||"";
    // let mEmail = wx.getStorageSync('mEmail')||"";
    this.setData({
      mNick,
      mPhone,
      // mEmail
    })
  },
  inputTilte1: function (e) {
    let that = this;
    that.setData({
      mNick:e.detail.value
    })
  },
  inputTilte2: function (e) {
    let that = this;
    that.setData({
      mPhone:e.detail.value
    })
    
  },
  onSaveUser(){
    let that = this;
    if (that.data.mNick.trim().length == 0) {
      that.anniu("请输入姓名");
      return;
    }
    if (that.data.mPhone.trim().length != 11) {
      that.anniu("请输入手机号");
      return;
    }
    // if (that.data.mEmail.trim().length == 0) {
    //   that.anniu("请输入邮箱");
    //   return;
    // }
    // if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(that.data.mEmail))){
    //   that.anniu("请输入正确邮箱格式");
    //   return
    //   }
      let id = wx.getStorageSync('objectId');
      let username = wx.getStorageSync('username');
      let data={
        nick:that.data.mNick,
        phone:that.data.mPhone,
        username
      }
      

      ChangeUserInfo(id,data).then(res=>{
        wx.showToast({
          title: '修改成功!',
        })
        
      }).catch(err=>{
        wx.showToast({
          title: '修改失败',
          icon:"error"
        })
      })

  },
  /**
   * 显示错误信息
   */
  anniu(e){
    if (!this.data.show) {
      console.log(111);
      
      let that = this;
      this.setData({
        show: 1,
        showMsg: e,
      })
      setTimeout(function () {
        that.setData({
          show: 0
        })
      }, 2000)
    }
  },

})