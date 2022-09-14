const resourcePrefix = '/resources'

const reources = [
  '/js/proxy/$ajax-proxy.js', 
  '/js/proxy/proxy-xhr.js', 
  '/js/util/util.js', 
  '/js/constant.js',
  '/js/comment.js'
]

const loadJSResource = function(path) {
  
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(resourcePrefix + path);
  script.type = 'module'
  script.onload = () => script.remove()
  document.head.appendChild(script)

}

const loadCSSResource = function(path) {
  
}

reources.forEach(res => {
  
  const type = res.slice(res.lastIndexOf('.'))

  
  switch(type) {
    case '.js':
      loadJSResource(res)
      console.debug('loaded resources', res)
      break
  }
})