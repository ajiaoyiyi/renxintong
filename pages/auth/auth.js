
import { UserInfo } from '../../config/api.js'
Page({
  data:{
    text:"启动页"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.initData();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  initData:function(){
    //初始化页面
    var union_id = wx.getStorageSync('union_id');
    if(union_id){
      //如果union_id存在 获取用户信息
      this.getUserInfo(union_id)
    }else{
      //如果union_id不存在 去授权获取微信用户信息
      // 查看是否授权获取userInfo
      wx.getSetting({
        success (res){
          if (res.authSetting['scope.userInfo']) {
            console.log('已授权')
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                console.log(res.userInfo)
              }
            })
          }else{
            console.log('未授权')
            //提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功
            wx.authorize({
              scope: 'scope.userInfo',
              success () {
                // 用户已经同意小程序获取用户信息，后续调用 wx.startRecord 接口不会弹窗询问
                console.log('')
              }
            })
          }
        }
      })
    }
  },
  getUserInfo: function(union_id){
    //获取当前登录用户信息
    UserInfo({
      "user_number":union_id
    }).then(res => {
      //用户信息获取成功，缓存信息
      wx.setStorageSync('userInfo',res)
    })
  }
})