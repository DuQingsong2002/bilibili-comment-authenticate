// 原神mid 401742377
// 嘉然mid 672328094

// https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=&host_mid=350934776&timezone_offset=-480

// https://api.bilibili.com/x/v2/reply/main?csrf=0ae21fb098020f64dd08930a188771ea&mode=3&next=3&oid=686723054&plat=1&type=1


export const onResponseHandlers = []


export const proxyXHR = function() {
  
  const open = XMLHttpRequest.prototype.open
  const send = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function(...args) { return open.apply(this, args) }

  XMLHttpRequest.prototype.send = function (...args) {
      
      this.addEventListener('load', () => {

          onResponseHandlers.forEach(fn => fn(this))
      })
      
      return send.apply(this, args);
  }

  console.debug('xhr 代理成功!')

  return true
}

