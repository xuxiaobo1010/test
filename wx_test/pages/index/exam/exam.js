import {
  CreateQuestion,
  QueryQuestion,
  updateDevice
} from '../../../network/topic'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeNum:0,
    Answer:"",
    decode_answer: "",
    see_answer: false,
    store: true,
    error: false, // 报错
    myChecked: 0,
    scrollTop:0,
    myCheckedJ:0, //材料判断题
    myCheckedS:0, //材料单选题
    myCheckedS1:0,
    currentValue: 0, //当前选择答案
    current: 0, //当前题号
    score: 0,
    id:"",
    totolPage:0,
    questionList: [
    ],
    nowQuestion: [],
    isChooseShow:false,
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
    answers: {
      start: 0, //初始题号
      end: 0, //结束题号
      allList: [1, 2, 3, 4, 5, 6, 7, 8, 9], //题号数据
      activeNum: 0, //当前显示条数
      onceLoadLength: 5, //一次向俩端加载条数，因我使用本地数据，此属性未实际使用
      isShowTip: false //默认是否显示提示
    },
    flag_c:false,
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

  //页码切换列表效果
  // pageClick: function () {
    
    // let layerAnimation = wx.createAnimation({
    //   transformOrigin: '50% 50%',
    //   duration: 500,
    //   timingFunction: 'ease',
    //   delay: 0
    // })
    // if (!this.data.layerlayer.isLayerShow) {
    //   layerAnimation.translate3d(0, 0, 0).step()
    // } else {
    //   layerAnimation.translate3d(0, '100%', 0).step()
    // }
    // this.data.layerlayer.isLayerShow = !this.data.layerlayer.isLayerShow
    // this.data.layerlayer.layerAnimation = layerAnimation
    // this.setData(this.data)
  // },
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
  handleToQuestion(e) {
    console.log(e);
    let current = e.currentTarget.dataset.id;
    this.setData({
      scrollTop: this.data.scrollTop = 0,
      flag_c:false
    })
    this.setData({
      current,
      isChooseShow: false,
      store:true
    })
    if(this.data.questionList[current].type!="材料题"){
     this.setData({
      Answer:this.data.questionList[current].Answer,
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
        myChecked:0,
        myCheckedJ:0,
        myCheckedS:0,
        myCheckedS1:0,
      })
  },
  //获取所有试卷
  handleQueryQuestions(id,cont) {
    wx.showLoading({
      title: 'Loading...',
    })
    QueryQuestion({
      order: "createdAt",
      limit: 20,
      skip: 0,
      where: '{"name":{"$in":["试题"]}}'
    }).then(res => {
      let list = []
      let paperName = '';
      let list1 = []; //单选
      let list2 = [];  //多选
      let list3 = [];  //判断
      let list4 = [];  //材料
      console.log("query", res);
      res.data.results.forEach(element => {
        if (element.product.objectId == id) {
          list = element.basedata.question;
          paperName = element.basedata.name
          return;
        }
      })
      list.forEach(item=>{
        if(item.type=="单选题"){
          list1.push(item)
        }else if(item.type=="多选题"){
          list2.push(item)
        }else if(item.type=="判断题"){
          list3.push(item)
        }else{
          list4.push(item)
        }
      })
      let questionList = [...list1,...list2,...list3,...list4];
      let totalPage = list.length;
      // list.forEach((item,index)=>{
      //   if(item.type!="材料题")
      //   item.Answer = item.Answer.trim();
      // })
      this.setData({
        questionList,
        totalPage,
        paperName,
        Answer:list[0].Answer,
        singlelength:list1.length,
        mullength:list2.length,
        judgelength:list3.length,
        materlength:list4.length
      })
      if(cont==1){
        let current = wx.getStorageSync(`c${id}`)||0
        this.setData({
          current,
          Answer:this.data.questionList[current].Answer
        })
      }
      wx.hideLoading()
    }).catch(err => {
      console.log("err", err);
    })
  },
  //创建收藏设备
  createCollection(name) {
    console.log("name",name);
    
    let data = {
      "name": name,
      "devaddr": name,
      "product": {
        "__type": "Pointer",
        "className": "Product",
        "objectId": "22586x6b"
      },
      "basedata": {
        "name": "收藏试题",
        questions: [
        ]
      }
    }
    data.basedata.questions.push(this.data.questionList[this.data.current]);
    console.log("data",data);
    CreateQuestion(data).then(res=>{
      console.log("创建设备");
      
    });
  },
  //查询收藏
  queryCollQuestions(name) {
    QueryQuestion({
      order: "createdAt",
      limit: 20,
      skip: 0,
      where: `{"name":{"$in":["${name}"]}}`
    }).then(res => {
      console.log("收藏设备", res);
      if (res.data.results.length == 0) {
        this.createCollection(name)
      }else{
        console.log("更新设备");
        let id = res.data.results[0].objectId;
        let basedata = res.data.results[0].basedata;
        let currentQuestion = this.data.questionList[this.data.current];
        // basedata.questions=[]
        basedata.questions.push(currentQuestion)
        let data = {
        }
        data.basedata = basedata;

        updateDevice(id,data).then(res=>{
          console.log("收藏更新",res);
        }).catch(err=>{
          console.log("收藏失败",err);  
        })
      }
    }).catch(err => {
      console.log("err", err);
    })
  },
  //获取考试错题
  getErrorQuestions(objectId) {
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
        if(element.product.objectId ==objectId){
          test=element
          return;
        }
      });
      console.log(test);
      let list1 = []; //单选
      let list2 = [];  //多选
      let list3 = [];  //判断
      let list4 = [];  //材料
      test.basedata.errquestions.forEach(item=>{
        if(item.type=="单选题"){
          list1.push(item)
        }else if(item.type=="多选题"){
          list2.push(item)
        }else if(item.type=="判断题"){
          list3.push(item)
        }else{
          list4.push(item)
        }
      });
      let questionList = [...list1,...list2,...list3,...list4];
      let totalPage = test.basedata.errquestions.length
      this.setData({
        questionList,
        totalPage,
        paperName:test.basedata.name,
        singlelength:list1.length,
        mullength:list2.length,
        judgelength:list3.length,
        materlength:list4.length
      })
      wx.hideLoading()
    }).catch(err => {
      console.log("err", err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id:options.id,
      cont:options.cont
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
    if(options.cont=="2"){
      this.getErrorQuestions(options.id)
    }else{
      this.handleQueryQuestions(options.id,options.cont);
    }
  
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
    //  查询所有题信息，即顺序练题
    // if (options.bank_id) {
    //   wx.request({
    //     url: 'https://xlyt.zlzyy.club:444/API/kaoti.aspx',
    //     data: {
    //       bank_id: options.bank_id
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

    //  查询章节信息，即章节练题
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
        this.queryCollQuestions(username+'c')
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
          console.log(res.data)
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
   
    let cindex = event.currentTarget.dataset.index;
    if (this.data.questionList[num].type == '单选题' || this.data.questionList[num].type == '判断题') {
      //type_id为1与0时则进行下列赋值(单选或判断)
      // console.log("看看我有没有进入单选判断");
      // console.log("类型：" + this.data.questionList[num].type);
      var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10。。。。
      this.setData({ //在data数据里更新myChecked的值和当前选择的值
        myChecked: selectId,
        currentValue: selectId,
        flag_c:true,
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
      // var selectId = parseInt(event.currentTarget.dataset.selectid); //获取当前选项id
      // var multiIndex = this.data.multiIndex;
      // multiIndex[index].checked = !multiIndex[index].checked; //单击取反
      this.setData({
        multiIndex: multiIndex,
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

    }else if(this.data.questionList[num].type=="材料题"){
      if(this.data.questionList[num].questions[cindex].type=='单选题'||this.data.questionList[num].questions[cindex].type=='判断题'){
        var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10。。
        if(cindex==0&&this.data.questionList[num].questions[cindex].type=='单选题'){
          this.setData({
            myCheckedS:selectId
          })
        }else if(cindex==1&&this.data.questionList[num].questions[cindex].type=='单选题'){
          this.setData({
            myCheckedS1:selectId
          })
        }else{
          this.setData({
            myCheckedJ:selectId
          })
        }
      }else if(this.data.questionList[num].questions[cindex].type=='多选题'){
        
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
  queryErrQuestions(paperName,title,current) {
  
    let username='e'+wx.getStorageSync('username')+'e'
    QueryQuestion({
      order: "createdAt",
      limit: 20,
      skip: 0,
      where: `{"name":{"$in":["${username}"]}}`
    }).then(res => {
      console.log("query", res);
      let list = [];
      let flag = true;
      res.data.results.forEach(element => {
       if(element.basedata.name==paperName){
         if(title == element.basedata.questions.Question){
           flag = false
           return;
         }

       }
      });
      if(flag){
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
        let username = wx.getStorageSync('username')
        username = username.substring(username.length - 4)
        let objectId = `${hour}${minutes}${seconds}${username}`
        let name = 'e' + wx.getStorageSync('username') + 'e';
        let data = {
          "name": name,
          "devaddr": name,
          "product": {
            "__type": "Pointer",
            "className": "Product",
            "objectId": objectId
          },
          "basedata": {
            "name": this.data.paperName,
            "questions": this.data.questionList[current],
          }
        };
        console.log(data);
        CreateQuestion(data).then(res=>{
          console.log("创建成功",res);
        })
      }
     
     
    }).catch(err => {
      // console.log("err", err);
    })
  },
    //上一题
    on_question() {
      this.setData({
        scrollTop: 0,
        flag_c:false,
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
    console.log("当前current",this.data.current);
    
    if(this.data.questionList[this.data.current].type=="单选题"|| this.data.questionList[this.data.current].type=="判断题"||this.data.questionList[this.data.current].type=="多选题"){
      let nowanswer = '';
      let answer = this.data.questionList[this.data.current].Answer;
      let select = this.data.myChecked;
     if(this.data.questionList[this.data.current].type=="单选题"){
      nowanswer =  select==1?'A':select==10?'B':select==100?'C':select==1000?'D':'';
     }else if(this.data.questionList[this.data.current].type=="判断题"){
      nowanswer =  select==1?'正确':select==10?'错误':'';
     }else{
        if(this.data.multiIndex[0].checked)
        nowanswer = nowanswer+'A';
        if(this.data.multiIndex[1].checked)
        nowanswer = nowanswer+'B';
        if(this.data.multiIndex[2].checked)
        nowanswer = nowanswer+'C';
        if(this.data.multiIndex[3].checked)
        nowanswer = nowanswer+'D';
        if(this.data.multiIndex[4].checked)
        nowanswer = nowanswer+'E';
     }
    //  console.log(nowanswer);
      if(nowanswer==''||nowanswer!=answer){
        let current = this.data.current;
        // console.log("传递",current);
       this.queryErrQuestions(this.data.paperName,this.data.questionList[current].Question,current)
      }
    }else if(this.data.questionList[this.data.current].type=="材料题"){
      let myCheckedS = this.data.myCheckedS;
      let myCheckedS1 = this.data.myCheckedS1;
      let myCheckedJ = this.data.myCheckedJ;
    let nowanswer1 =  myCheckedS==1?'A':myCheckedS==10?'B':myCheckedS==100?'C':myCheckedS==1000?'D':'';
    let nowanswer2 =  myCheckedS1==1?'A':myCheckedS1==10?'B':myCheckedS1==100?'C':myCheckedS1==1000?'D':'';
    let nowanswer3 = '';
    if(this.data.multiIndex[0].checked)
    nowanswer3 = nowanswer3+'A';
    if(this.data.multiIndex[1].checked)
    nowanswer3 = nowanswer3+'B';
    if(this.data.multiIndex[2].checked)
    nowanswer3 = nowanswer3+'C';
    if(this.data.multiIndex[3].checked)
    nowanswer3 = nowanswer3+'D';
    if(this.data.multiIndex[4].checked)
    nowanswer3 = nowanswer3+'E';
   let nowanswer4 = myCheckedJ==1?'正确':myCheckedJ==10?'错误':'';
   console.log(nowanswer1,nowanswer2,nowanswer3,nowanswer4);
   let questions = this.data.questionList[this.data.current].questions;
   if(nowanswer1==""&&nowanswer2==""&&nowanswer3==""&&nowanswer4==""){
    let current = this.data.current;
    console.log("传递",current);
   this.queryErrQuestions(this.data.paperName,this.data.questionList[current].Question,current)
   }else if(nowanswer1==questions[0].Answer&&nowanswer2==questions[1].Answer&&nowanswer3==questions[2].Answer&&nowanswer4==questions[3].Answer){
   }else{
     let current = this.data.current;
     console.log("传递",current);
    this.queryErrQuestions(this.data.paperName,this.data.questionList[current].Question,current)
   }
    }
    this.setData({
      scrollTop: this.data.scrollTop = 0,
      flag_c:false
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
              Answer:that.data.questionList[0]
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
        myCheckedJ:0,
        myCheckedS:0,
        myCheckedS1:0,
        //当前选项值清0
        currentValue: 0,
        //收藏与报错功能初始化
        store: true,
        error: false,
        //查看答案按钮复原
        see_answer: false,

      })
      if(this.data.questionList[this.data.current].type!="材料题"){
        this.setData({
         Answer:this.data.questionList[this.data.current].Answer,
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})