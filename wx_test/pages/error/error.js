// pages/error/error.js

import {
  QueryQuestion
} from '../../network/topic'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleQueryQuestions()
  },
  handleTo(e){
    console.log(e);
    let {name} = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/errordetail/errordetail?name="+name,
    })
    //  let name = e.curre
  },
  handleQueryQuestions() {
    wx.showLoading({
      title: 'Loading...',
    })
    QueryQuestion({
      order: "createdAt",
      limit: 20,
      skip: 0,
      where: `{"name":{"$in":["试题"]}}`
    }).then(res => {
      console.log("query", res);
      let list = [];
      res.data.results.forEach(element => {
        list.push(element.basedata.name)
      });
      this.setData({
        list
      })
      wx.hideLoading()
    }).catch(err => {
      // console.log("err", err);
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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