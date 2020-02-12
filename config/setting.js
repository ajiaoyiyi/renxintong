//获取当前帐号信息
const accountInfo = wx.getAccountInfoSync();

//获取当前小程序帐号信息miniProgram
const miniProgram = accountInfo.miniProgram

//获取当前环境
const env = miniProgram.envVersion

//配置环境地址
const baseUrl = {
	develop:'http://rap2api.taobao.org/app/mock/244012',   //开发版
	trial:'/',  //体验版
	release:'/', //正式版
	
}
const apiBaseURL = baseUrl[env];

module.exports = {
	apiBaseURL
}
