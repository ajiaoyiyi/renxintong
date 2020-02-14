/**
 * 小程序授权
 * openid获取（微信针对不同的用户在不同的应用下都有唯一的一个openId）
 *  1、前端判断是否有unionid: wx.login获取code 传递给后端, 然后从微信后端换取到session_key openid,并返回给前端 
 * unionid获取（多平台下锁定是不是同一个用户）步骤：
 *  1、前端判断是否有unionid: wx.login获取code 传递给后端, 然后从微信后端换取到session_key openid,并返回给前端 
 *  2、前端判断返回值中是否有unionid 或者 unionid 是否为 null 
 *  3、如果有unionid，用户已经在同主体的App、公众号、小程序授权登录成功，然后调用接口获取平台用户信息
 *  4、如果无unionid，前端调用带有用户登录态的wx.getUserInfo()，然后再将微信返回的 encryptedData 和 iv 返回给后端，后端解密出相应的信息后再返回给前端；
 *      --使用 wx.getSetting 获取用户的授权情况 
        --如果用户已经授权，直接调用 API wx.getUserInfo 获取用户最新的信息；
        --用户未授权，在界面中显示一个按钮提示用户登入，当用户点击并授权后就获取到用户的最新信息。
 */

import { WechatLogin } from '../config/api.js'
import { setStorageSync } from '../utils/util.js'

//该版本人信通只需用到openid
function wxLogin(){
    wx.login({
        success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            let code = res.code
            WechatLogin({
                code: code
            }).then(res => {
                var openid = res.openid
                //添加到本地缓存
                setStorageSync('authid',openid)
                return res
            })
        },
        fail: e => {
            console.log('微信登录失败')
            return false
        }
    })
}

//登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log(res.code)
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })

module.exports = { wxLogin }