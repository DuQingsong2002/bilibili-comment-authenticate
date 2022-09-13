

const Tag = function(options = {}) {

  this.options = options
  this.ref = null
  
}

Tag.prototype.render = function(dom) {

  this.ref = document.createElement('div')

  this.update()
  this.bindEvents()

  if(dom) {
    dom.appendChild(this.ref)
  }

  return this
}

Tag.prototype.update = function(options) {

  const tag = this.ref

  if(options) {
    
    Object.assign(this.options.style, options.style)
    Object.assign(this.options, options)
  }

  const { tagName, style } = this.options
  const { bgcolor, color } = style || {}

  tag.className = 'auth-tag'
  tag.innerText = tagName || ''
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

      tag.addEventListener(key.slice(2).toLocaleLowerCase(), (e) => this.options[key] && this.options[key](e, this))
      
    }
  }
}

/**
 * 获取配置，用于保存
 * @returns 
 */
Tag.prototype.getOptions = function() {

  return { 
    tagName: this.options.tagName,
    keywords: this.options.keywords,
    style: this.options.style
  }
}

export default Tag