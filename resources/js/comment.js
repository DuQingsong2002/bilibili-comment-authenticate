import { DYNAMIC_TYPE } from "./constant.js"
import { onResponseHandlers as $AjaxHandlers, proxy$Ajax } from "./proxy/proxy-$ajax.js"
import { onResponseHandlers as XHRHandlers, proxyXHR } from "./proxy/proxy-xhr.js"
import { getOid, getReplyList, getSpaceList, isV1 } from "./util/util.js"

const isv1 = isV1()

console.debug('检测到', isv1 ? '新版' : '旧版', '布局')

if(!isv1) {

  // 暂时不知道jq啥时候加载的，onload有时候也拿不到，直接无限循环
  const loop = function() {
      if(!proxy$Ajax()) {
          return window.requestAnimationFrame(loop)
      }
      $AjaxHandlers.push((ajax, data) => handleResponse(data))
      // 代理成功主动请求一次评论，页面第一次请求代理不到暂时不知道为啥
      getReplyList(getOid())
        .then(async resp => {
            const data = await resp.json()
            handleResponse(data)
        })
  }
  
  window.requestAnimationFrame(loop)

}else {

  proxyXHR()

  XHRHandlers.push((xhr) => handleResponse(JSON.parse(xhr.response)))
}


let topAdded = false

const handleResponse = function(resp) {
    
    const allReplies = topAdded ? resp.data.replies : [...resp.data.top_replies, ...resp.data.replies]
    topAdded = true
    const mids = allReplies.map(item => item.mid)
    showTag(mids)
}

/**
 * 
 * @param {Array<Number>} mids 
 */
const showTag = function(mids) {

    const tasks = mids.map(id => getSpaceList(id))

    Promise.all(tasks)
        .then(async values => {

            return await Promise.all(values.map(async resp => (await resp.json())))
        })
        .then(values => {
            values.forEach((item, key) => {
                const tags = resolveTag(item.data.items)
                createTag(mids[key], tags)
            })
        })
}

const createTag = function(mid, tags) {
    const commentWrapper = document.getElementById('comment') //.getElementsByClassName('reply-item')
    
    if(!tags || tags.length === 0) tags.push('鉴定失败')
    const tagDoms = tags.map(item => {
        const tag = document.createElement('div')
        tag.className = 'up-icon'
        tag.innerText = item
        tag.style.backgroundColor = item === '鉴定失败' ? '#DDD' : 'indianred'
        tag.style.display = 'inline-block'
        tag.style.color = '#fff';
        tag.style.borderRadius = '.2em';
        tag.style.padding = '0 .5em'
        tag.style.margin = '0 8px'
        return tag
    })

    if(isv1) {
        commentWrapper.querySelectorAll(`.comment-container > .reply-warp > .reply-list > .reply-item > .root-reply-container > .root-reply-avatar[data-user-id="${mid}"] + .content-warp > .user-info`)
            .forEach(parentDOM => {
                if(parentDOM._created) return
                tagDoms.forEach(tag => parentDOM.appendChild(tag))
                parentDOM._created = true
            })
    }else {
        commentWrapper.querySelectorAll(`.reply-wrap[mr-show] > .con > .user > a[data-usercard-mid="${mid}"]`)
            .forEach(dom => {
                if(dom._created) return
                tagDoms.forEach(tag => {
                    dom.parentNode.appendChild(tag)
                })
                dom._created = true
            })
    }
}


// const tags = [
//     { text: '抽奖B友', color: 'indianred' },
//     { text: '原神玩家', color: 'indianred' },
//     { text: '嘉心糖', color: 'indianred' },
// ]

/**
 * 
 * @param {Array<Object>} list 
 */
const resolveTag = function(list) {

    const result = []

    for (const item of list) {
        
        const info = resolveText(item)
        const texts = info.nickname + JSON.stringify(info.desc) + JSON.stringify(info.major)
        
        const matched = texts.match(/(抽奖|原神|嘉然|ikun)/g)
        
        if(!matched) return result
        
        if(!result.includes('抽奖B友')) {
            matched.includes('抽奖') && result.push('抽奖B友')
        }
        if(!result.includes('原神玩家')) {
            matched.includes('原神') && result.push('原神玩家')
        }
        if(!result.includes('嘉心糖')) {
            matched.includes('嘉然') && result.push('嘉心糖')
        }

        if(!result.includes('ikun')) {
            matched.includes('ikun') && result.push('ikun')
        }

        if(result.length === 4) return result
    }
    return result
}

const resolveText = function(item) {

    if(item.type === DYNAMIC_TYPE.FORWARD) {

        return resolveText(item.orig)
        
    }else {

        return {
            mid: item.modules.module_author.mid,
            nickname: item.modules.module_author.name,
            desc: item.modules.module_dynamic.desc,
            major: item.modules.module_dynamic.major,
        }
    }
}