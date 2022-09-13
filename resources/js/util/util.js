
/**
 * 是否新版布局
 */
export const isV1 = function() {

  return document.getElementById('app').classList.contains('app-v1')
}

/**
 * 获取视频id (支持旧版)
 */
export const getOid = function() {
  const comment = document.getElementById('comment')
  if(!comment) return
  
  let selecor = isV1() ? '' : '.common > .comment > .bb-comment > .comment-list > div[mr-show]'
  const tmp = comment.querySelector(selecor)
  return JSON.parse(tmp.getAttribute('mr-show')).msg.oid
}

/**
 * 空间动态
 * @param {Number} mid 用户id
 * @returns {Promise}
 */
export const getSpaceList = function(mid) {
  const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=${mid}`

  // orig 表示转发源动态数据
  return fetch(url, {
      
  })
}

/**
 * 视频评论
 * @param {Number} oid 视频id
 * @returns {Promise}
 */
export const getReplyList = function(oid) {
  
  const url = `https://api.bilibili.com/x/v2/reply/main?mode=3&next=0&oid=${oid}&plat=1&seek_rpid=&type=1`

  // orig 表示转发源动态数据
  return fetch(url, {
      
  })
  
}