import {
  request
} from './config/request';
import{
  DeleteDevice
} from "./config/api"


//删除设备
export function DeleteErrQuestion(id) {
  return new Promise(function (resolve, reject) {
    request({
      url: DeleteDevice+`/${id}`,
      method:'delete'
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