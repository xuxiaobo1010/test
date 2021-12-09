// pages/detail/detail.js
import {
  CreateQuestion,
  QueryQuestion
} from '../../network/topic'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectId:"",
    test:{},
    total:0,
    grade:0,
    errLength:0,
    notAnsLength:0,
    correct:0,
  },
  handleToIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //秒数转为时分秒
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
  handleQueryQuestions(objectId) {
    let name = wx.getStorageSync('username');
    name = `t${name}t`
    wx.showLoading({
      title: 'Loading...',
    })
    
    QueryQuestion({
      order: "createdAt",
      limit: 20,
      skip: 0,
      where: `{"name":{"$in":["${name}"]}}`
    }).then(res => {
      console.log("query", res);
      let test = {}
      res.data.results.forEach(element => {
        element.isShow=false;
        if(element.objectId ==objectId){
          test=element;
          if(element.basedata.Comptime!=undefined){
            let ctime =  this.GetMHS(element.basedata.Comptime);
             element.basedata.Comptime =ctime
          }
          return;
        }
      });
      let total = test.basedata.questions.length;
      let grade = test.basedata.grade;
      let errLength = test.basedata.errquestions.length;
      let correct = test.basedata.correct;
      let notAnsLength = total-errLength-correct
      this.setData({
        total,
        grade,
        correct,
        errLength,
        notAnsLength,
        test
      })
      wx.hideLoading()
    }).catch(err => {
      console.log("err", err);
    })
  },
  handleTo(e){
    console.log(e);
    let {id,cont} = e.currentTarget.dataset;
    wx.navigateTo({
     url: '/pages/index/exam/exam?bank_id=1&id='+id+'&cont='+cont,
   })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    
    let objectId = options.objectid
    console.log(objectId);
    this.setData({
      objectId
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let objectId = this.data.objectId; 
    this.handleQueryQuestions(objectId)
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