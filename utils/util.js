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

module.exports = {
  formatTime: formatTime,
	checkPhone: checkPhone,
	showErrorToast: showErrorToast,
	showSuccessToast: showSuccessToast,
  showTips: showTips
}
