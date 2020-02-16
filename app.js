//app.js
import { CityDataUrl } from 'config/api'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    //获取微信当前小程序运行的客户端基础库版本
    const SDKVersion = wx.getSystemInfoSync().SDKVersion
    //小程序后台设置的版本库
    const version = "2.10.1"
    if (this.compareVersion(SDKVersion, version) < 0) {
      // 如果希望用户在最新版本的客户端上体验您的小程序
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    //初始化获取省市区
    this.initCityData()
  },
  initCityData: function(callback){
    if(wx.getStorageSync("cityData")){
      console.log('已缓存')
    } else {
      wx.request({
        url: CityDataUrl,
        success: res => {
          wx.setStorageSync("cityData", res.data.area);
          callback()
        }
      });
    }
  },
  compareVersion: function (v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  }

  })
  