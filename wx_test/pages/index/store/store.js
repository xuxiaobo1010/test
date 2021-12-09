import {
  // CreateQuestion,
  QueryQuestion,
  updateDevice
} from '../../../network/topic'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeNum:0,
    question: [],
    store: false,
    myChecked: 0,
    scrollTop: 0,
    myCheckedJ: 0, //材料判断题
    mycheckedS: 0, //材料单选题
    mycheckedS1: 0,
    currentValue: null, //当前选择答案
    current: 0, //当前题号
    score: 0,
    id: '',
    questionList: [],
    nowQuestions: [],
    multiIndex: [{
      checked: false
    }, {
      checked: false
    }, {
      checked: false
    }, {
      checked: false
    }, {
      checked: false
    }],
    tmp: '',
    hidden: false,
    layerlayer: {
      isLayerShow: false, //默认弹窗
      layerAnimation: {}, //弹窗动画
    },
    isChooseShow: false,
    singlelength: 0,
    mullength: 0,
    judgelength: 0,
    materlength: 0

  },
  pageClick: function () {
    this.setData({
      isChooseShow: !this.data.isChooseShow
    })
  },
  closeSelect() {
    this.setData({
      isChooseShow: false
    })
  },
  selectType(e){
    // console.log(e);
    let id = e.currentTarget.dataset.id;
    this.setData({
      typeNum:id
    }) 
},
handleToQuestion(e) {
  console.log(e);
  let current = e.currentTarget.dataset.id;
  this.setData({
    scrollTop: this.data.scrollTop = 0
  })
  this.setData({
    current,
    isChooseShow: false,
    // store:true
  })
 
  // wx.setStorageSync(`c${this.data.id}`, current)
    this.setData({
      multiIndex: [{
        checked: false
      }, {
        checked: false
      }, {
        checked: false
      }, {
        checked: false
      }, {
        checked: false
      }],
      myChecked:0,
      myCheckedJ:0,
      myCheckedS:0,
      myCheckedS1:0,
    })
},
  getQueryQuestions() {
    let username = wx.getStorageSync('username');
    wx.showLoading({
      title: 'Loading...',
    })
    QueryQuestion({
      order: "createdAt",
      limit: 20,
      skip: 0,
      where: `{"name":{"$in":["${username}c"]}}`
    }).then(res => {
      let list = []
      wx.hideLoading()
      console.log("query", res);
      if (res.data.results.length > 0)
        list = res.data.results[0].basedata.questions;
      let list1 = []; //单选
      let list2 = []; //多选
      let list3 = []; //判断
      let list4 = []; //材料
      list.forEach(item => {
        if (item.type == "单选题") {
          list1.push(item)
        } else if (item.type == "多选题") {
          list2.push(item)
        } else if (item.type == "判断题") {
          list3.push(item)
        } else {
          list4.push(item)
        }
      })
      let questionList = [...list1, ...list2, ...list3, ...list4];
      // res.data.results.forEach(element => {
      //   if (element.product.objectId == id) {
      //     list = element.basedata.question;
      //     return;
      //   }
      // })
      this.setData({
        questionList,
        id: res.data.results[0].objectId,
        singlelength: list1.length,
        mullength: list2.length,
        judgelength: list3.length,
        materlength: list4.length
      })

    }).catch(err => {
      console.log("err", err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('sessionToken')) {
      wx.showModal({
        title: '提示',
        content: '亲，您还没有登录哦!',
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    this.getQueryQuestions();
    return;
    var that = this;
    wx.request({
      url: 'https://xlyt.zlzyy.club:444/API/collection_list.aspx',
      data: {
        uid: wx.getStorageSync('uid'),
        type: '收藏'
      },
      success: function (res) {
        if (res.data != "") {
          console.log("返回过来的值：", res.data)
          console.log(res.data.index)
          that.setData({
            questionList: res.data,
            hidden: false
          })
          setTimeout(function () {
            that.setData({
              hidden: true
            })
          }, 300)
        } else {
          wx.showModal({
            title: '提示',
            content: '亲,您还没有收藏哦',
            showCancel: false,
            confirmText: "确定",

          })
          wx.navigateBack()
        }

      }
    })

  },
  //实现收藏取消功能
  select_store: function () {
    let store = !this.data.store
    console.log(store);

    this.setData({
      store: store
    })
    let question = [];
    if (store) {
      //取消收藏
      if (this.data.question.length <= 0) {
        question = this.data.questionList.slice(0);
      } else {
        question = this.data.question.slice(0);
      }
      question.splice(this.data.current, 1);
      console.log(question);
      let id = this.data.id;
      let basedata = {
        name: '收藏试题',
        questions: []
      };
      basedata.questions = question;
      let data = {}
      data.basedata = basedata;
      updateDevice(id, data).then(res => {
        wx.showToast({
          title: '取消成功！',
        })
      })
      this.setData({
        questionList: question,
        store: false,
      })
      //更新取消收藏
    } else {
      //   //再次收藏
      //  question = this.data.question.slice(0);  
      // question.splice(this.data.current,0,this.data.questionList[this.data.current]);
      // console.log("question",question);
      // let id = this.data.id;
      // let basedata = {
      //   name:'收藏试题',
      //   questions:[]
      // };
      // basedata.questions=question;
      // let data = {
      // }
      // data.basedata = basedata;
      //  updateDevice(id,data)
      // this.setData({
      //   question
      //  })
    }
  },

  //单选和判断函数，选择选项函数
  selectItem(event) {
    console.log('event', event)
    var num = this.data.current;
    if (this.data.questionList[num].type == '单选题' || this.data.questionList[num].type == '判断题') {
      //type_id为1与0时则进行下列赋值(单选或判断)
      console.log("看看我有没有进入单选判断");
      console.log("类型：" + this.data.questionList[num].type);
      var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10。。。。

      this.setData({ //在data数据里更新myChecked的值和当前选择的值
        myChecked: selectId,
        currentValue: selectId
      })
    } else if (this.data.questionList[num].type == '多选题') {
      console.log("看看我有没有进入多选");
      console.log("类型：" + this.data.questionList[num].type);
      var index = event.currentTarget.dataset.index; //获取当前索引
      var selectId = parseInt(event.currentTarget.dataset.selectid); //获取当前选项id
      var multiIndex = this.data.multiIndex;
      multiIndex[index].checked = !multiIndex[index].checked; //单击取反
      if (multiIndex[index].checked) { //单击加减赋值
        this.setData({
          myChecked: this.data.myChecked + selectId
        })
      } else {
        this.setData({
          myChecked: this.data.myChecked - selectId
        })
      }
      this.setData({ //上传至视图层
        multiIndex: multiIndex,
        currentValue: selectId
      })

    } else if (this.data.questionList[num].type == "材料题") {
      let cindex = event.currentTarget.dataset.index;
      if (this.data.questionList[num].questions[cindex].type == '单选题' || this.data.questionList[num].questions[cindex].type == '判断题') {
        var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10。。
        if (cindex == 0 && this.data.questionList[num].questions[cindex].type == '单选题') {
          this.setData({
            myCheckedS: selectId
          })
        } else if (cindex == 1 && this.data.questionList[num].questions[cindex].type == '单选题') {
          this.setData({
            myCheckedS1: selectId
          })
        } else {
          this.setData({
            myCheckedJ: selectId
          })
        }
      } else if (this.data.questionList[num].questions[cindex].type == '多选题') {

        var index = event.currentTarget.dataset.index; //获取当前索引
        // console.log("index", index);
        var temp1 = event.detail.value //获取多选中的value
        // console.log("temp1", temp1);

        // var index = -1;

        var temp2 = 0 //初始
        console.log(temp1)
        let multiIndex = [{
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }];
        if (temp1.length != 0) {
          for (var i = 0, len = temp1.length; i < len; i++) {
            temp1[i] = parseInt(temp1[i])
            temp2 = temp2 + temp1[i]
            console.log("temp", temp2);
          }
          console.log("temp2", temp2);

          for (let index = 0; index < temp1.length; index++) {
            console.log(temp1[index]);

            if (temp1[index] == '1') {
              multiIndex[0].checked = true
            } else if (temp1[index] == '10') {
              multiIndex[1].checked = true
            } else if (temp1[index] == '100') {
              multiIndex[2].checked = true
            } else if (temp1[index] == '1000') {
              multiIndex[3].checked = true
            } else if (temp1[index] == '10000') {
              multiIndex[4].checked = true
            }

          }
          this.setData({ //在data数据里更新当前选择的值
            currentValue: temp2,
            // multiIndex: multiIndex,
          })
        }

        this.setData({
          multiIndex: multiIndex,
        })


      }
    }
  },
  //上一题on_question函数
  on_question() {
    //获得当前题号
    var num = this.data.current;
    //获得正确答案
    var correct = this.data.questionList[num].answer;

    //判断是否最后一题,解决最后一题无限加分问题
    if (this.data.current == 0) {
      //为最后一题时，值清零，
      this.setData({
        //多选值清零
        multiIndex: [{
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }],
        myChecked: 0,
        //当前选项值清0
        currentValue: 0,
        current: 0
      })
      //弹出结果框
      wx.showModal({
        title: '提示',
        content: '您当前为第一题，是否退出?',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: "/pages/index/index"
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.current > 0) {
      this.setData({
        //清零当前多选值
        multiIndex: [{
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }],
        current: this.data.current - 1,
        //选项圆点清0
        myChecked: 0,
        //当前选项值清0
        currentValue: 0,
        //收藏功能初始化
        store: false,


      })
      //获取更新后下一题current的值来更新当前题目
      // var current = this.data.current;
      // console.log("我想看看是哪个题号：", current)
      // // this.setData({
      // //   ////更新当前题目
      // //   questionList: this.data.questionList[current]
      // // })
      // console.log("当前题号为" + this.data.current + "对应的questionList为：");
      // console.log(this.data.questionList);

    }
  },
  // 下一题next_question函数
  next_question() {
    //判断正误
    //获得当前题号
    var num = this.data.current;
    //获得正确答案
    var correct = this.data.questionList[num].answer;
    // 将ABCD答案转换为数字
    var correctItem = 0;
    switch (correct) {
      case 'A':
        correctItem = 1
        break;
      case 'B':
        correctItem = 10
        break;
      case 'C':
        correctItem = 100
        break;
      case 'D':
        correctItem = 1000
        break;
      case 'E':
        correctItem = 10000
        break;
      case 'AB':
        correctItem = 11
        break;
      case 'AC':
        correctItem = 101
        break;
      case 'AD':
        correctItem = 1001
        break;
      case 'AE':
        correctItem = 10001
        break;
      case 'BC':
        correctItem = 110
        break;
      case 'BD':
        correctItem = 1010
        break;
      case 'BE':
        correctItem = 10010
        break;
      case 'CD':
        correctItem = 1100
        break;
      case 'CE':
        correctItem = 10100
        break;
      case 'DE':
        correctItem = 11000
        break;
      case 'ABC':
        correctItem = 111
        break;
      case 'ABD':
        correctItem = 1011
        break;
      case 'ABE':
        correctItem = 10011
        break;
      case 'BCD':
        correctItem = 1110
        break;
      case 'BCE':
        correctItem = 10110
        break;
      case 'CDE':
        correctItem = 11100
        break;
      case 'ABCD':
        correctItem = 1111
        break;
      case 'ABCE':
        correctItem = 10111
        break;
      case 'ABCDE':
        correctItem = 11111
        break;
    }
    //判断当前选择与答案是否相等
    if (this.data.currentValue === correctItem) {
      this.setData({
        //分数加2分
        score: this.data.score + 2

      })

    }
    console.log("我的得分：", this.data.score)
    //下标加1进入下一题
    //判断是否最后一题,解决最后一题无限加分问题
    if (this.data.current >= this.data.questionList.length - 1) {
      //为最后一题时，值清零，
      this.setData({
        //多选值清零
        multiIndex: [{
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }],
        myChecked: 0,
        //当前选项值清0
        currentValue: 0,
        current: 0
      })
      //弹出结果框
      wx.showModal({
        title: '阅览结束',
        content: '恭喜您,阅览结束',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/index/end/end"
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            wx.navigateTo({
              url: "/pages/index/index"
            })
            console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.current < this.data.questionList.length - 1) {
      this.setData({
        //清零当前多选值
        multiIndex: [{
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }],
        current: this.data.current + 1,
        //选项圆点清0
        myChecked: 0,
        //当前选项值清0
        currentValue: 0,
        //收藏功能初始化
        store: false,


      })
      //获取更新后下一题current的值来更新当前题目
      var current = this.data.current;
      console.log("我想看看是哪个题号：", current)
      // this.setData({
      //   ////更新当前题目
      //   questionList: this.data.questionList[current]
      // })
      console.log("当前题号为" + this.data.current + "对应的questionList为：");
      console.log(this.data.questionList);

    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})