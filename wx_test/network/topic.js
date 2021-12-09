import {
  request
} from './config/request';
import{
  CreateDevice,
  QueryDevice,
  UpdateDevice
} from "./config/api"
// /classes/Device/{id}
//更新设备
export function updateDevice(id,data) {
  return new Promise(function (resolve, reject) {
    request({
      url: UpdateDevice+`/${id}`,
      data,
      method:'PUT'
    }).then(res=>{
      // console.log("create",res);
      if(res.statusCode==201 ||res.statusCode==200){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}
// 添加设备
export function CreateQuestion(data) {
  return new Promise(function (resolve, reject) {
    request({
      url: CreateDevice,
      data,
      method:'POST'
    }).then(res=>{
      // console.log("create",res);
      if(res.statusCode==201 ||res.statusCode==200){
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(err=>{
      reject(err);
    })
  });
}
//查询设备
export function QueryQuestion(data) {
  return new Promise(function (resolve, reject) {
    request({
      url: QueryDevice,
      data,
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