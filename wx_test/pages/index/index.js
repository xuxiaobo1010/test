import {
  QueryQuestion
} from '../../network/topic'
Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 500,
    dots: true,
    navItems: [{
      img: "/images/tabbar/topic-on.png",
      text: "题库",
      type: 1,
      url: "/pages/topic/topic"
    }, {
      img: "/images/tabbar/collect.png",
      text: "我的收藏",
      type: 0,
      url: "/pages/index/store/store"
    }, {
      img: "/images/tabbar/test-on.png",
      text: "考试记录",
      type: 1,
      url: "/pages/test/test"
    }, {
      img: "/images/tabbar/err.png",
      text: "错题",
      type: 2,
      url: "/pages/error/error"
    }, ],
    banners: [{
        picUrl: "https://gss0.baidu.com/70cFfyinKgQFm2e88IuM_a/baike/pic/item/3ac79f3df8dcd1009eb45920798b4710b9122f82.jpg"
      },
      {
        picUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic52.nipic.com%2Ffile%2F20141103%2F2561818_111733112830_2.jpg&refer=http%3A%2F%2Fpic52.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg",
      },
      {
        picUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdingyue.ws.126.net%2F2020%2F0514%2F036f4e4cj00qabe11001fc000hs00dcm.jpg&refer=http%3A%2F%2Fdingyue.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg"
      }

    ]
  },
  onShow(){
   let token = wx.getStorageSync('sessionToken') || '';
   if(token){
    this.handleQueryQuestions()
   }
  },
  handleQueryQuestions() {
    wx.showLoading({
      title: 'Loading...',
    })
    QueryQuestion({
      order: "createdAt",
      limit: 20,
      skip: 0,
      where: '{"name":{"$in":["轮播图"]}}'
    }).then(res => {
      console.log("query", res);
      let list = [];
      res.data.results.forEach(element => {
        let pic = {};
        pic.picUrl = element.basedata.img;
        list.push(pic)
      });
      this.setData({
        banners: list
      })
      wx.hideLoading()
    }).catch(err => {
      console.log("err", err);
    })
  },
  handleToQueryCollection() {
    //跳转收藏页面
    wx.navigateTo({
      url: '/pages/index/store/store',
    })
  },
  handleNavTo(e) {
    //  console.log(e);
    let {
      url,
      type
    } = e.currentTarget.dataset;
    console.log(url, type);
    if (type == 1) {
      wx.switchTab({
        url,
      })
    } else if (type == 2) {
      wx.navigateTo({
        url,
      })
    } else {
      this.handleToQueryCollection()
    }

  },
  bindSequence: function () {
    //跳转页面
    wx.navigateTo({
      url: '/pages/index/exam/exam?bank_id=1',
    })
  },
  bindRandom: function () {
    //跳转页面
    wx.navigateTo({
      url: '/pages/chapter/chapter',
    })
  },
  bindFavorite: function () {
    //跳转页面
    wx.navigateTo({
      url: '/pages/type_pre/type_pre',
    })
  },
  bindStore: function () {
    //跳转收藏页面
    wx.navigateTo({
      url: '/pages/index/store/store',
    })
  },
  bindError: function () {
    //跳转收藏页面
    wx.navigateTo({
      url: '/pages/index/error/error',
    })
  }

})