// 上线前替换TODO
var u2AesKey ='en32-i-4315787-4c87-436a-9c89-kv';   //  'u2_test_aesK_test_test_test_test';// 
var api_appid ='1004'; // '5001';  // 
var api_appkey = 'v5appkey_xf_865fn$xa';//'v5appkey_test';  // 
var u2AppId = '90210'; // "90101";  // 

var webPayAppId = "upocAppletApp";


var CryptoJS = require('../assets/js/cryptojs/aes.js');  //引用AES源码js
var Md5 = require('../assets/js/cryptojs/md5.js');  //引用Md5源码js

var key = CryptoJS.enc.Utf8.parse(u2AesKey);
var iv = CryptoJS.enc.Utf8.parse(u2AesKey);

//解密方法
function Decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv,  mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

//加密方法
function Encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}


//服务端接口验签
function Sign(params){
  var signString = 'appid=' + api_appid;
  for (var i = 0; i < params.length; i++) {
    signString += '&'+ params[i][0] + '=' + params[i][1];
  }
  signString += '&appkey=' + api_appkey;
  signString = signString.toLowerCase();
  console.log(signString);
  var signX = (Md5.MD5(signString) + '').toUpperCase();

  return signX;
}

module.exports = {
  Decrypt: Decrypt,
  Encrypt: Encrypt,
  Sign: Sign,
  U2AppId: u2AppId,  
  WebPayAppId: webPayAppId,
  ApiAppId: api_appid
}