

// 原神mid 401742377
// 嘉然mid 672328094

// https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=&host_mid=350934776&timezone_offset=-480

// https://api.bilibili.com/x/v2/reply/main?csrf=0ae21fb098020f64dd08930a188771ea&mode=3&next=3&oid=686723054&plat=1&type=1


const commentApi= '/v2/reply/main'

const open = XMLHttpRequest.prototype.open
const send = XMLHttpRequest.prototype.send

let topCreated = false

XMLHttpRequest.prototype.open = function(...args) { return open.apply(this, args) }

XMLHttpRequest.prototype.send = function (...args) {
    
    this.addEventListener('load', () => {

        if(this.responseURL.includes(commentApi)) {
            const resp = JSON.parse(this.response)
            const allReplies = topCreated ? resp.data.replies : [...resp.data.top_replies, ...resp.data.replies]
            topCreated = true
            const mids = allReplies.map(item => item.mid)
            showTag(mids)
        }
    })
    
    return send.apply(this, args);
};

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
    const replyItems = document.getElementById('comment') //.getElementsByClassName('reply-item')
    
    if(!tags || tags.length === 0) tags.push('鉴定失败')
    const tagDoms = tags.map(item => {
        const tag = document.createElement('div')
        tag.className = 'up-icon'
        tag.innerText = item
        tag.style.backgroundColor = item === '鉴定失败' ? '#DDD' : 'indianred'
        tag.style.color = '#fff';
        tag.style.borderRadius = '.2em';
        tag.style.padding = '0 .5em'
        tag.style.margin = '0 8px'
        return tag
    })
    replyItems.querySelectorAll(`div[data-user-id="${mid}"] + .content-warp .user-info`)
        .forEach(parentDOM => {
            if(parentDOM._created) return
            tagDoms.forEach(tag => parentDOM.appendChild(tag))
            parentDOM._created = true
        })
}


const getSpaceList = function(mid) {
    const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=${mid}`

    // orig 表示转发源动态数据
    return fetch(url, {
        
    })
}

const DYNAMIC_TYPE = {
    // 转发
    "FORWARD": 'DYNAMIC_TYPE_FORWARD',
    
    // 带图
    "DRAW": 'DYNAMIC_TYPE_DRAW',

    // 文字
    "WORD": 'DYNAMIC_TYPE_WORD',

    // 视频
    "AV": 'DYNAMIC_TYPE_AV'
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