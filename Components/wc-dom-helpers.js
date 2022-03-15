export default class DomHelpers {

  static createElement(element) {
    return document.createElement(element)
  }

  static setText (element, text) {
    return element.appendChild(document.createTextNode(text))
  }

  static setInnerHTML (element, text) {
    return element.innerHTML = text
  }

  static createAndPopulate(element, text = null, attributes = null, styles = null, content = null) {
    const el = this.createElement(element)
    text && DomHelpers.setText(el, text)
    attributes && DomHelpers.setAttributes(el, attributes)
    styles && DomHelpers.setStyles(el, styles)
    content && DomHelpers.setInnerHTML(el, content)
    return el
  }

  static setAttributes(element, attributes) {
    for (const attr in attributes) {
      if(attributes.hasOwnProperty(attr)) {
        // converts camelCase to hyphen-separated, lowercase, string
        // e.g. "dataId" becomes "data-id"
        const attribute = attr.split(/(?=[A-Z])/).join('-').toLowerCase()
        element.setAttribute(attribute, attributes[attr])
      }
    }
  }

  static setStyles(element, declarations) {
    for (const prop in declarations) {
      if(declarations.hasOwnProperty(prop)){
        const property = prop.split(/(?=[A-Z])/).join('-').toLowerCase()
        element.style[property] = declarations[prop]
      }
    }
  }
}