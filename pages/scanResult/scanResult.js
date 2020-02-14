import { PermitIn, PermitOut } from '../../config/api'
import { showSuccessToast, getStorageSync } from '../../utils/util.js'
Page({
  data:{
    state:"",  //出入扫码标识：0-进，1-出
    permit_id:"", //通行证ID
    userInfo:"",    //当前被扫人信息
    temperature: "",   //体温
    addr:"",   //详细地址
    previousMargin: '20rpx', //前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
    nextMargin: '20rpx', //后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
    currentSwiperIndex: 0, //swiper当前索引
    isValidate: false, //表单是否验证成功
    btnControl:{
      disabled: true,
      loading: false
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var state = options.state || "";
    var userInfo = options.userInfo && JSON.parse(options.userInfo) || "";
    var permit_id = options.id || "";
    var addr = ""
    if(userInfo){
      addr = userInfo.province + " " + userInfo.city + " " + userInfo.district + "\n" + userInfo.street + "\n" + userInfo.village + "\n" + userInfo.house_number
    }
    this.setData({
        permit_id: permit_id,
        state: state,
        userInfo: userInfo,
        addr: addr,
        btnControl: {
          disabled: this.data.isValidate ? false : true,
        }
      })
      this.initForm()
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
  initForm:function(){
    //初始化表单验证

  },
  bindSubmit:function(){
    this.setData({
      btnControl:{
        disabled: true,
        loading: true
      }
    })
    var that = this
    //通行证信息上报提交
    var state = this.data.state
    var params = {
      "scan_user_id": this.data.userInfo.user_id,  //扫描人用户id
      "permit_id": this.data.permit_id,  //被扫描的通行证id
      "temperature": this.data.temperature  //被扫描人体温
    }
    var api = state == 1 ? PermitIn : PermitOut
    api(params).then(res => {
        showSuccessToast('上报成功')
        that.setData({
          btnControl:{
            disabled: this.data.temperature ? false : true,
            loading: false
          }
        })
        //关闭当前页面 返回上一页面
        wx.navigateBack({
         delta: 1,
        })
      })
  },
   bindTemperatureInput: function (e) {
    //温度输入同步更新到data
    this.setData({
      temperature: e.detail.value,
      btnControl:{
        disabled: false,
        loading: false
      }
    });
  },
  swiperBindchange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current
    })
  }
})

/**button
 * 
 * 公共：disable loading bindtap
 * 三种状态：成功 蓝色可点击 disable=false loading=false bindtap
 *         禁用 灰色不可点击  disable=true loading=false 
 *          加载 白色遮罩 不可点击  disable=true loading=true 
 * 
 */