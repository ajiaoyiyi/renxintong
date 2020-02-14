import { PermitQRCode, PermitList, ScanQRCode } from '../../config/api'
import { showSuccessToast, getStorageSync, formatDate, rpx2px} from '../../utils/util.js'
import QRCode from '../../utils/weapp-qrcode.js'

const qrcodeWidth = rpx2px(180)
Page({
  data:{
    userInfo:"",
    permitListkey: [],
    permitList:[],
    state:"",    //出入扫码标识：1进门 2出门
    qrSrc:"",
    marks:{"0":"进门","1":"出门"},
    qrcodeWidth:qrcodeWidth,
    qrcodeTop: rpx2px(60)
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var userInfo = getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo: userInfo
      })
    }
    this.getPermitQRCode()
    this.permitList()
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
      new QRCode('qrImg',{
        text: qrcode,
        width: qrcodeWidth,
        height: qrcodeWidth,
        correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
        callback: (res) => {
          console.log(res.path)
          this.setData({
            qrSrc:res.path
          })
          // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
        }
        })
    })
  },
  permitList:function(){
    //获取通行证扫描记录
    var that = this;
    PermitList({
      "user_id":this.data.userInfo.user_id
    }).then(res => {
      var permitList = res.history[0];
      var permitListkey = Object.keys(permitList)  //解决日期为key
      // permitListkey = permitListkey.map(item => formatDate(item));
      that.setData({
        permitListkey: permitListkey,
        permitList: permitList
      })
    })
  },
  previewQRCode:function(){
    //点击放大二维码
    wx.previewImage({
      current: this.data.qrSrc, // 当前显示图片的http链接
      urls: [this.data.qrSrc] // 需要预览的图片http链接列表
    })
  },
  bindScanQRCode: function (e) {
    //进门\出门扫码
    this.setData({
      state: e.target.dataset.state
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
    var that = this;
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
          url: '../scanResult/scanResult?state='+that.data.state+'&permit_id='+res.id+'&userInfo='+JSON.stringify(res.user_info),
        })
      }
    })
  }
})