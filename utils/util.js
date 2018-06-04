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

module.exports = {
  formatTime: formatTime,
  trim: trim,
  isEmail: isEmail,
  isPhone: isPhone,
  removeFromArray: removeFromArray,
}


/**
* 删除左右两端的空格
*/
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

/**
* 验证是否邮箱
*/
function isEmail(str) {
  var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  return reg.test(str);
}

/**
* 验证是否手机号码
*/
function isPhone(str) {
  var reg = /^1\d{10}$/;
  return reg.test(str);
}

/**
 * 移除数组中的指定元素
*/
function removeFromArray(array, val) {
  var index = -1;
  for (var i = 0; i < array.length; i++) {
    if (array[i] == val) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}