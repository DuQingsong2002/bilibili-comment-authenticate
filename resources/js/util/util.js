
/**
 * 是否新版布局
 */
export const isV1 = function() {

  return document.getElementById('app').classList.contains('app-v1')
}


/**
 * 
 * @param {Number} mid 
 * @returns {Promise}
 */
export const getSpaceList = function(mid) {
  const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=${mid}`

  // orig 表示转发源动态数据
  return fetch(url, {
      
  })
}