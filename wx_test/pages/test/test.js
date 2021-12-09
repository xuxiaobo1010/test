// pages/test/test.js
import {
  CreateQuestion,
  QueryQuestion
} from '../../network/topic'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    nick:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //  let nick = wx.getStorageSync('nick') ||"";
      //  this.setData({
      //   nick
      //  })
  },
  //世界时间转为北京时间
  utc2beijing(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
      .toISOString()
      .replace(/T/g, ' ')
      .replace(/\.[\d]{3}Z/, '')
    return date // 2017-03-31 16:02:06
  },
    //秒数转化成小时、分钟、秒数
    GetMHS(seconds) {
      let h = 0
      let m = 0
      let s = 0
      h = seconds / 3600;
      if (h.toString().indexOf(".") != -1) {
        h = parseInt(h);
      }
      var mt = seconds % 3600; //分钟
      m = mt / 60;
      if (m.toString().indexOf(".") != -1)
        m = parseInt(m);
      s = mt % 60;
      let restime = this.FormatTime(h) + ":" + this.FormatTime(m) + ":" + this.FormatTime(s);
      return restime;
    },
    FormatTime(t) {
      if (t < 10)
        return "0" + t;
      return t;
    },
  handleQueryQuestions() {
    let name = wx.getStorageSync('username');
    name = `t${name}t`
    wx.showLoading({
      title: 'Loading...',
    })
    
    QueryQuestion({
      order: "-createdAt",
      limit: 30,
      skip: 0,
      where: `{"name":{"$in":["${name}"]}}`
    }).then(res => {
      console.log("query", res);
      res.data.results.forEach(element => {
        element.isShow=false;
        // let time =  element.createdAt.split("T");
        // element.createdAt = time[0];
       let time1 =  this.utc2beijing(element.createdAt)
      //  console.log(time1);
       element.createdAt =time1;
       if(element.basedata.Comptime!=undefined){
        let ctime =  this.GetMHS(element.basedata.Comptime);
        element.basedata.Comptime =ctime
       }
      
      });
    //  let   list =  res.data.results.reverse();
    let   list =  res.data.results;
      this.setData({
        list,
      })
      wx.hideLoading()
    }).catch(err => {
      console.log("err", err);
    })
  },
  handleToDetail(e){
    console.log(e);
    
    let objectid = e.currentTarget.dataset.objectid;
    wx.navigateTo({
      url: '/pages/detail/detail?objectid='+objectid,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let nick = wx.getStorageSync('nick') ||"";
    this.setData({
     nick
    })
   this.handleQueryQuestions()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})