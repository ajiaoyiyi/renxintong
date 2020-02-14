import { UserRegister, SendTelVerify, CheckTelVerify } from '../../../config/api'
import { showSuccessToast, getStorageSync,showErrorToast } from '../../../utils/util.js'
import WxValidate from '../../../utils/wxValidate'
import { cityData } from '../../../utils/cityData'
var app = getApp();
var array;
Page({
  data: {
    multiArray: [],
    multiIndex: [0, 0, 0, 0],
    chinaData: [],
    code: "",  //验证码
    registerInfo: "",
    getCodeflag: false,
    currentTime: 60,
    currentflag: false,
    citiesIndex: [0, 0, 0, 0],
    cityArray: "",
    phone: "", //电话
    house_number: "", //房号
    village: "", //小区
    cityInfo:{
      province: "", //省
      city: "", //市
      district: "", //区
      street: "", //街道
    },
    btnControl:{
      disabled: false,
      loading: false
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    var registerInfo = getStorageSync('registerInfo');
    var authid = getStorageSync('authid');
    if(registerInfo){
      registerInfo.user_number = authid
      this.setData({
        registerInfo: registerInfo
      })
    }

    this.initValidate()
    this.initCity()
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  onUnload: function () {
    // 页面关闭

  },
  sendTelVerify: function(){
    var that = this;
    var phone = this.data.phone;
    var reg = /^1[3456789]\d{9}$/;
    if(!reg.test(phone)){
      showErrorToast('请输入正确的手机号码')
      return false
    }
    this.setData({
      getCodeflag: false,
      currentflag: true
    })
    //倒计时
    var interval = setInterval(function () {
      this.setData({
        currentTime: this.data.currentTime - 1
      })
      if (this.data.currentTime <= 0) {
        clearInterval(interval)
        this.setData({
          currentTime: 60,
          getCodeflag: phone ? true : false,
          currentflag: false
        })
      }
    }.bind(this), 1000)

    //发送手机验证码
    SendTelVerify({
      "phone":phone
    }).then(res => {
      //发送成功
      showSuccessToast('发送成功')
    }).catch( e => {})
  },
  bindSubmit: function(e){
    //提交注册
    var that = this;
    // 传入表单数据，调用验证方法
    const params1 = e.detail.value
    if (!this.WxValidate.checkForm(params1)) {
        const error = this.WxValidate.errorList[0]
        showErrorToast(error.msg)
        return false
    }
    //注册提交加载
    this.setData({
       btnControl:{
         disabled: true,
         loading: true
      }
    })
    //先效验手机验证码，效验成功，执行提交
    CheckTelVerify({
      "phone":this.data.phone,
      "code":this.data.code
    }).then(res => {
      //验证成功，提交注册
      that.registerSubmit()
    }).catch( e => {
      this.setData({
        btnControl:{
          disabled: false,
          loading: false
        }
      })
    })
  },
  registerSubmit: function () {
    var that = this;
    var baseInfo = {
      phone: this.data.phone, //电话
      house_number: this.data.house_number, //房号
      village: this.data.village, //小区
    }
    var params = Object.assign(this.data.registerInfo,this.data.cityInfo,baseInfo)
    UserRegister(params).then(res => {
      //注册成功，关闭所有页面，跳转启动页
      wx.reLaunch({
        url: '../../auth/auth'
      })
    })
   // 注册提交加载关闭
   setTimeout(function(){
      that.setData({
        btnControl:{
          disabled: false,
          loading: false
        }
      })
    },2000)
  },
  bindTelInput: function (e) {
    //电话输入同步更新到data
    this.setData({
      phone: e.detail.value,
      getCodeflag: e.detail.value ? true :false
    });
  },
   bindHouseNumberInput: function (e) {
    //房号输入同步更新到data
    this.setData({
        house_number: e.detail.value
    });
  },
   bindVillageInput: function (e) {
    //小区输入同步更新到data
    this.setData({
        village: e.detail.value
    });
  },
   bindCodeInput: function (e) {
    //验证码输入同步更新到data
    this.setData({
        code: e.detail.value
    });
  },
  initValidate:function(){
    const rules = {
        phone: {
          required: true,
          tel: true
        },
        house_number: {
          required: true,
          maxlength: 30
        },
        village: {
          required: true,
          maxlength: 50
        },
        code: {
          required: true
        }
    };
    // 验证字段的提示信息，若不传则调用默认的信息
      const messages = {
          phone: {
              required: '请输入手机号',
              tel: '请输入正确的手机号',
          },
          house_number: {
              required: '请输入房号'
          },
          village: {
             required: '请输入详细地址'
          },
          code: {
             required: '请输入验证码'
          },
      }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
  initCity: function(){
    var that = this;
    if(wx.getStorageSync("cityData")){
      array = wx.getStorageSync("cityData");
      that.initData();
    } else {
       array = cityData;
      wx.setStorageSync("cityData", cityData);
      that.initData();
      // wx.request({
      //   url: '../../../utils/cityData',
      //   success: res => {
      //     console.log(res)
      //     array = res.data;
      //     wx.setStorageSync("cityData", res.data);
      //     that.initData();
      //   }
      // });
    }
  },
  initData: function(){
      var chinaData = array;
      this.data.chinaData = chinaData;
      var sheng = []; //  设置省数组
      for (var i = 0; i < chinaData.length; i++) {
        sheng.push(chinaData[i].name);
      }
      this.setData({
        "multiArray[0]": sheng
      })
      this.getCity(); // 得到市
  },
    getCity: function () { //  得到市
      var shengNum = this.data.multiIndex[0];
      var chinaData = this.data.chinaData;
      var cityData = chinaData[shengNum].children;
      var city = [];
      for (var i = 0; i < cityData.length; i++) {
        city.push(cityData[i].name)
      }
      this.setData({
        "multiArray[1]": city
      })
      this.getXian();
    },
    getXian: function (e) { //  得到县
      var shengNum = this.data.multiIndex[0];
      var cityNum = this.data.multiIndex[1];
      var chinaData = this.data.chinaData;
      var xianData = chinaData[shengNum].children[cityNum].children;
      var xian = [];
      for (var i = 0; i < xianData.length; i++) {
        xian.push(xianData[i].name)
      }
      this.setData({
        "multiArray[2]": xian
      })
      this.getZhen();
    },
    getZhen: function () { //  得到镇
      var shengNum = this.data.multiIndex[0];
      var cityNum = this.data.multiIndex[1];
      var xianNum = this.data.multiIndex[2];
      var chinaData = this.data.chinaData;
      var zhenData = chinaData[shengNum].children[cityNum].children[xianNum].children;
      var zhen = [];
      for (var i = 0; i < zhenData.length; i++) {
        zhen.push(zhenData[i].name)
      }
      this.setData({
        "multiArray[3]": zhen
      })
    },
  
  //列滚动事件
  bindMultiPickerColumnChange: function (e) {
    var move = e.detail;
    var index = move.column;
    var value = move.value;
    if (index == 0) {
      this.setData({
        multiIndex: [value, 0, 0, 0]
      })
      this.getCity();
    }
    if (index == 1) {
      this.setData({
        "multiIndex[1]": value,
        "multiIndex[2]": 0,
        "multiIndex[3]": 0
      })
      this.getXian();
    }
    if (index == 2) {
      this.setData({
        "multiIndex[2]": value,
        "multiIndex[3]": 0,

      })
      this.getZhen();
    }
    if (index == 3) {
      this.setData({
        "multiIndex[3]": value
      })
      this.getZhen();
    }
  },
  //选择器选择事件
  bindMultiPickerChange(e){
    let cityIndex = e.detail.value;
    //选择的地址拼接
    this.setData({
      cityInfo:{
        province: this.data.multiArray[0][this.data.multiIndex[0]], //省
        city: this.data.multiArray[1][this.data.multiIndex[1]], //市
        district: this.data.multiArray[2][this.data.multiIndex[2]], //区
        street: this.data.multiArray[3][this.data.multiIndex[3]], //街道
      }  
    })
  }
})