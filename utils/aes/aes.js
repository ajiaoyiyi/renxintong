const CryptoJS = require('./aes.lib.js'); //引用AES源码js
const key = CryptoJS.CryptoJS.enc.Utf8.parse("_EasyPayCompany_"); //十六位十六进制数作为秘钥

 /**
 * AES 加密
 * @param encryptString 要加密的字符串
 * @returns {string} 加密后的字符串
 */
function AesEncrypt(word) {
  var srcs = CryptoJS.CryptoJS.enc.Utf8.parse(word);
  let decrypt = CryptoJS.CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.CryptoJS.mode.ECB,
    padding: CryptoJS.CryptoJS.pad.Pkcs7
  });
  return decrypt.toString()
}

/**
 * AES 解密
 * @param decryptString 要解密的字符串
 * @returns {string} 解密后的字符串
 */
function AesDecrypt(word) {
    var decrypt = CryptoJS.CryptoJS.AES.decrypt(word.toString(), key, { 
        mode: CryptoJS.CryptoJS.mode.ECB, 
        padding: CryptoJS.CryptoJS.pad.Pkcs7
     });
    return CryptoJS.CryptoJS.enc.Utf8.stringify(decrypt);
   }

//暴露接口
module.exports = {
  AesEncrypt,
  AesDecrypt
}

