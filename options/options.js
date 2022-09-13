import Tag from "../resources/js/Tag.js"

/**
 * { 
    tagName: '嘉心糖',
    keywords: ['嘉然'],
    style: {
      color: '#fff',
      bgcolor: 'indianred'
    }
  },
 */
const tagWrapper = document.getElementById('tag-wrapper')
const tagConfig = document.getElementById('tag-config')

const nameInput = document.getElementById('name-input')
const colorInput = document.getElementById('color-input')
const bgColorInput = document.getElementById('bg-color-input')
const keywordsInput = document.getElementById('keywords-input')

const saveBtn = document.getElementById('save')

const storageTagList = []

saveBtn.onclick = function() {

  chrome.storage.sync.set({tagList: storageTagList.map(item => item.options)}, () => {
    alert('保存成功!')
  })
}

/**
 * 
 * @param {Tag} tag 
 */
const openTagDetail = function(tag) {

  nameInput.value = tag.options.text
  colorInput.value = tag.options.color
  bgColorInput.value = tag.options.bgcolor
  keywordsInput.value = tag.options.keywords || ''

  nameInput.onchange = (e) => tag.updateStyle({ text: e.target.value })
  colorInput.onchange = (e) => tag.updateStyle({ color: e.target.value })
  bgColorInput.onchange = (e) => tag.updateStyle({ bgcolor: e.target.value })
  keywordsInput.onchange = (e) => tag.updateStyle({ keywords: e.target.value })

}

chrome.storage.sync.get({tagList: []}, function({tagList}) {

  console.debug('loaded tagList', tagList)
  
  createDefaultButton()

  tagList.forEach(item => {
    storageTagList.push(appendTag({...item, onclick: openTagDetail}))
  })

})

const createDefaultButton = function() {

  appendTag({ 
    text: '添加新标签',
    onclick: () => {
      const tagName = prompt('请输入标签名字')
      if(tagName) {
        storageTagList.push(appendTag({text: tagName, onclick: openTagDetail}))
      }
  }})
}
  

const appendTag = function(tagOptions) {

  const tag = new Tag(tagOptions)

  tagWrapper.appendChild(tag.render())

  return tag
}