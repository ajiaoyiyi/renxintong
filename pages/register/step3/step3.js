import { UserRegister, SendTelVerify, CheckTelVerify, CityDataUrl } from '../../../config/api'
import { showSuccessToast, getStorageSync,showToast } from '../../../utils/util.js'
import WxValidate from '../../../utils/wxValidate'
var app = getApp();
var array;
Page({
  data: {
    code: "",  //验证码
    registerInfo: "",
    getCodeflag: false,
    currentTime: 60,
    currentflag: false,
    citiesIndex: [0, 0, 0, 0],
    cityArray: [],
    selectedAddress: "",
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
    this.initCity()
    var registerInfo = getStorageSync('registerInfo');
    var authid = getStorageSync('authid');
    if(registerInfo){
      registerInfo.user_number = authid
      this.setData({
        registerInfo: registerInfo
      })
    }
    this.initValidate()
    
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
    var that = this;
    var phone = this.data.phone;
    var reg = /^1[3456789]\d{9}$/;
    if(!reg.test(phone)){
      showToast('请输入正确的手机号码')
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
        showToast(error.msg)
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
    array = wx.getStorageSync("cityData");
    if(array){
       that.initData();
    }else{
      app.initCityData(function(){
        that.initCity()
      })
    }
  },
  initData: function(){
    let cityArray = [[], [], [], []];  //选择器数据
    
    for (let i = 0, len = array.length; i < len; i++) {  //存入省
      cityArray[0].push({
        name: array[i].name,
        code: array[i].code
      });
    }
    for (let j = 0, len = array[0].children.length; j < len; j++) {  //存入市，默认关联第一个省
      cityArray[1].push({
        name: array[0].children[j].name,
        code: array[0].children[j].code
      });
    }
    for (let k = 0, len = array[0].children[0].children.length; k < len; k++) {  //存入区，默认关联第一个省的第一个市
      cityArray[2].push({
        name: array[0].children[0].children[k].name,
        code: array[0].children[0].children[k].code
      });
    }

    for (let s = 0, len = array[0].children[0].children[0].children.length; s < len; s++) {  //存入街道，默认关联第一个省的第一个市的第一个区
      cityArray[3].push({
        name: array[0].children[0].children[0].children[s].name,
        code: array[0].children[0].children[0].children[s].code
      });
    }
    this.setData({
      cityArray: cityArray
    });
  },
  //列滚动事件
  bindMultiPickerColumnChange(e){
    let selectedIndex = e.detail.value;  //滚动到哪一项

    let cityArray = this.data.cityArray;
    let list1 = []; //存放第二列数据，即市的列
    let list2 = []; //存放第三列数据，即区的列
    let list3 = []; //存放第四例数据，即街道的列

    let citiesIndex = [];
    let provinceIndex = this.data.citiesIndex[0];  //选中的省索引
    let cityIndex = this.data.citiesIndex[1];  //选中的市索引 
    let areaIndex = this.data.citiesIndex[2];  //选中的区索引

    switch (e.detail.column) {  //判断滚动的哪一列并做相应的数据处理
      case 0: //滚动第一列，即省的那一列
        for(let i = 0,len = array[selectedIndex].children.length;i<len;i++){ //存入省下面的市
          list1.push({
            name: array[selectedIndex].children[i].name,
            code: array[selectedIndex].children[i].code
          });
        }
        for (let j = 0, len = array[selectedIndex].children[0].children.length; j < len; j++) { //存入市下面的区
          list2.push({
            name: array[selectedIndex].children[0].children[j].name,
            code: array[selectedIndex].children[0].children[j].code
          });
        }
        for (let k = 0, len = array[selectedIndex].children[0].children[0].children.length; k < len; k++) {//存入区下面的街道
          list3.push({
            name: array[selectedIndex].children[0].children[0].children[k].name,
            code: array[selectedIndex].children[0].children[0].children[k].code
          });
        }


        citiesIndex = [selectedIndex, 0, 0, 0];   //记录索引
        break;
      case 1:  //滚动第二列，即市的那一列
        list1 = cityArray[1];  //市那一列数据不需要更新

        for(let i = 0,len = array[provinceIndex].children[selectedIndex].children.length;i<len;i++){//存入市下面的区
          list2.push({
            name: array[provinceIndex].children[selectedIndex].children[i].name,
            code: array[provinceIndex].children[selectedIndex].children[i].code
          });
        }

        for (let j = 0, len = array[provinceIndex].children[selectedIndex].children[0].children.length; j < len; j++) {//存入区下面的街道
          list3.push({
            name: array[provinceIndex].children[selectedIndex].children[0].children[j].name,
            code: array[provinceIndex].children[selectedIndex].children[0].children[j].code
          });
        }
        citiesIndex = [provinceIndex, selectedIndex, 0, 0];  //记录索引
        break;
      case 2: //滚动第三列，即区的那一列
        list1 = cityArray[1]; //市和区的数据都需要更新
        list2 = cityArray[2];

        for (let i = 0, len = array[provinceIndex].children[cityIndex].children[selectedIndex].children.length; i < len; i++) { //存入区下面的街道
          list3.push({
            name: array[provinceIndex].children[cityIndex].children[selectedIndex].children[i].name,
            code: array[provinceIndex].children[cityIndex].children[selectedIndex].children[i].code
          });
        }
    
        citiesIndex = [provinceIndex, cityIndex, selectedIndex, 0];  //记录索引
        break;
      case 3: //滚动第四列，即街道那一列
        list1 = cityArray[1];
        list2 = cityArray[2];
        list3 = cityArray[3];

        citiesIndex = [provinceIndex, cityIndex, areaIndex, selectedIndex];  //记录索引
        break;
    }
    this.setData({
      [`cityArray[1]`]: list1,//重新赋值第二列数组，即联动了市
      [`cityArray[2]`]: list2,//重新赋值第三列数组，即联动了区
      [`cityArray[3]`]: list3,//重新赋值第四列数组，即联动了街道
      citiesIndex: citiesIndex,//更新索引
    });
  },
   //选择器选择事件
  bindMultiPickerChange(e){
    let cityIndex = e.detail.value;
    let province = array[cityIndex[0]].name;
    let city = array[cityIndex[0]].children[cityIndex[1]].name;
    let district = array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].name;
    let street = array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].children[cityIndex[3]].name;
    //选择的地址拼接
    let selectedAddress = province + ' ' +  city + ' ' +  district  + ' ' + street;
    //选择的区域编码
    let areaCode = array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].children[cityIndex[3]].code;
    this.setData({
      selectedAddress:selectedAddress,
      cityInfo:{
        province: province, //省
        city: city, //市
        district: district, //区
        street: street, //街道
      }  
    })
  }
  
})