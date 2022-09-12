
const Log = function(params) {
    
    chrome.devtools.inspectedWindow.test = 'wuwuwu'
    chrome.devtools.inspectedWindow.eval('console.log(' + JSON.stringify(params) + ')')
}

const commentApi = '/v2/reply/'


chrome.devtools.network
    .onRequestFinished
    .addListener(e => {
        
        if(e.request.url.includes(commentApi)) {
            Log(e)
            Log(chrome.devtools.network)
        }
    })
// chrome.webRequest.onResponseStarted.addListener(
//     (a,b,c) => {
        
//         Log(a)
//         Log(b)
//         Log(c)
//     },
//     // filter: RequestFilter,
//     // extraInfoSpec?: OnResponseStartedOptions[],
// )


// https://api.bilibili.com/x/v2/reply/main?csrf=0ae21fb098020f64dd08930a188771ea&mode=3&next=3&oid=686723054&plat=1&type=1