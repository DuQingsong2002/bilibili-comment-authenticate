
export const onResponseHandlers = []

// 旧版评论用script类型请求的接口，xhr拦截不到

export const proxy$Ajax = function() {
  const jq = (window.jQuery || window.$)

  if(!jq) return false

  const ajax = jq.ajax

  jq.ajax = function (url, option) {

      const oldSuccess = url.success
      url.success = function(data) {
          
          onResponseHandlers.forEach(fn => fn(this, data))
          return oldSuccess && oldSuccess.call(this, data)
      }

      return ajax.call(this, url, option)
  } 

  console.debug('$.ajax 代理成功!')

  return true
}
