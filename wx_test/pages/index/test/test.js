import {
  CreateQuestion,
  QueryQuestion,
  updateDevice
} from '../../../network/topic'
// import { isFloat64Array } from 'util/types'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeNum: 0,
    decode_answer: "",
    see_answer: false,
    singlelength: 0,
    multiplelength: 0,
    judgelength: 0,
    materiallength: 0,
    store: true,
    testName: "",
    isChooseShow: false,
    answersList: [], //答题填写答案
    error: false, // 报错
    myChecked: 0,
    myCheckedJ: 0, //材料判断题
    mycheckedS: 0, //材料单选题
    mycheckedS1: 0, //材料单选题
    currentValue: 0, //当前选择答案
    current: 0, //当前题号
    score: 0,
    id: "",
    num:5400,
    restime: "1:30:00",
    questionList: [],
    nowQuestion: [],
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
    layerlayer: {
      isLayerShow: false, //默认弹窗
      layerAnimation: {}, //弹窗动画
    },
    // answers: {
    //   start: 0, //初始题号
    //   end: 0, //结束题号
    //   allList: [1, 2, 3, 4, 5, 6, 7, 8, 9], //题号数据
    //   activeNum: 0, //当前显示条数
    //   onceLoadLength: 5, //一次向俩端加载条数，因我使用本地数据，此属性未实际使用
    //   isShowTip: false //默认是否显示提示
    // }
  },


  //页码切换列表效果
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
  selectType(e) {
    // console.log(e);
    let id = e.currentTarget.dataset.id;
    this.setData({
      typeNum: id
    })
  },
  handleToQuestion(e) {
    // console.log(e);
    this.setData({
      scrollTop: 0
    })
    let current = e.currentTarget.dataset.id;
    this.setData({
      current,
      isChooseShow: false
    })

    if (this.data.questionList[current].type == "材料题") {
      let i = 0;
      this.data.questionList[current].questions.forEach((item, index) => {
        if (item.type == "多选题") {
          i = index
          return;
        }
      });
      // console.log("i", i, current);

      if (this.data.answersList[current][i].length > 0) {
        // console.log("11");
        this.setData({
          multiIndex: [{
            checked: this.data.answersList[current][i].indexOf('A') >= 0
          }, {
            checked: this.data.answersList[current][i].indexOf('B') >= 0
          }, {
            checked: this.data.answersList[current][i].indexOf('C') >= 0
          }, {
            checked: this.data.answersList[current][i].indexOf('D') >= 0
          }, {
            checked: this.data.answersList[current][i].indexOf('E') >= 0
          }],
        })
      } else {
        // console.log("111");

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
        })
      }

    } else if (this.data.answersList[this.data.current].length > 0) {
      this.setData({
        multiIndex: [{
          checked: this.data.answersList[this.data.current].indexOf('A') >= 0
        }, {
          checked: this.data.answersList[this.data.current].indexOf('B') >= 0
        }, {
          checked: this.data.answersList[this.data.current].indexOf('C') >= 0
        }, {
          checked: this.data.answersList[this.data.current].indexOf('D') >= 0
        }, {
          checked: this.data.answersList[this.data.current].indexOf('E') >= 0
        }],
      })
    } else {
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
      })
    }
  },
  //页码切换列表收缩
  layerFooterClick: function () {
    let layerAnimation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    layerAnimation.translate3d(0, '100%', 0).step()
    this.data.layerlayer.isLayerShow = false
    this.data.layerlayer.layerAnimation = layerAnimation
    this.setData(this.data)
  },
  //获取所有试卷筛选出随机数量的考试题目
  handleQueryQuestions(id, cont) {
    wx.showLoading({
      title: 'Loading...',
    })
    QueryQuestion({
      order: "createdAt",
      // limit: 20,
      skip: 0,
      where: '{"name":{"$in":["试题"]}}'
    }).then(res => {
      let list = [];
      let testName = "";
      // console.log("query", res);
      res.data.results.forEach(element => {
        if (element.product.objectId == id) {
          list = element.basedata.question;
          testName = element.basedata.name
          return;
        }
      })
      // console.log("list", list);
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
      // console.log(singleQuestion.length, multipleQuestion.length, judgeQuestion.length);
      let list1 = this.getRandomArrayElements(singleQuestion, 40); //单选
      let list2 = this.getRandomArrayElements(multipleQuestion, 20); //多选
      let list3 = this.getRandomArrayElements(judgeQuestion, 20); //判断
      let list4 = this.getRandomArrayElements(materialQuestion, 5); //判断
      // console.log("list1",list1,list2,list3);
      let results = [...list1, ...list2, ...list3, ...list4];
      let answersList = []
      results.forEach((element, index) => {
        if (element.type == "材料题") {
          answersList[index] = []
          element.questions.forEach((item, i) => {
            answersList[index][i] = ""
          })
        } else {
          answersList[index] = ""
        }
      })
      // console.log("result",results);
      this.setData({
        questionList: results,
        answersList,
        singlelength: list1.length,
        multiplelength: list2.length,
        judgelength: list3.length,
        materiallength: list4.length,
        testName
      })
      wx.hideLoading()
      this.Numdown()
      return;
      this.setData({
        questionList: list
      })
      if (cont == 1) {
        let current = wx.getStorageSync(`c${id}`) || 0
        this.setData({
          current
        })
      }
      wx.hideLoading()
    }).catch(err => {
      // console.log("err", err);
    })
  },

  //获取随机count数量的对应类型的题目
  getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0),
      i = arr.length,
      min = i - count,
      temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },
  //提交试卷
  submitTest() {
    let answerList = this.data.answersList;
    let num = 0;
    answerList.forEach((item, index) => {
      if (this.data.questionList[index].type == "材料题") {
        let flag = true;
        item.forEach(ele => {

          if (ele.length > 0) {
            flag = false;
            return;
          }
        })
        if (flag) {
          num++
        }
      } else if (item == "") {
        num++;
      }
    })
    let that = this;
    if (num != 0) {
      wx.showModal({
        title: '交卷',
        content: `你还有${num}道题没有做，确定交卷嘛?`,
        success(res) {
          if (res.confirm) {
            let grade = 0;
            let correct = 0;
            let errquestion = [];
            let username = wx.getStorageSync('username')
            let date = new Date();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            if (hour >= 1 && hour <= 9) {
              hour = "0" + hour;
            }
            if (minutes >= 1 && minutes <= 9) {
              minutes = "0" + minutes;
            }
            if (seconds >= 1 && seconds <= 9) {
              seconds = "0" + seconds;
            }
            username = username.substring(username.length - 4)
            //  console.log(hour,minutes,seconds,username);
            let objectId = `${hour}${minutes}${seconds}${username}`
            // console.log(objectId);
            that.data.questionList.forEach((item, index) => {
              if (item.type == "单选题" || item.type == "多选题") {
                if (item.Answer == that.data.answersList[index]) {
                  // console.log("成绩", item.type, grade);
                  grade++;
                  correct++;
                } else if (that.data.answersList[index].length > 0) {
                  // console.log("index", index);
                  item.index = index;
                  errquestion.push(item)
                }
              } else if (item.type == "判断题") {
                let answer = "";
                // console.log(item);
                // console.log(item.Answer == "正确 ");

                if (item.Answer.trim() == "正确") {
                  answer = "A"
                } else if (item.Answer.trim() == "错误") {
                  answer = "B"
                }
                // console.log("answer", answer);

                if (answer == that.data.answersList[index]) {
                  // console.log("判断", grade);
                  grade++;
                  correct++;
                } else if (that.data.answersList[index].length > 0) {
                  // console.log(index);
                  item.index = index;
                  errquestion.push(item)
                }
              } else if (item.type == "材料题") {
                let flag = false;
                let len = 0;
                item.questions.forEach((ele, i) => {
                  if (that.data.answersList[index][i].length > 0) {
                    flag = true //答题了
                  }
                  if (ele.type == "单选题" || ele.type == "多选题") {
                    if (ele.Answer == that.data.answersList[index][i]) {
                      grade++;
                      len++; //答对数量
                      // correct++;
                    } else if (that.data.answersList[index][i].length > 0) { //答错了
                      //  flag = true;
                    }
                  } else if (ele.type == "判断题") {
                    let answer = ""
                    if (ele.Answer.trim() == "正确") {
                      answer = "A"
                    } else if (ele.Answer.trim() == "错误") {
                      answer = "B"
                    }
                    if (answer == that.data.answersList[index][i]) {
                      grade++;
                      // console.log("判断", grade);
                      len++;
                      // correct++;
                    } else if (that.data.answersList[index][i].length > 0) {
                      // flag = true;
                      // console.log(index);
                      // item.index = index;
                      // errquestion.push(item)
                    }
                  }

                })
                if (flag && len == 4) { //都答对了 
                  correct++;
                } else if (flag && len < 4) {
                  errquestion.push(item)
                }
              }

            })
            let name = 't' + wx.getStorageSync('username') + 't';
            let data = {
              "name": name,
              "devaddr": name,
              "product": {
                "__type": "Pointer",
                "className": "Product",
                "objectId": objectId
              },
              "basedata": {
                "name": that.data.testName,
                "correct": correct,
                "grade": grade,
                "Comptime": 5400 - that.data.num,
                "questions": that.data.questionList,
                "errquestions": errquestion
              }
            };
            // console.log(data);

            CreateQuestion(data).then(res => {
              // console.log(res);
              wx.showModal({
                content: `恭喜你答题完成,您的得分为${grade}`,
                success(res) {
                  wx.switchTab({
                    url: '/pages/test/test',
                  })
                },
              })
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: `恭喜全部完成，可以交卷啦`,
        success(res) {
          if (res.confirm) {
            let grade = 0;
            let correct = 0;
            let errquestion = [];
            let username = wx.getStorageSync('username')
            let date = new Date();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            if (hour >= 1 && hour <= 9) {
              hour = "0" + hour;
            }
            if (minutes >= 1 && minutes <= 9) {
              minutes = "0" + minutes;
            }
            if (seconds >= 1 && seconds <= 9) {
              seconds = "0" + seconds;
            }
            username = username.substring(username.length - 4)
            //  console.log(hour,minutes,seconds,username);
            let objectId = `${hour}${minutes}${seconds}${username}`
            // console.log(objectId);
            that.data.questionList.forEach((item, index) => {
              if (item.type == "单选题" || item.type == "多选题") {
                if (item.Answer == that.data.answersList[index]) {
                  // console.log("成绩", item.type, grade);
                  grade++;
                  correct++;
                } else if (that.data.answersList[index].length > 0) {
                  // console.log("index", index);
                  item.index = index;
                  errquestion.push(item)
                }
              } else if (item.type == "判断题") {
                let answer = "";
                // console.log(item);
                // console.log(item.Answer == "正确 ");

                if (item.Answer.trim() == "正确") {
                  answer = "A"
                } else if (item.Answer.trim() == "错误") {
                  answer = "B"
                }
                // console.log("answer", answer);

                if (answer == that.data.answersList[index]) {
                  // console.log("判断", grade);
                  grade++;
                  correct++;
                } else if (that.data.answersList[index].length > 0) {
                  // console.log(index);
                  item.index = index;
                  errquestion.push(item)
                }
              } else if (item.type == "材料题") {
                let flag = false;
                let len = 0;
                item.questions.forEach((ele, i) => {
                  if (that.data.answersList[index][i].length > 0) {
                    flag = true //答题了
                  }
                  if (ele.type == "单选题" || ele.type == "多选题") {
                    if (ele.Answer == that.data.answersList[index][i]) {
                      grade++;
                      len++; //答对数量
                      // correct++;
                    } else if (that.data.answersList[index][i].length > 0) { //答错了
                      //  flag = true;
                    }
                  } else if (ele.type == "判断题") {
                    let answer = ""
                    if (ele.Answer.trim() == "正确") {
                      answer = "A"
                    } else if (ele.Answer.trim() == "错误") {
                      answer = "B"
                    }
                    if (answer == that.data.answersList[index][i]) {
                      grade++;
                      // console.log("判断", grade);
                      len++;
                      // correct++;
                    } else if (that.data.answersList[index][i].length > 0) {
                      // flag = true;
                      // console.log(index);
                      // item.index = index;
                      // errquestion.push(item)
                    }
                  }

                })
                if (flag && len == 4) { //都答对了 
                  correct++;
                } else if (flag && len < 4) {
                  errquestion.push(item)
                }
              }

            })
            let name = 't' + wx.getStorageSync('username') + 't';
            let data = {
              "name": name,
              "devaddr": name,
              "product": {
                "__type": "Pointer",
                "className": "Product",
                "objectId": objectId
              },
              "basedata": {
                "name": that.data.testName,
                "correct": correct,
                "grade": grade,
                "Comptime": 5400 - that.data.num,
                "questions": that.data.questionList,
                "errquestions": errquestion
              }
            };
            // console.log(data);

            CreateQuestion(data).then(res => {
              // console.log(res);
              wx.showModal({
                content: `恭喜你答题完成,您的得分为${grade}`,
                success(res) {
                  wx.switchTab({
                    url: '/pages/test/test',
                  })
                },
              })
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  Numdown() {
    var that = this,
      num = that.data.num;
    setTimeout(function () {
      that.setData({
        num: num - 1
      })
      that.endNum()
    }, 1000)
  },
  endNum() {
    let that = this;
    let num = that.data.num;
    that.GetMHS(num);
    if (num == 0) {
      that.setData({
        num: "倒计时结束"
      })
      let answerList = that.data.answersList;
      let num = 0;
      answerList.forEach((item, index) => {
        if (that.data.questionList[index].type == "材料题") {
          let flag = true;
          item.forEach(ele => {
            if (ele == !"") {
              flag = false
              return;
            }
          })
          if (flag) {
            num++
          }
        } else if (item == "") {
          num++;
        }
      })
      // let that = this;
      wx.showModal({
        title: '交卷',
        content: `考试已结束`,
        success(res) {
          // if (res.confirm) {
          let grade = 0;
          let correct = 0;
          let errquestion = [];
          let username = wx.getStorageSync('username')
          let date = new Date();
          var hour = date.getHours();
          var minutes = date.getMinutes();
          var seconds = date.getSeconds();
          if (hour >= 1 && hour <= 9) {
            hour = "0" + hour;
          }
          if (minutes >= 1 && minutes <= 9) {
            minutes = "0" + minutes;
          }
          if (seconds >= 1 && seconds <= 9) {
            seconds = "0" + seconds;
          }
          username = username.substring(username.length - 4)
          //  console.log(hour,minutes,seconds,username);
          let objectId = `${hour}${minutes}${seconds}${username}`
          // console.log(objectId);
          that.data.questionList.forEach((item, index) => {
            if (item.type == "单选题" || item.type == "多选题") {
              if (item.Answer == that.data.answersList[index]) {
                // console.log("成绩", item.type, grade);
                grade++;
                correct++;
              } else if (that.data.answersList[index].length > 0) {
                // console.log("index", index);
                item.index = index;
                errquestion.push(item)
              }
            } else if (item.type == "判断题") {
              let answer = "";
              // console.log(item);
              // console.log(item.Answer == "正确 ");

              if (item.Answer.trim() == "正确") {
                answer = "A"
              } else if (item.Answer.trim() == "错误") {
                answer = "B"
              }
              // console.log("answer", answer);

              if (answer == that.data.answersList[index]) {
                // console.log("判断", grade);
                grade++;
                correct++;
              } else if (that.data.answersList[index].length > 0) {
                // console.log(index);
                item.index = index;
                errquestion.push(item)
              }
            } else if (item.type == "材料题") {
              let flag = false;
              let len = 0;
              item.questions.forEach((ele, i) => {
                if (that.data.answersList[index][i].length > 0) {
                  flag = true //答题了
                }
                if (ele.type == "单选题" || ele.type == "多选题") {
                  if (ele.Answer == that.data.answersList[index][i]) {
                    grade++;
                    len++; //答对数量
                    // correct++;
                  } else if (that.data.answersList[index][i].length > 0) { //答错了
                    //  flag = true;
                  }
                } else if (ele.type == "判断题") {
                  let answer = ""
                  if (ele.Answer.trim() == "正确") {
                    answer = "A"
                  } else if (ele.Answer.trim() == "错误") {
                    answer = "B"
                  }
                  if (answer == that.data.answersList[index][i]) {
                    grade++;
                    // console.log("判断", grade);
                    len++;
                    // correct++;
                  } else if (that.data.answersList[index][i].length > 0) {
                    // flag = true;
                    // console.log(index);
                    // item.index = index;
                    // errquestion.push(item)
                  }
                }

              })
              if (flag && len == 4) { //都答对了 
                correct++;
              } else if (flag && len < 4) {
                errquestion.push(item)
              }
            }

          })
          let name = 't' + wx.getStorageSync('username') + 't';
          let data = {
            "name": name,
            "devaddr": name,
            "product": {
              "__type": "Pointer",
              "className": "Product",
              "objectId": objectId
            },
            "basedata": {
              "name": that.data.testName,
              "correct": correct,
              "grade": grade,
              "Comptime": 5400,
              "questions": that.data.questionList,
              "errquestions": errquestion
            }
          };
          // console.log(data);

          CreateQuestion(data).then(res => {
            // console.log(res);
            wx.showModal({
              content: `答题完成,您的得分为${grade}`,
              success(res) {
                wx.switchTab({
                  url: '/pages/test/test',
                })
              },
            })
          })

          // } else if (res.cancel) {
          //   console.log('用户点击取消')
          // }
        }
      })
    } else {
      that.Numdown()
    }
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
    this.setData({
      restime
    })
  },
  FormatTime(t) {
    if (t < 10)
      return "0" + t;
    return t;
  },
  onShow: function () {

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
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 2000)
    var that = this;
    console.log(app.globalData.questionList);
    if (options.type == undefined) {
      that.setData({
        questionList: app.globalData.questionList
      })
    } else {
      let list = []
      app.globalData.questionList.forEach((item, index) => {
        if (item.type == options.type) {
          list.push(item)
        }

      })
      that.setData({
        questionList: list
      })
    }
    console.log("options.bank_id:", options.bank_id)

    console.log("options.chapter_id:", options.chapter_id)
    // if (options.chapter_id) {
    //   wx.request({
    //     url: 'https://xlyt.zlzyy.club:444/API/kaoti.aspx',
    //     data: {
    //       chapter_id: options.chapter_id
    //     },
    //     success: function(res) {
    //       console.log("返回过来的值：", res.data)
    //       console.log(res.data.index)
    //       that.setData({
    //         questionList: res.data,
    //         hidden: false
    //       })
    //       setTimeout(function() {
    //         that.setData({
    //           hidden: true
    //         })
    //       }, 300)
    //     }
    //   })
    // }
    //  查询专题信息，即专题练题
    console.log("options.type:", options.type);

    // if (options.type) {
    //   wx.request({
    //     url: 'https://xlyt.zlzyy.club:444/API/kaoti.aspx',
    //     data: {
    //       type: options.type
    //     },
    //     success: function(res) {
    //       console.log("返回过来的值：", res.data)
    //       console.log(res.data.index)
    //       that.setData({
    //         questionList: res.data,
    //         hidden: false
    //       })
    //       setTimeout(function() {
    //         that.setData({
    //           hidden: true
    //         })
    //       }, 300)
    //     }
    //   })
    // }
  },
  //用户点击查看答案
  tap_answer: function (res) {
    this.data.see_answer = !this.data.see_answer
    this.setData({
      see_answer: this.data.see_answer
    })
  },
  //实现收藏功能
  select_store: function () {
    this.data.store = !this.data.store
    this.setData({
      store: this.data.store
    })
    //实现上一题的添加功能,当满足store
    if (!this.data.store) {
      let username = wx.getStorageSync('username') || "";
      if (username != "") {
        //查询收藏 没有收藏设备添加 有更新
        this.queryCollQuestions(username + 'c')
      }
      return;

    }
  },
  // 报错按钮，点击展开报错输入
  get_error: function () {
    this.data.error = !this.data.error
    this.setData({
      error: this.data.error
    })
  },
  //报错答案输入
  valuechange: function (res) {
    console.log(res.detail.value)
    this.setData({
      tmp: res.detail.value
    })
  },
  // 报错答案提交
  submit: function () {
    //正则表达控制
    var regCapitalLetter = new RegExp('^[A-E]{1,5}$', 'g'); //判断报错输入的是否为A-E的字母
    var rsCapitalLetter = regCapitalLetter.exec(this.data.tmp);
    if (rsCapitalLetter) {
      wx.request({
        url: 'https://xlyt.zlzyy.club:444/API/get_comments.aspx',
        data: {
          uid: wx.getStorageSync('uid'),
          opinion: rsCapitalLetter,
          type: "答案报错",
          details_id: this.data.questionList[this.data.current].details_id,
        },
        success: function (res) {
          // console.log(res.data)
          wx.showModal({
            title: '成功',
            content: '提交成功',
          })
        }
      })

    } else {
      wx.showModal({
        title: '失败',
        content: '请检查你要报错的答案',
      })
    }
  },

  //单选和判断函数，选择选项函数
  selectItem(event) {
    // console.log('event', event)
    var num = this.data.current;
    // console.log("num", num);

    if (this.data.questionList[num].type == '单选题' || this.data.questionList[num].type == '判断题') {
      //type_id为1与0时则进行下列赋值(单选或判断)
      // console.log("看看我有没有进入单选判断");
      // console.log("类型：" + this.data.questionList[num].type);
      var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10。。。。
      let answerList = this.data.answersList;
      if (selectId == 1) {
        answerList[this.data.current] = "A"
      } else if (selectId == 10) {
        answerList[this.data.current] = "B"
      } else if (selectId == 100) {
        answerList[this.data.current] = "C"
      } else if (selectId == 1000) {
        answerList[this.data.current] = "D"
      }
      this.setData({ //在data数据里更新myChecked的值和当前选择的值
        myChecked: selectId,
        currentValue: selectId,
        answerList
      })
    } else if (this.data.questionList[num].type == '多选题') {
      // console.log("看看我有没有进入多选");
      // console.log("类型：" + this.data.questionList[num].type);
      // var index = event.currentTarget.dataset.index; //获取当前索引
      // console.log("index", index);
      var temp1 = event.detail.value //获取多选中的value
      // console.log("temp1", temp1);
      var index = -1;
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
      let answer = "";
      if (temp1.length != 0) {
        for (var i = 0, len = temp1.length; i < len; i++) {
          temp1[i] = parseInt(temp1[i])
          temp2 = temp2 + temp1[i]
          // console.log("temp", temp2);
        }
        // console.log("temp2", temp2);
        switch (temp2) {
          case 0:
            answer = ""
            break;
          case 1:
            answer = "A"
            break;
          case 10:
            answer = "B"
            break;
          case 100:
            answer = "C"
            break;
          case 1000:
            answer = "D"
            break;
          case 10000:
            answer = "E"
            break;
          case 11:
            answer = "AB"
            break;
          case 101:
            answer = "AC"
            break;
          case 1001:
            answer = "AD"
            break;
          case 10001:
            answer = "AE"
            break;
          case 110:
            answer = "BC"
            break;
          case 1010:
            answer = "BD"
            break;
          case 10010:
            answer = "BE"
            break;
          case 1100:
            answer = "CD"
            break;
          case 10100:
            answer = "CE"
            break;
          case 11000:
            answer = "DE"
            break;
          case 111:
            answer = "ABC"
            break;
          case 1011:
            answer = "ABD"
            break;
          case 10011:
            answer = "ABE"
            break;
          case 1101:
            answer = "ACD"
            break;
          case 10101:
            answer = "ACE"
            break;
          case 1110:
            answer = "BCD"
            break;
          case 10110:
            answer = "BCE"
            break;
          case 11100:
            answer = "CDE"
            break;
          case 1111:
            answer = "ABCD"
            break;
          case 10111:
            answer = "ABCE"
            break;
          case 11110:
            answer = "BCDE"
            break;
          case 11111:
            answer = "ABCDE"
            break;
        }
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
      // console.log("answer", answer);
      let answerList = this.data.answersList
      answerList[this.data.current] = answer
      this.setData({
        multiIndex: multiIndex,
        answerList
      })
      // if (multiIndex[index].checked) { //单击加减赋值
      //   this.setData({
      //     myChecked: this.data.myChecked + selectId
      //   })
      // } else {
      //   this.setData({
      //     myChecked: this.data.myChecked - selectId
      //   })
      // }
      // selectId = selectId + parseInt(event.currentTarget.dataset.selectid);
      // this.setData({ //上传至视图层
      //   multiIndex: multiIndex,
      //   currentValue: selectId
      // })

    } else if (this.data.questionList[num].type == '材料题') {
      let index = event.currentTarget.dataset.index;
      if (this.data.questionList[num].questions[index].type == '单选题' || this.data.questionList[num].questions[index].type == '判断题') {
        if (index == 0 && this.data.questionList[num].questions[index].type == '单选题') {
          var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10
          let answerList = this.data.answersList;
          if (selectId == 1) {
            answerList[this.data.current][index] = "A"
          } else if (selectId == 10) {
            answerList[this.data.current][index] = "B"
          } else if (selectId == 100) {
            answerList[this.data.current][index] = "C"
          } else if (selectId == 1000) {
            answerList[this.data.current][index] = "D"
          }
          this.setData({ //在data数据里更新myChecked的值和当前选择的值
            myCheckedS: selectId,
            currentValue: selectId,
            answerList
          })
        } else if (index == 1 && this.data.questionList[num].questions[index].type == '单选题') {
          var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10
          let answerList = this.data.answersList;
          if (selectId == 1) {
            answerList[this.data.current][index] = "A"
          } else if (selectId == 10) {
            answerList[this.data.current][index] = "B"
          } else if (selectId == 100) {
            answerList[this.data.current][index] = "C"
          } else if (selectId == 1000) {
            answerList[this.data.current][index] = "D"
          }
          this.setData({ //在data数据里更新myChecked的值和当前选择的值
            myCheckedS1: selectId,
            currentValue: selectId,
            answerList
          })
        } else {
          var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10。。。。
          let answerList = this.data.answersList;
          if (selectId == 1) {
            answerList[this.data.current][index] = "A"
          } else if (selectId == 10) {
            answerList[this.data.current][index] = "B"
          } else if (selectId == 100) {
            answerList[this.data.current][index] = "C"
          } else if (selectId == 1000) {
            answerList[this.data.current][index] = "D"
          }
          this.setData({ //在data数据里更新myChecked的值和当前选择的值
            myCheckedJ: selectId,
            currentValue: selectId,
            answerList
          })
        }
      } else if (this.data.questionList[num].questions[index].type == "多选题") {
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
        let answer = "";
        if (temp1.length != 0) {
          for (var i = 0, len = temp1.length; i < len; i++) {
            temp1[i] = parseInt(temp1[i])
            temp2 = temp2 + temp1[i]
            // console.log("temp", temp2);
          }
          // console.log("temp2", temp2);
          switch (temp2) {
            case 0:
              answer = ""
              break;
            case 1:
              answer = "A"
              break;
            case 10:
              answer = "B"
              break;
            case 100:
              answer = "C"
              break;
            case 1000:
              answer = "D"
              break;
            case 10000:
              answer = "E"
              break;
            case 11:
              answer = "AB"
              break;
            case 101:
              answer = "AC"
              break;
            case 1001:
              answer = "AD"
              break;
            case 10001:
              answer = "AE"
              break;
            case 110:
              answer = "BC"
              break;
            case 1010:
              answer = "BD"
              break;
            case 10010:
              answer = "BE"
              break;
            case 1100:
              answer = "CD"
              break;
            case 10100:
              answer = "CE"
              break;
            case 11000:
              answer = "DE"
              break;
            case 111:
              answer = "ABC"
              break;
            case 1011:
              answer = "ABD"
              break;
            case 10011:
              answer = "ABE"
              break;
            case 1101:
              answer = "ACD"
              break;
            case 10101:
              answer = "ACE"
              break;
            case 1110:
              answer = "BCD"
              break;
            case 10110:
              answer = "BCE"
              break;
            case 11100:
              answer = "CDE"
              break;
            case 1111:
              answer = "ABCD"
              break;
            case 10111:
              answer = "ABCE"
              break;
            case 11110:
              answer = "BCDE"
              break;
            case 11111:
              answer = "ABCDE"
              break;
          }
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
        // console.log("answer", answer);
        let answerList = this.data.answersList
        answerList[this.data.current][index] = answer
        this.setData({
          multiIndex: multiIndex,
          answerList
        })
      }
    }
  },
  //上一题
  on_question() {
    this.setData({
      scrollTop: 0
    })
    //获得当前题号
    var num = this.data.current;
    //获得正确答案
    // var correct = this.data.questionList[num].answer;

    //判断是否为第一题,解决最后一题无限加分问题
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
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.current > 0) {
      //  console.log("111");

      if (this.data.questionList[this.data.current - 1].type == "材料题") {
        // console.log("111");
        let i = 0;
        this.data.questionList[this.data.current - 1].questions.forEach((item, index) => {
          if (item.type == "多选题") {
            i = index
          }
        })
        // console.log("第index：", i);

        if (this.data.answersList[this.data.current - 1][i].length > 0) {
          // console.log(this.data.answersList[this.data.current - 1][i].length);
          this.setData({
            multiIndex: [{
              checked: this.data.answersList[this.data.current - 1][i].indexOf('A') >= 0
            }, {
              checked: this.data.answersList[this.data.current - 1][i].indexOf('B') >= 0
            }, {
              checked: this.data.answersList[this.data.current - 1][i].indexOf('C') >= 0
            }, {
              checked: this.data.answersList[this.data.current - 1][i].indexOf('D') >= 0
            }, {
              checked: this.data.answersList[this.data.current - 1][i].indexOf('E') >= 0
            }],
          })
        } else {
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
          })
        }

      } else {
        // console.log(this.data.current);
        // console.log(this.data.answersList[this.data.current - 1]);

        if (this.data.questionList[this.data.current - 1].type == "多选题") {
          // return;
          if (this.data.answersList[this.data.current - 1].length > 0) {
            this.setData({
              multiIndex: [{
                checked: this.data.answersList[this.data.current - 1].indexOf('A') >= 0
              }, {
                checked: this.data.answersList[this.data.current - 1].indexOf('B') >= 0
              }, {
                checked: this.data.answersList[this.data.current - 1].indexOf('C') >= 0
              }, {
                checked: this.data.answersList[this.data.current - 1].indexOf('D') >= 0
              }, {
                checked: this.data.answersList[this.data.current - 1].indexOf('E') >= 0
              }],
            })
          } else {
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
            })
          }
        } else {
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
          })
        }
      }

      this.setData({
        //清零当前多选值
        current: this.data.current - 1,
        //选项圆点清0
        myChecked: 0,
        myCheckedJ: 0, //材料判断题
        mycheckedS: 0, //材料单选题
        mycheckedS1: 0, //材料单选题
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
    this.setData({
      scrollTop: 0
    })
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
      this.setData({
        //分数加2分

      })
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
      //添加错题
      // wx.request({
      //   url: 'https://xlyt.zlzyy.club:444/API/get_question_collection.aspx',
      //   data: {
      //     uid: wx.getStorageSync('uid'),
      //     details_id: this.data.questionList[this.data.current].details_id,
      //     type: "错题",
      //     error_answer: decode_answer
      //   },
      //   success: function (res) {
      //     console.log(res.data)
      //     console.log("答错了，已帮你添加为错题")
      //   }
      // })
    }

    //下标加1进入下一题
    //判断是否最后一题,解决最后一题无限加分问题
    if (this.data.current >= this.data.questionList.length - 1) {
      //为最后一题时，值清零，
      let that = this;
      //弹出结果框
      wx.showModal({
        title: '提示',
        // 您的成绩为' + this.data.score
        content: '当前为最后一题',
        success(res) {}
      })
    } else if (this.data.current < this.data.questionList.length - 1) {
      if (this.data.questionList[this.data.current + 1].type == "材料题") {
        let i = 0;
        this.data.questionList[this.data.current + 1].questions.forEach((item, index) => {
          if (item.type == "多选题") {
            i = index
            // return;
          }
        })
        if (this.data.answersList[this.data.current + 1][i].length > 0) {
          this.setData({
            multiIndex: [{
              checked: this.data.answersList[this.data.current + 1][i].indexOf('A') >= 0
            }, {
              checked: this.data.answersList[this.data.current + 1][i].indexOf('B') >= 0
            }, {
              checked: this.data.answersList[this.data.current + 1][i].indexOf('C') >= 0
            }, {
              checked: this.data.answersList[this.data.current + 1][i].indexOf('D') >= 0
            }, {
              checked: this.data.answersList[this.data.current + 1][i].indexOf('E') >= 0
            }],
          })
        } else {
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
          })
        }

      } else if (this.data.answersList[this.data.current + 1].length > 0) {
        this.setData({
          multiIndex: [{
            checked: this.data.answersList[this.data.current + 1].indexOf('A') >= 0
          }, {
            checked: this.data.answersList[this.data.current + 1].indexOf('B') >= 0
          }, {
            checked: this.data.answersList[this.data.current + 1].indexOf('C') >= 0
          }, {
            checked: this.data.answersList[this.data.current + 1].indexOf('D') >= 0
          }, {
            checked: this.data.answersList[this.data.current + 1].indexOf('E') >= 0
          }],
        })
      } else {
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
        })
      }

      this.setData({
        //清零当前多选值
        current: this.data.current + 1,
        //选项圆点清0
        myChecked: 0,
        //当前选项值清0
        currentValue: 0,
        //收藏与报错功能初始化
        store: true,
        error: false,
        //查看答案按钮复原
        see_answer: false,

      })
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})