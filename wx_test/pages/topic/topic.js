// pages/topic/topic.js
import {
  CreateQuestion,
  QueryQuestion
} from '../../network/topic'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    currentIndex:0,
    flag:true
  },
  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
     
      }
    })
  },
  showContent(e){
   console.log(e);
   let {index} = e.currentTarget.dataset;
   this.setData({
    currentIndex:index
   })
  },
  bindtoTest(){
    wx.switchTab({
      url: '/pages/test/test',
    })
  },
  handleTo(e){
   console.log(e);
   let {id,cont} = e.currentTarget.dataset;
   wx.navigateTo({
    url: '/pages/index/exam/exam?bank_id=1&id='+id+'&cont='+cont,
  })
  },
  handletoErrDetail(e){
    let {name} = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/errordetail/errordetail?name="+name,
    })
  },
  handleToTest(e){
    console.log(e);
    let {id,cont} = e.currentTarget.dataset;
    ///pages/index/test/test?bank_id=1&id='+id+'&cont='+cont
    wx.navigateTo({
     url: '/pages/intruction/intruction?bank_id=1&id='+id+'&cont='+cont,
   })
  },
  //添加题库
  handleAddQuestions() {
    CreateQuestion({
      "name": "试题",
      "devaddr": "试题",
      "product": {
        "__type": "Pointer",
        "className": "Product",
        "objectId": "1234567890"
      },
      "basedata": {
        "name":"真题卷4",
        "question": [
            {
                "Question": "[单选]从事建筑活动的专业技术人员，应当（ ）从事建筑活动。\n",
                "type": "单选题",
                "A": "依法取得相应的执业资格证书，但可在执业资格证书许可的范围外",
                "B": "依法取得相应的执业资格证书，并在执业资格证书许可的范围内",
                "C": "不必取得执业资格证书",
                "D": "依法取得相应的职业资格证书，但可在执业资格证书许可的范围外",
                "Answer": "B",
                "difficulty": "困难"
            },
            {
              "content":"从事建筑活动的专业技术人员，应当（ ）从事建筑活动。\n",
              "type": "材料题",
              "quesiton":[
                {
                "question":"[单选]从事建筑活动的专业技术人员，应当（ ）从事建筑活动。\n",
                "type": "单选题",
                "A": "依法取得相应的执业资格证书，但可在执业资格证书许可的范围外",
                "B": "依法取得相应的执业资格证书，并在执业资格证书许可的范围内",
                "C": "不必取得执业资格证书",
                "D": "依法取得相应的职业资格证书，但可在执业资格证书许可的范围外",
                "Answer": "B",
                "difficulty": "困难"
              },{
                "question":"[单选]从事建筑活动的专业技术人员，应当（ ）从事建筑活动。\n",
                "type": "单选题",
                "A": "依法取得相应的执业资格证书，但可在执业资格证书许可的范围外",
                "B": "依法取得相应的执业资格证书，并在执业资格证书许可的范围内",
                "C": "不必取得执业资格证书",
                "D": "依法取得相应的职业资格证书，但可在执业资格证书许可的范围外",
                "Answer": "B",
                "difficulty": "困难"
              },{
                "question":"[单选]从事建筑活动的专业技术人员，应当（ ）从事建筑活动。\n",
                "type": "多选题",
                "A": "依法取得相应的执业资格证书，但可在执业资格证书许可的范围外",
                "B": "依法取得相应的执业资格证书，并在执业资格证书许可的范围内",
                "C": "不必取得执业资格证书",
                "D": "依法取得相应的职业资格证书，但可在执业资格证书许可的范围外",
                "Answer": "AB",
                "difficulty": "困难"
              },
              ]}
           
      ]
      }


    }).then(res => {
      console.log("create", res);

    }).catch(err => {
      console.log("err", err);

    })
  },
  handleToQueryCollection(){
        //跳转收藏页面
    wx.navigateTo({
      url: '/pages/index/store/store',
    })
  },
  handleQueryQuestions() {
    if(this.data.flag){
      wx.showLoading({
        title: 'Loading...',
      })
    }
    QueryQuestion({
      order: "createdAt",
      // limit: 20,
      skip: 0,
      where: '{"name":{"$in":["试题"]}}'
    }).then(res => {
      console.log("query", res);
      res.data.results.forEach(element => {
        element.isShow=false;
      });
      this.setData({
        list: res.data.results
      })
     if(this.data.flag){
      wx.hideLoading()
      this.setData({
        flag:false
      })
     }
    }).catch(err => {
      console.log("err", err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.handleQueryQuestions()
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if(this.data.list.length==0){
   this.handleQueryQuestions()
    // }
   
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },



})