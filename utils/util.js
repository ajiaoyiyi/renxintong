/**
 * 格式化时间
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 年-月-日 时间格式截取月-日
 */
const formatDate = date => {
  date = date.toString()
  return date.substring(5)
}


/**
 * 验证手机号码是否正确
 * @param {Object} phone
 */
function checkPhone(phone){ 
    if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){ 
       return false; 
    } else{
      return true;
    } 
}

/**
 * 显示错误信息
 * @param {Object} msg
 */
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 显示成功信息
 * @param {Object} msg
 */
function showSuccessToast(msg) {
  wx.showToast({
    title: msg,
  })
}

/**
 * 接口失败或错误提示tips
 * @param {Object} msg
 */
function showTips(msg) {
  
}

/**
 * 同步缓存数据
 */
function setStorageSync(key,val){
  try {
     wx.setStorageSync(key,val);
  } catch(e) {
    // Do something when catch error
  }
}

/**
 * 同步获取缓存数据
 */
function getStorageSync(key){
  try {
    return wx.getStorageSync(key);
  } catch(e) {
    // Do something when catch error
  }
}

/**
 * 同步移除缓存数据
 */
function removeStorageSync(key){
  try {
    wx.removeStorageSync(key)
  } catch(e) {
    // Do something when catch error
  }
}

/**
 * 同步清除所有缓存数据
 */
function clearStorageSync(){
  try {
    wx.clearStorageSync()
  } catch(e) {
    // Do something when catch error
  }
}

/**
 * rpx to px
 */
const rpx2px = rpx => {
  var rate = wx.getSystemInfoSync().windowWidth / 750
  return rate * rpx
} 


module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
	checkPhone: checkPhone,
	showErrorToast: showErrorToast,
	showSuccessToast: showSuccessToast,
  showTips: showTips,
  setStorageSync: setStorageSync,
  getStorageSync: getStorageSync,
  removeStorageSync: removeStorageSync,
  clearStorageSync: clearStorageSync,
  rpx2px: rpx2px
}
