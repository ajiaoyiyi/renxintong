import { CheckIdCard } from '../../../config/api'
var app = getApp();
Page({
  data: {
		btnLoading: false,
		btnDisabled: false,
    registerInfo: "",  //上一步缓存的企业信息
    baseInfo:{
      department: "",  //部门
      position: "",  //职位
      work_id: "",  //工号
      name: "刘治逸",  //姓名
      user_card_id: "612301199410248632",  //身份证号
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
  bindSubmit: function () {
    //提交下一步
    var that = this;
    var params = {
      name:this.data.baseInfo.name,
      user_card_id:this.data.baseInfo.user_card_id
    }
    //验证身份证
    CheckIdCard(params).then(res => {
      //合并更新注册自你洗
      var registerInfo = Object.assign(this.data.registerInfo,this.data.baseInfo,res)
      //缓存注册信息
      wx.setStorageSync('registerInfo',registerInfo)
      //下一步跳转step3
      setTimeout(function() {
        wx.navigateTo({
          url: '../step3/step3',
        })
      }, 2000);
    })
  },
  bindDepartmentInput: function (e) {
    //部门输入同步更新到data
    this.setData({
      baseInfo:{
        department: e.detail.value
      }  
    });
  },
   bindPositionInput: function (e) {
    //职位输入同步更新到data
    this.setData({
      baseInfo:{
        position: e.detail.value
      }  
    });
  },
   bindWorkidInput: function (e) {
    //工号输入同步更新到data
    this.setData({
      baseInfo:{
        department: e.detail.value
      }  
    });
  },
   bindUserCardInput: function (e) {
    //身份证输入同步更新到data
    this.setData({
      baseInfo:{
        user_card_id: e.detail.value
      }  
    });
  },
  bindNameInput: function (e) {
    //姓名输入同步更新到data
    this.setData({
      baseInfo:{
        name: e.detail.value
      }  
    });
  }
})