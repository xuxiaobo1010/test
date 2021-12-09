// pages/intruction/intruction.js
import {
  QueryQuestion,
} from '../../network/topic'
Page({

  /**
   * 页面的初始数据
   */
  data: {
     questionList: [],
      answersList:[],
      singlelength: "",
      multiplelength: "",
      judgelength: "",
      materiallength: "",
      testName:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id,
      cont: options.cont
    })
    //用uid判断用户是否登录
    if (!wx.getStorageSync('sessionToken')) {
      wx.showModal({
        title: '提示',
        content: '亲，您还没有登录哦!',
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    this.handleQueryQuestions(options.id, options.cont);
    return;
  },
 //获取所有试卷筛选出随机数量的考试题目
 handleQueryQuestions(id, cont) {
  wx.showLoading({
    title: 'Loading...',
  })
  QueryQuestion({
    order: "createdAt",
    limit: 20,
    skip: 0,
    where: '{"name":{"$in":["试题"]}}'
  }).then(res => {
    let list = [];
    let testName = "";
    console.log("query", res);
    res.data.results.forEach(element => {
      if (element.product.objectId == id) {
        list = element.basedata.question;
        testName = element.basedata.name
        return;
      }
    })
    console.log("list", list);
    let singleQuestion = []; //单选
    let multipleQuestion = [] //多选
    let judgeQuestion = [] //判断
    let materialQuestion = [] //材料
    list.forEach(item => {
      if (item.type == "单选题") {
        singleQuestion.push(item)
      } else if (item.type == "多选题") {
        multipleQuestion.push(item)
      } else if (item.type == "判断题") {
        judgeQuestion.push(item)
      } else if (item.type == "材料题") {
        materialQuestion.push(item)
      }
    })
    console.log(singleQuestion.length, multipleQuestion.length, judgeQuestion.length);
    this.setData({
      total:list.length, //总数
      singlelength: singleQuestion.length, //单选
      multiplelength:multipleQuestion.length, //多选
      judgelength: judgeQuestion.length, //判断
      materiallength: materialQuestion.length, //材料
      testName
    })
    wx.hideLoading()
    return;
    
  }).catch(err => {
    console.log("err", err);
  })
},
handToTest(e){
  console.log(e);
  let {id,cont} = e.currentTarget.dataset;
  ///pages/index/test/test?bank_id=1&id='+id+'&cont='+cont
  wx.navigateTo({
   url: '/pages/index/test/test?bank_id=1&id='+id+'&cont='+cont,
 })
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


})