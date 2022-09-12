const script = document.createElement('script');
script.src = chrome.runtime.getURL('proxy-xhr.js');

script.onload = () => script.remove()

document.head.appendChild(script)