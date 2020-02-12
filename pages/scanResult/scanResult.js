import { PermitIn, PermitOut } from '../../config/api'
import { showSuccessToast } from '../../utils/util.js'
Page({
  data:{
    state:"",  //出入扫码标识：1进门 2出门
    permit_id:"", //通行证ID
    userInfo:"",    //当前被扫人信息
    temperature:""   //体温
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var state = options.state
    var userInfo = options.userInfo
    var permit_id = options.permit_id
    this.setData({
        permit_id: permit_id,
        state: state,
        userInfo: userInfo
      })
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
  bindSubmit:function(){
    //通行证信息上报提交
    var state = this.data.state
    var api = state == 1 ? 'PermitIn' : 'PermitOut'
    api({
      "user_number": wx.getStorageSync('union_id') || '',
      "permit_id": this.data.permit_id,
      "temperature": this.data.temperature
    }).then(res => {
      showSuccessToast('上报成功')
      //返回上一页面
      wx.navigateBack({
        delta: 1
      })
    })
  },
   bindTemperatureInput: function (e) {
    //温度输入同步更新到data
    this.setData({
      temperature: e.detail.value
    });
  },
})