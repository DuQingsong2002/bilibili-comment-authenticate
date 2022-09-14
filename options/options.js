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

  chrome.storage.sync.set({tagList: storageTagList.map(item => item.getOptions())}, () => {
    tagConfig.classList.remove('--checked')
    alert('保存成功!')
  })
}

/**
 * 
 * @param {Tag} tag 
 */
const openTagDetail = function(e, tag) {

  tagConfig.classList.add('--checked')

  nameInput.value = tag.options.tagName
  colorInput.value = tag.options.style.color
  bgColorInput.value = tag.options.style.bgcolor
  keywordsInput.value = tag.options.keywords || ''

  nameInput.onchange = (e) => tag.update({ tagName: e.target.value })
  colorInput.onchange = (e) => tag.update({ style: { color: e.target.value } })
  bgColorInput.onchange = (e) => tag.update({ style: { bgcolor: e.target.value } })
  keywordsInput.onchange = (e) => tag.updateStyle({ keywords: e.target.value })

}

const removeBtn = function(e, tag) {

  e.preventDefault()

  if(confirm(`确认删除${tag.getOptions().tagName}?`)) {

    const i = storageTagList.findIndex(item => item === tag)
    if(i > -1) {
      storageTagList.splice(i, 1)
    }
    tag.ref.remove()

  }

  
}

chrome.storage.sync.get({tagList: []}, function({tagList}) {

  console.debug('loaded tagList', tagList)
  
  createDefaultButton()

  tagList.forEach(item => {
    storageTagList.push(new Tag({...item, onclick: openTagDetail, oncontextmenu: removeBtn}).render(tagWrapper))
  })

})

const createDefaultButton = function() {

  const tagOptions = { 
    tagName: '添加新标签', 
    onclick: () => {
      const tagName = prompt('请输入标签名字')
      if(tagName) {
        const tag = new Tag({tagName, onclick: openTagDetail, oncontextmenu: removeBtn})
        storageTagList.push(tag.render(tagWrapper))
      }
  }}

  new Tag(tagOptions).render(tagWrapper)

}