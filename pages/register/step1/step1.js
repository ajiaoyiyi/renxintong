import { AccessCode } from '../../../config/api'
import { setStorageSync, getStorageSync } from '../../../utils/util'
var app = getApp();
var roleText = {
      topManager: "可对管理员及公司所有员工进行员工出入管理以及体温检测",
      admin:"可对公司所有员工进行员工出入管理以及体温检测"
}
Page({
  data: {
    accessCode: '',   //系统接入码
    hiddenTip: true,   //是否显示角色内容
    companyName: "",  //公司名称
    roleText: "",    //角色名称
    roleLimitText: "",  //角色权限文字
    errorCode: false,    //接入码错误
    btnControl:{
      disabled: true,
      loading: false
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    this.setData({
      btnControl: {
          disabled: this.data.errorCode ? false : true,
        }
    })

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
  checkAccessCode: function () {
    //校验输入的接入码
    var that = this;
    const params = {
      "access_code": this.data.accessCode
    }
    AccessCode(params).then(res => {
      //根据角色显示不同的文案：1员工，2管理员，3企业高层
      that.setData({
       btnControl:{
          disabled: false,
          loading: false
        },
        hiddenTip: false,
        companyName: res.company_name,
        roleText: res.role_name,
        roleLimitText: res.role_id === 2 ? roleText.admin : res.role_id === 3 ? roleText.topManager : "",
      })
      // .catch(error => {
      //   //接入码错误
      //   this.setData({
      //     errorCode:true,
      //     btnDisabled: true
        // })
      // })

      //缓存机构信息
      setStorageSync('registerInfo',res)
    })
  },
  bindSubmit: function () {
    var that = this
    //下一步跳转step2
    this.setData({
        btnControl:{
          disabled: true,
          loading: true
        }
    });
    wx.navigateTo({
      url: '../step2/step2',
      success:function(){
           that.setData({
              btnControl:{
                disabled: false,
                loading: false
              }
          });
      }
    })
    
  },
  getCodeInput: function (e) {
    //输入同步更新到data
    var val = e.detail.value;
    this.setData({
      accessCode: val,
      hiddenTip: true
    });
  },
  clearInput: function (e) {
		this.setData({
			accessCode: '',
			btnDisabled: true
		});
  }
})