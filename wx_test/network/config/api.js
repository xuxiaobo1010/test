var WxApiRoot =   'https://test.hgjzt.com' // 'http://101.35.187.227:5080' //http://test.hgjzt.com //'https://prod.dgiotcloud.com'; //cover.zjzhxx.com/
module.exports = {

  //用户相关
  AuthLogin: WxApiRoot + '/iotapi/login', //账号登录
  AuthChange:WxApiRoot + '/iotapi/classes/_User',//修改用户信息

  //题库相关
  CreateDevice:WxApiRoot+'/iotapi/classes/Device',
  QueryDevice:WxApiRoot+'/iotapi/classes/Device',
  UpdateDevice:WxApiRoot+'/iotapi/classes/Device',//更新设备
  DeleteDevice:WxApiRoot+'/iotapi/classes/Device',  //删除设备
  AuthLoginByWeixin: WxApiRoot + 'wx/auth/login_by_weixin', //微信登录
  AuthLoginByMobile: WxApiRoot + 'wx/auth/mobileLogin', //手机号登录
};