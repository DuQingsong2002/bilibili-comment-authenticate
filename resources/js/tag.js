const tagOptions = [
  { 
    tagName: '嘉心糖',
    keywords: ['嘉然'],
    style: {
      color: '#fff',
      bgcolor: 'indianred'
    }
  },
  { 
    tagName: '原神玩家',
    keywords: ['原神', '刻晴', '须弥'],
    style: {
      color: '#fff',
      bgcolor: 'indianred'
    }
  },
  { 
    tagName: '抽奖B友',
    keywords: ['抽奖'],
    style: {
      color: '#fff',
      bgcolor: 'indianred'
    }
  },
  { 
    tagName: 'ikun',
    keywords: ['ikun'],
    style: {
      color: '#fff',
      bgcolor: 'indianred'
    }
  },
]


const Tag = function(options) {

  this.options = options
}

Tag.prototype.render = function() {

  this.ref = document.createElement('div')

  this.updateStyle()
  this.bindEvents()

  return this.ref
}

Tag.prototype.updateStyle = function(options) {

  const tag = this.ref

  const { text, bgcolor, color } = Object.assign(this.options, options)

  tag.className = 'auth-tag'
  tag.innerText = text || ''
  tag.style.backgroundColor = bgcolor || 'rgb(244, 244, 244)'
  tag.style.display = 'inline-block'
  tag.style.color = color || 'rgb(117, 117, 117)'
  tag.style.borderRadius = '.2em'
  tag.style.padding = '0 .5em'
  tag.style.margin = '0 8px'

}

Tag.prototype.bindEvents = function() {

  const tag = this.ref

  for (const key in this.options) {
    if(key.startsWith('on')) {

      tag.addEventListener(key.slice(2).toLocaleLowerCase(), () => this.options[key] && this.options[key](this))
      
    }
  }
}

export default Tag