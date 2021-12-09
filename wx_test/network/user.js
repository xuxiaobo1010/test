import {
  request
} from './config/request';
import{
  AuthLogin,
  AuthChange
} from "./config/api"
// 用户登录
export function Login(data) {
  return new Promise(function (resolve, reject) {
    request({
      url: AuthLogin,
      data,
      header:{
        'content-type': 'text/plain'
      },
      method:'POST'
    }).then(res=>{
      console.log("login",res);
      if(res.statusCode==200){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}
//修改用户信息
export function ChangeUserInfo(id,data) {
  return new Promise(function (resolve, reject) {
    request({
      url: AuthChange+`/${id}`,
      data,
      method:'PUT'
    }).then(res=>{
      // console.log("query",res);
      if(res.statusCode==200||res.statusCode==201){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}


//获取企业列表
export function getCompanyList() {
  return new Promise((resolve, reject) => {
    request({
      url: DeptQueryUserDept,
      method: 'GET'
    }).then(res => {
      if (res.errno === 0) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err => {
      reject(err);
    })
  })
}

// 用户登录
export const userLogin = (username,password) => {
  return new Promise(function (resolve, reject) {
    return login().then((res) => {
      request({
        url: AuthLoginByAccount,
        data: {
          code: res.code,
          username,
          password,
        },
        method: 'POST'
      }).then(res => {
        if (res.errno === 0) {
          console.log("",res);
          
          wx.setStorageSync('token', res.data.token);
          // let userInfo = {id,}
          let {id,username,gender,nickname,mobile,weixinOpenid,deptId,avatar} = res.data.admin;
          //userInfo  = res.data.admin;
          let userInfo = {id,username,gender,nickname,mobile,weixinOpenid,deptId,avatar};
          !userInfo.mobile? userInfo.isMobile = false : userInfo.isMobile = true;
          !userInfo.weixinOpenid ? userInfo.isOpenId = false : userInfo.isOpenId = true;

        // userInfo.avatarUrl = res.data.admin.avatar;
          //存放到全局globaldata
          var app = getApp();
          app.globalData.userInfo = userInfo ;
          //app.globalData.hasLogin = true;
         console.log("global:",app.globalData.userInfo);
          
         wx.setStorageSync('userInfo', userInfo);
          resolve(res);
        } else {
          reject(res);
        }
      }).catch(err => {
        reject(err);
      })
    }).catch((err) => {
      reject(err);
    })
  })
}