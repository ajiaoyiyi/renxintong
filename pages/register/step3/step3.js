import { UserRegister, SendTelVerify, CheckTelVerify } from '../../../config/api'
import { showSuccessToast } from '../../../utils/util.js'
var app = getApp();
Page({
  data: {
		btnLoading: false,
		btnDisabled: false,
    code: "673193",  //验证码
    registerInfo: "",
    baseInfo:{
      phone: "123456", //电话
      house_number: "", //房号
      province: "", //省
      city: "", //市
      district: "", //区
      street: "", //街道
      village: "" //小区
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    var registerInfo = wx.getStorageSync('registerInfo');
    if(registerInfo){
      this.setData({
        registerInfo: registerInfo
      })
    }

  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  sendTelVerify: function(){
    //发送手机验证码
    SendTelVerify({
      "phone":this.data.baseInfo.phone
    }).then(res => {
      //发送成功
      showSuccessToast('发送成功')
    })
  },
  bindSubmit: function(){
    //提交注册
    var that = this;
    //先效验手机验证码，效验成功，执行提交
    CheckTelVerify({
      "phone":this.data.baseInfo.phone,
      "code":this.data.code
    }).then(res => {
      //验证成功，提交注册
      that.registerSubmit()
    })
  },
  registerSubmit: function () {
    var params = Object.assign(this.data.registerInfo,this.data.baseInfo)
    UserRegister(params).then(res => {
      //注册成功，关闭所有页面，跳转启动页
      wx.reLaunch({
        url: '../../../auth/auth'
      })
    })
  },
  bindPhoneInput: function (e) {
    //电话输入同步更新到data
    this.setData({
      baseInfo:{
        phone: e.detail.value
      }  
    });
  },
   bindHouseNumberInput: function (e) {
    //房号输入同步更新到data
    this.setData({
      baseInfo:{
        house_number: e.detail.value
      }  
    });
  },
   bindVillageInput: function (e) {
    //小区输入同步更新到data
    this.setData({
      baseInfo:{
        village: e.detail.value
      }  
    });
  },
   bindCodeInput: function (e) {
    //验证码输入同步更新到data
    this.setData({
        code: e.detail.value
    });
  },
  choseCityInput: function (e) {
    //姓名输入同步更新到data
    this.setData({
      baseInfo:{
        province: "", //省
        city: "", //市
        district: "", //区
        street: "", //街道
      }  
    });
  },
})