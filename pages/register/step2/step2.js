import { CheckIdCard } from '../../../config/api'
import { setStorageSync, getStorageSync, showToast,hideKeyboard } from '../../../utils/util'
import WxValidate from '../../../utils/wxValidate'
var app = getApp();
Page({
  data: {
		btnLoading: false,
		btnDisabled: false,
    registerInfo: "",  //上一步缓存的企业信息
    adjustPosition: false,  //键盘弹起时，是否自动上推页面
    department: "",  //部门
    position: "",  //职位
    work_id: "",  //工号
    name: "",  //姓名
    user_card_id: "",  //身份证号
    btnControl:{
      disabled: false,
      loading: false
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    var registerInfo = getStorageSync('registerInfo');
    if(registerInfo){
      this.setData({
        registerInfo: registerInfo
      })
    }

    this.initValidate();
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
  bindSubmit: function (e) {
    //提交下一步
    //关闭软键盘
    // hideKeyboard();
    var that = this;
    var params = {
      name:this.data.name,
      user_card_id:this.data.user_card_id
    }
    const params1 = e.detail.value
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params1)) {
        const error = this.WxValidate.errorList[0]
        showToast(error.msg)
        return false
    }
    //注册加载 d
      this.setData({
        btnControl:{
          disabled: true,
          loading: true
        }
      })
    
    //验证身份证
    CheckIdCard(params).then(res => {
      //合并更新注册
      var baseInfo = {
        department: this.data.department,  //部门
        position: this.data.position,  //职位
        work_id: this.data.work_id,  //工号
        name: this.data.name,  //姓名
        user_card_id: this.data.user_card_id  //身份证号
      }
      var registerInfo = Object.assign(this.data.registerInfo,baseInfo,res)
       console.log(registerInfo)
      //缓存注册信息
      setStorageSync('registerInfo',registerInfo)
      //下一步跳转step3
        wx.navigateTo({
          url: '../step3/step3',
        })
      })
      //注册加载
      setTimeout(function(){
        that.setData({
          btnControl:{
            disabled: false,
            loading: false
          }
        })
      },2000)
  },
  bindDepartmentInput: function (e) {
    //部门输入同步更新到data
    this.setData({
        department: e.detail.value
    });
  },
   bindPositionInput: function (e) {
    //职位输入同步更新到data
    this.setData({
        position: e.detail.value
    });
  },
   bindWorkidInput: function (e) {
    //工号输入同步更新到data
    this.setData({
        work_id: e.detail.value
    });
  },
   bindUserCardInput: function (e) {
    //身份证输入同步更新到data
    this.setData({
        user_card_id: e.detail.value
    });
  },
  bindNameInput: function (e) {
    //姓名输入同步更新到data
    this.setData({
        name: e.detail.value 
    });
  },
  initValidate:function(){
    const rules = {
        department: {
          required: true,
          maxlength: 20
        },
        position: {
          required: true,
          maxlength: 30
        },
        work_id: {
          required: true,
          maxlength: 20
        },
        name: {
          required: true,
          rangelength: [2, 20]
        },
        user_card_id: {
          required: true,
          idcard: true
        }
    };
    // 验证字段的提示信息，若不传则调用默认的信息
      const messages = {
          department: {
              required: '所在部门不能为空'
          },
          position: {
              required: '请输入职位'
          },
          work_id: {
             required: '请输入工号'
          },
          name: {
             required: '姓名不能为空',
             rangelength: '姓名至少为2~20个字符'
          },
          user_card_id: {
             required: '请输入身份证号码',
             idcard: '请输入正确的身份证号码',
          }
      }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  }
})