import { PermitQRCode, PermitList, ScanQRCode } from '../../config/api'
import { showSuccessToast } from '../../utils/util.js'
Page({
  data:{
    userInfo:"",
    permitList:[],
    state:"",    //出入扫码标识：1进门 2出门
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo: userInfo
      })
    }
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
  getPermitQRCode:function(){
    //获取通行证电子二维码
    PermitQRCode({
      "user_id":this.data.userInfo.user_id
    }).then(res => {
      //获取二维码字符串
      var qrcode = res.qrcode
      //生成二维码
    })
  },
  permitList:function(){
    //获取通行证扫描记录
    var that = this;
    PermitList({
      "user_number":wx.getStorageSync('union_id')
    }).then(res => {
      that.setData({
        permitList: res
      })
    })
  },
  previewQRCode:function(){
    //点击放大二维码
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [] // 需要预览的图片http链接列表
    })
  },
  inScanQRCode: function () {
    //进门扫码
    this.setData({
      state: 1
    });
    this.scanCode()
  },
  outScanQRCode: function (e) {
    //出门扫码
    this.setData({
      state: 2
    });
    this.scanCode()
  },
  scanCode:function(){
    var that = this;
    //调起客户端扫码界面进行扫码
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,  //只允许从相机扫码
      success (res) {
        //扫码成功
        var result = res.result
        that.getScanQRCodeInfo(result)
      },
      fail (res) {
        console.log('启动失败')
      }
    })
  },
  getScanQRCodeInfo:function(result){
    //扫码成功获取通行证信息
    ScanQRCode({
      "qrcode":result
    }).then(res => { 
      //通行证是否有效，0-无效，1-有效
      var is_effect = res.is_effect
      if(is_effect === 0){
        showSuccessToast("二维码已失效，请重新扫描")
      }else{
      //跳转结果页
        wx.navigateTo({
          url: '../scanResult/scanResult?state='+that.data.state+'&permit_id='+res.permit_id+'&userInfo='+res.user_info,
        })
      }
    })
  }
})