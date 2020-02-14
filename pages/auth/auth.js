
import { UserInfo } from '../../config/api.js'
import { getStorageSync, setStorageSync } from '../../utils/util.js'
import { WechatLogin } from '../../config/api.js'
Page({
  data:{
    text:"启动页加载中..."
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
    var authid = getStorageSync('authid');
    var that = this;
    if(authid){
      //如果微信授权authid存在 获取用户信息
      this.getUserInfo(authid)
    }else{
      //如果微信授权authid不存在,去微信登录
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
                that.initData()
                return
            })
        }
    })
    }
  },
  getUserInfo: function(authid){
    //获取当前登录用户信息
    UserInfo({
      "user_number":authid
    }).then(res => {
      //用户信息获取成功，缓存信息
      setStorageSync('userInfo',res);
      this.bindToIndex();
    })
  },
  bindToIndex:function(){
    //跳转首页：关闭所有页面 跳转到首页
    wx.redirectTo({
      url: '../index/index'
    })
  },
  bindToRegister:function(){
    //跳转注册：关闭所有页面 跳转到首页
    wx.reLaunch({
      url: '../register/step1/step1'
    })
  }
})