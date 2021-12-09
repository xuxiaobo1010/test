// pages/errordetail/errordetail.js
import {
  QueryQuestion,
} from '../../network/topic'
import{
  DeleteErrQuestion
}from '../../network/device'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeNum:0,
    Answer: "",
    decode_answer: "",
    see_answer: false,
    store: true,
    error: false, // 报错
    myChecked: 0,
    scrollTop: 0,
    myCheckedJ: 0, //材料判断题
    myCheckedS: 0, //材料单选题
    myCheckedS1: 0,
    currentValue: 0, //当前选择答案
    current: 0, //当前题号
    score: 0,
    id: "",
    totolPage: 0,
    questionList: [],
    nowQuestion: [],
    isChooseShow: false,
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
    hidden: true,
    singlelength: 0,
    mullength: 0,
    judgelength: 0,
    materlength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let paperName = options.name
    this.handleQueryQuestions(paperName)

  },
  selectType(e){
    // console.log(e);
    let id = e.currentTarget.dataset.id;
    this.setData({
      typeNum:id
    })
 },
  //删除题目
  deleteError(e){
    console.log(e);
    let id = e.currentTarget.dataset.id
    DeleteErrQuestion(id).then(res=>{
      wx.showToast({
        title: '删除成功!',
      })
    })
  },
  handleQueryQuestions(paperName) {
    wx.showLoading({
      title: 'Loading...',
    })
    let username = 'e' + wx.getStorageSync('username') + 'e'
    QueryQuestion({
      order: "createdAt",
      //limit: 
      skip: 0,
      where: `{"name":{"$in":["${username}"]}}`
    }).then(res => {
      console.log("query", res);
      let list = [];
      let list1 = []; //单选
      let list2 = []; //多选
      let list3 = []; //判断
      let list4 = []; //材料
      res.data.results.forEach(element => {
        if (element.basedata.name == paperName) {
          element.basedata.questions.objectId = element.objectId
          if (element.basedata.questions.type == "单选题") {
            list1.push(element.basedata.questions)
          } else if (element.basedata.questions.type == "多选题") {
            list2.push(element.basedata.questions)
          } else if (element.basedata.questions.type == "判断题") {
            list3.push(element.basedata.questions)
          } else {
            list4.push(element.basedata.questions)
          }

        }
      });
      list = [...list1, ...list2, ...list3, ...list4];
      this.setData({
        singlelength: list1.length||0,
        mullength: list2.length ||0,
        judgelength: list3.length ||0,
        materlength: list4.length ||0,
        questionList: list,
        totalPage: list.length ||0
      })
      wx.hideLoading()
    }).catch(err => {
      // console.log("err", err);
      wx.hideLoading()
    })
  },
  //用户点击查看答案
  tap_answer: function (res) {
    this.data.see_answer = !this.data.see_answer
    this.setData({
      see_answer: this.data.see_answer
    })
  },
  //单选和判断函数，选择选项函数
  selectItem(event) {
    // console.log('event', event)
    var num = this.data.current;
    // console.log("num", num);

    let cindex = event.currentTarget.dataset.index;
    if (this.data.questionList[num].type == '单选题' || this.data.questionList[num].type == '判断题') {
      //type_id为1与0时则进行下列赋值(单选或判断)
      // console.log("看看我有没有进入单选判断");
      // console.log("类型：" + this.data.questionList[num].type);
      var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10。。。。
      this.setData({ //在data数据里更新myChecked的值和当前选择的值
        myChecked: selectId,
        currentValue: selectId
      })
    } else if (this.data.questionList[num].type == '多选题') {
      // console.log("看看我有没有进入多选");
      // console.log("类型：" + this.data.questionList[num].type);
      // var index = event.currentTarget.dataset.index; //获取当前索引
      // console.log("index", index);
      var temp1 = event.detail.value //获取多选中的value
      // console.log("temp1", temp1);
      // var index = -1;
      var temp2 = 0 //初始
      // console.log(temp1)
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
          // console.log("temp", temp2);
        }
        // console.log("temp2", temp2);

        for (let index = 0; index < temp1.length; index++) {
          // console.log(temp1[index]);

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


    } else if (this.data.questionList[num].type == "材料题") {
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
   //上一题
   on_question() {
    this.setData({
      scrollTop: 0
    })
    var num = this.data.current;
      this.setData({
        //清零当前多选值
        current: num - 1,
        //选项圆点清0
        myChecked: 0,
        myCheckedJ: 0, //材料判断题
        mycheckedS: 0, //材料单选题
        mycheckedS1: 0, //材料单选题
        //当前选项值清0
        currentValue: 0,
        //收藏功能初始化
        store: true,
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
      })
    },
  // 下一题next_question函数
  next_question() {
    //判断正误
    this.setData({
      scrollTop: this.data.scrollTop = 0
    })
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
    // console.log("选择 ", this.data.currentValue)
    // console.log("答案 ", correctItem)
    //判断当前选择与答案是否相等
    if (this.data.currentValue === correctItem) {
      // console.log("恭喜您答题正确")
      // this.setData({
      //   //分数加2分

      // })
      // console.log("我的得分：", this.data.score)
    } else if (this.data.currentValue != correctItem && this.data.currentValue != "") {
      var error_answer = this.data.currentValue
      var decode_answer = ''
      switch (error_answer) {
        case 1:
          decode_answer = 'A'
          break;
        case 10:
          decode_answer = 'B'
          break;
        case 100:
          decode_answer = 'C'
          break;
        case 1000:
          decode_answer = 'D'
          break;
        case 10000:
          decode_answer = 'E'
          break;
        case 11:
          decode_answer = 'AB'
          break;
        case 101:
          decode_answer = 'AC'
          break;
        case 1001:
          decode_answer = 'AD'
          break;
        case 10001:
          decode_answer = 'AE'
          break;
        case 110:
          decode_answer = 'BC'
          break;
        case 1010:
          decode_answer = 'BD'
          break;
        case 10010:
          decode_answer = 'BE'
          break;
        case 1100:
          decode_answer = 'CD'
          break;
        case 10100:
          decode_answer = 'CE'
          break;
        case 11000:
          decode_answer = 'DE'
          break;
        case 111:
          decode_answer = 'ABC'
          break;
        case 1011:
          decode_answer = 'ABD'
          break;
        case 10011:
          decode_answer = 'ABE'
          break;
        case 1110:
          decode_answer = 'BCD'
          break;
        case 10110:
          decode_answer = 'BCE'
          break;
        case 11100:
          decode_answer = 'CDE'
          break;
        case 1111:
          decode_answer = 'ABCD'
          break;
        case 10111:
          decode_answer = 'ABCE'
          break;
        case 11111:
          decode_answer = 'ABCDE'
          break;
      }
      // console.log("原始答案 ", error_answer)
      // console.log("解密后的答案 ", decode_answer)

    }

    //下标加1进入下一题
    //判断是否最后一题,解决最后一题无限加分问题
    if (this.data.current >= this.data.questionList.length - 1) {
      //为最后一题时，值清零，
      let that = this;
      //弹出结果框
      wx.showModal({
        title: '答题结束',
        // 您的成绩为' + this.data.score
        content: '答题已全部完成',
        success(res) {
          if (res.confirm) {
            that.setData({
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
              current: 0,
              Answer: that.data.questionList[0]
            })
            wx.switchTab({
              url: "/pages/index/index"
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            // wx.switchTab({
            //   url: "/pages/index/index"
            // })
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
        myCheckedJ: 0,
        myCheckedS: 0,
        myCheckedS1: 0,
        //当前选项值清0
        currentValue: 0,
        //收藏与报错功能初始化
        store: true,
        error: false,
        //查看答案按钮复原
        see_answer: false,

      })
      if (this.data.questionList[this.data.current].type != "材料题") {
        this.setData({
          Answer: this.data.questionList[this.data.current].Answer,
        })
      }

      //获取更新后下一题current的值来更新当前题目
      var current = this.data.current;
      wx.setStorageSync(`c${this.data.id}`, current)
      // console.log("我想看看是哪个题号：", current)
      // this.setData({
      //   ////更新当前题目
      //   questionList: this.data.questionList[current]
      // })
      // console.log("当前题号为" + this.data.current + "对应的questionList为：");
      // console.log(this.data.questionList);

    }
  },
  // 打开关闭选择框
  pageClick: function () {
    this.setData({
      isChooseShow: !this.data.isChooseShow
    })
  },
  //打开跳转框
  closeSelect() {
    this.setData({
      isChooseShow: false
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
      store: true
    })
    if (this.data.questionList[current].type != "材料题") {
      this.setData({
        Answer: this.data.questionList[current].Answer,
      })
    }
    wx.setStorageSync(`c${this.data.id}`, current)
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
      myChecked: 0,
      myCheckedJ: 0,
      myCheckedS: 0,
      myCheckedS1: 0,
    })
  },

  onShow: function () {

  },


})