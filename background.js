// let color = '#3aa757';

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log('Default background color set to %cgreen', `color: ${color}`);
// })

/**
 * 预设的关键标签
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

chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.sync.set({ tagList: defaultTagList })
    chrome.tabs.create({
      url: 'options/options.html'
    })
  }
})

// chrome.tabs.onUpdated.addListener(({tabId}) => {
//   // chrome.tabs.sendMessage(tabId, {greeting: "hello"}, function(response) {
//   //   console.log(response.farewell);
//   // })
//   console.log('tab', tabId)
//   // chrome.storage.sync.get({ tagList: [] }, ({tagList}) => {

//   //   const getTagList = function() {return tagList } 

//   //   chrome.scripting.executeScript(
//   //     {
//   //       target: {tabId: tabId},
//   //       func: getTagList,
//   //       args: [tagList]
//   //     }, console.log)
      
//   // })
    
// })

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {

  console.log('request', request);
  if(request.getTagList) {
    chrome.storage.sync.get({ tagList: [] }, sendResponse)
  }

})