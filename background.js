// let color = '#3aa757';

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log('Default background color set to %cgreen', `color: ${color}`);
// })

/**
 * 颜色值需要十六进制写全
 */

const defaultTagList = [
  { 
    tagName: '未能识别',
    keywords: [],
    style: {
      color: '#ffffff',
      bgcolor: '#ddd'
    }
  },
  { 
    tagName: '嘉心糖',
    keywords: ['嘉然'],
    style: {
      color: '#ffffff',
      bgcolor: '#d16e8a'
    }
  },
  { 
    tagName: '原神玩家',
    keywords: ['原神', '刻晴', '须弥'],
    style: {
      color: '#ffffff',
      bgcolor: '#ddab55'
    }
  },
  { 
    tagName: '抽奖B友',
    keywords: ['抽奖'],
    style: {
      color: '#ffffff',
      bgcolor: '#fb7299'
    }
  },
  { 
    tagName: 'ikun',
    keywords: ['ikun'],
    style: {
      color: '#fff',
      bgcolor: '#555555'
    }
  },
]

chrome.storage.sync.get({initial: true}, function({initial}) {
  
  if(initial) {

    console.debug('第一次启动...')
    chrome.storage.sync.set({ initial: false, tagList: defaultTagList })

  }

})