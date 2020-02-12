
import { apiBaseURL } from '../config/setting.js'
import { showErrorToast } from '/util.js'


/**
 * 封装微信请求request
 */
function request(params) {
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
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        console.log("success");
        //请求成功
        if (res.statusCode == 200) {
          // dataRequest 是 request请求返回数据中的data
          const dataRequest = res.data;
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
                return
              //用户未注册,跳转注册页面
              case 11002:
                wx.navigateTo({
                  url: '../pages/register/register'
                })
                break;
              case 10001: errorCreate('请求失败'); break;
              case 10002: errorCreate('数据库错误'); break;
              case 10003: errorCreate('参数缺失'); break;
              case 10004: errorCreate('网络请求失败'); break;
              case 10005: errorCreate('参数错误'); break;
              case 11001: errorCreate('注册信息错误'); break;
              case 12001: errorCreate('接入码校验失败'); break;
              case 13001: errorCreate('校验码发送失败'); break;
              case 13002: errorCreate('校验码已超时,请从新获取'); break;
              case 20010: errorCreate('身份证号为空或非法'); break;
              case 20310: errorCreate('姓名为空或非法'); break;
              case 20410: errorCreate('姓名与身份证号不匹配'); break;
              // 其它和后台约定的 code  特殊code 没有返回信息时处理 其他不正确code走default
              default:
                  const { errMsg } = dataRequest.errMsg
                  errorCreate(errMsg)
                  reject(dataRequest);
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
    showErrorToast(errMsg)
    throw err;
}
module.exports = {
  request
}