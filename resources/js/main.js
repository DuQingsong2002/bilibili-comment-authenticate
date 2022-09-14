import { commentApi, DYNAMIC_TYPE, EXTENSIONS_ID } from "./constant.js"
import { onResponseHandlers as $AjaxHandlers, proxy$Ajax } from "./proxy/proxy-$ajax.js"
import { onResponseHandlers as XHRHandlers, proxyXHR } from "./proxy/proxy-xhr.js"
import Tag from "./Tag.js"
import { getOid, getReplyList, getSpaceList, getTagList, isV1 } from "./util/util.js"

const tagList = await getTagList(EXTENSIONS_ID)
console.log('tagList', tagList);
const defaultTag = tagList.find(({keywords}) => !keywords || !keywords.length)

const isv1 = isV1()

console.debug('检测到', isv1 ? '新版' : '旧版', '布局')
if(!isv1) {

  // 暂时不知道jq啥时候加载的，onload有时候也拿不到，直接无限循环
  const loop = function() {
      if(!proxy$Ajax()) {
          return window.requestAnimationFrame(loop)
      }
      $AjaxHandlers.push((ajax, data) => {
        if(ajax.url.includes(commentApi)) {
            handleResponse(data)
        }
      })

      initOld()
  }
  
  window.requestAnimationFrame(loop)

}else {

  proxyXHR()

  XHRHandlers.push((xhr) => {
    if(xhr.responseURL.includes(commentApi)) {
        handleResponse(JSON.parse(xhr.response))
    }
    
  })
}

// 代理成功主动请求一次评论，页面第一次请求代理不到暂时不知道为啥
const initOld = function() {

    const oid = getOid()
    // 从评论区刷新dom可能还没加载出来, 延个时 (其实从接口拿视频id应该更方便...)
    let timer = 0
    if(!oid) timer = 500

    setTimeout(() => {
        getReplyList(getOid())
            .then(async resp => {
                const data = await resp.json()
                handleResponse(data)
            })
    }, timer)
}


let topAdded = false

const handleResponse = function(resp) {
        
    const allReplies = topAdded ? resp.data.replies : [...resp.data.top_replies || [], ...resp.data.replies]
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

    if(tags.length === 0) {
        if(!defaultTag) return
        tags.push(defaultTag)
    }

    const commentWrapper = document.getElementById('comment') //.getElementsByClassName('reply-item')
    
    const tagDoms = tags.map(item => new Tag(item))

    if(isv1) {
        commentWrapper.querySelectorAll(`.comment-container > .reply-warp > .reply-list > .reply-item > .root-reply-container > .root-reply-avatar[data-user-id="${mid}"] + .content-warp > .user-info`)
            .forEach(parentDOM => {
                if(parentDOM._created) return
                tagDoms.forEach(tag => tag.render(parentDOM))
                parentDOM._created = true
            })
    }else {
        commentWrapper.querySelectorAll(`.reply-wrap[mr-show] > .con > .user > a[data-usercard-mid="${mid}"]`)
            .forEach(dom => {
                if(dom._created) return
                tagDoms.forEach(tag => tag.render(dom.parentNode))
                dom._created = true
            })
    }
}

/**
 * 
 * @param {Array<Object>} list 
 */
const resolveTag = function(list) {

    const result = []

    for (const item of list) {
        
        const info = resolveText(item)
        console.log('info', info);
        const texts = info.nickname.join('') + info.desc.join('') + info.major.join('')

        tagList.forEach((tag) => {

            if(result.includes(tag)) return

            if(!tag.keywords || !tag.keywords.length) return

            const regexp = new RegExp(`${tag.keywords.join('|')}`, 'gi')
            const matched = texts.match(regexp) 
            if(matched) {
                result.push(tag)
            } 
        })

        if(result.length === tagList.length) return result
        
    }
    return result
}

/**
 * 装扮和个签就先不管了，一眼可见
 * 存数组表示自己和转发源的
 * @returns 
 */
const resolveText = function(item, result = { mid: [], nickname: [], desc: [], major: [] }) {

    const setResult = () => {
        result.mid.push(item.modules.module_author.mid)

        result.nickname.push(item.modules.module_author.name)

        // 文字
        result.desc.push(item.modules.module_dynamic.desc ? item.modules.module_dynamic.desc.text : '')

        // 视频文字信息
        result.major.push(JSON.stringify(item.modules.module_dynamic.major))

        return result
    }

    if(item.type === DYNAMIC_TYPE.FORWARD) {

        setResult()

        return resolveText(item.orig, result)
        
    }else {

        return setResult()
    }
}