
import { apiBaseURL } from '../config/setting.js'
import { showErrorToast } from '/util.js'
const CryptoJS = require('aes/aes.js')
// //aes 加密
// let name_value = CryptoJS.AesEncrypt('abc');
// console.log('123456--aes 加密', name_value)
// //aes 解密
// console.log('123456--aes 解密', CryptoJS.AesDecrypt(name_value))




/**
 * 封装微信请求request
 */
function request(params) {
    //对参数加密
    var dataString = JSON.stringify(params.data)
    var newJson = {"JsonString":CryptoJS.AesEncrypt(dataString)} 
     params.data = newJson
    //  console.log(params.data)
    //  if(params.data){
    //    return false;
    //  }
     
  //初始化对象参数
  const {
    url,
    method = 'GET',
    data = {}
  } = params;
  
  return new Promise(function (resolve, reject) {
    wx.request({
      url: apiBaseURL + url,
      data: data,
      method: method,
      header: {
        "Content-Type":"application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("success");
        //请求成功
        if (res.statusCode == 200) {
          // dataRequest 是 request请求返回数据中的data
          var dataRequest = res.data;
          var aesData = dataRequest.JsonString
          //解密
          dataRequest = JSON.parse(CryptoJS.AesDecrypt(aesData))
          //跟后台约定的状态码
          const { code } = dataRequest
          // 根据 code 进行判断
          if (code === undefined) {
            // 如果没有 code 代表出错
            const { errMsg } = dataRequest
            showErrorToast(errMsg)
            reject(dataRequest);
          } else {
             // 有 code 代表请求正常 可以进行进一步的判断
            switch (code) {
              // code === 0 操作成功
              case 0:
                resolve(dataRequest.data);
                break;
              //用户未注册,跳转注册页面
              case 11002:
                setTimeout(function() {
                  wx.redirectTo({
                    url: '../register/step1/step1',
                  })
                }, 1500);
                break;
              case 10001: reject(dataRequest); errorCreate('请求失败'); break;
              case 10002: reject(dataRequest); errorCreate('数据库错误'); break;
              case 10003: reject(dataRequest); errorCreate('参数缺失'); break;
              case 10004: reject(dataRequest); errorCreate('网络请求失败'); break;
              case 10005: reject(dataRequest); errorCreate('参数错误'); break;
              case 11001: reject(dataRequest); errorCreate('注册信息错误'); break;
              case 11003: reject(dataRequest); errorCreate('注册信息未完善'); break;
              case 12001: reject(dataRequest); errorCreate('接入码校验失败');  break;
              case 13001: reject(dataRequest); errorCreate('校验码发送失败');  break;
              case 13002: reject(dataRequest); errorCreate('校验码已超时,请重新获取'); break;
              case 20010: reject(dataRequest); errorCreate('身份证号为空或非法'); break;
              case 20310: reject(dataRequest); errorCreate('姓名为空或非法'); break;
              case 20410: reject(dataRequest); errorCreate('姓名与身份证号不匹配'); break;
              case 20510: reject(dataRequest); errorCreate('微信用户登录失败'); break;
              case 20511: reject(dataRequest); errorCreate('用户已授权'); break;
              case 20610: reject(dataRequest); errorCreate('微信用户信息解析失败'); break;
              // 其它和后台约定的 code  特殊code 没有返回信息时处理 其他不正确code走default
              default:
                  const { errMsg } = dataRequest.errMsg
                  errorCreate(errMsg)
                  reject(dataRequest);
                  break;
                }

            }
          } else {
            //网络请求失败
            errorCreate(errMsg)
            reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

// 创建一个错误
function errorCreate (msg) {
    const err = new Error(msg);
    showErrorToast(msg)
    throw err;
    
}
module.exports = {
  request
}