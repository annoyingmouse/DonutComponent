import DomHelpers from '../wc-dom-helpers.js'
(() => {
  /**
   * Inspired by: https://codepen.io/hilar47/pen/RprXev
   * @type {HTMLTemplateElement}
   */
  const template = document.createElement('template')
  const compPath = import.meta.url.split('.').slice(0, -1).join('.')
  template.innerHTML = `
    <style>
      @import "${compPath}.css";
    </style>
    <div class="donut-chart">
      <div class="center"></div>
    </div>
  `
  const sanitiseName = value => value.replace(/[\s!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '').toLowerCase()
  class DonutChart extends HTMLElement {
    static get observedAttributes() {
      return [
        'values',
        'animation-duration',
        'hole-color'
      ];
    }
    constructor() {
      super()
      this.shadow = this.attachShadow({
        mode: 'closed'
      })
      this.shadow.appendChild(template.content.cloneNode(true))
      this.container = this.shadow.querySelector('.donut-chart')
      this.render()
    }
    clearUp() {
      this.shadow.querySelectorAll('style[id$="_style"]').forEach(injectedStyleSheet => injectedStyleSheet.remove())
      this.container.querySelectorAll(':not([class])').forEach(injectedDiv => injectedDiv.remove())
    }
    render(){
      this.clearUp()
      this.hole = this.shadow.querySelector('.center')
      this.hole.style.backgroundColor = this.holecolor
      this.chart = this.shadow.querySelector('.donut-chart')
      if(this.hasAttribute('values')){
        this.values = JSON.parse(this.getAttribute('values'))
        this.addSlices()
      }else{
        this.processData()
      }
    }
    processData() {
      this.values = []
      const nameTest = new RegExp(/-name$/)
      const attributes = [...this.attributes]
      attributes.forEach(attribute => {
        if (nameTest.test(attribute.nodeName)) {
          this.values.push({
            name: attribute.nodeName.replace(nameTest, '')
          })
        }
      })
      this.values.forEach(obj => {
        obj.value = Number(this.getAttribute(`${obj.name}-value`))
        obj.color = this.getAttribute(`${obj.name}-color`)
      })
      this.addSlices()
    }
    createStyle = (name, currentRotation) => DomHelpers.createAndPopulate(
      'style',
      null,
      {
        'id': `${sanitiseName(name)}_style`
      },
      null,
      `
        @keyframes ${sanitiseName(name)} {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(${currentRotation}deg);
          }
        }
      `
    )
    createSlice = (name, rotationTotal) => DomHelpers.createAndPopulate(
      'div',
      null,
      {
        'id': sanitiseName(name)
      },
      {
        transform: `rotate(${rotationTotal}deg)`,
        borderRadius: '50%',
        clip: 'rect(0, var(--dimension), var(--dimension), calc(var(--dimension) * .5))',
        height: '100%',
        position: 'absolute',
        width: '100%'
      }
    )
    createCircle = (name, color, durationTotal, animationDuration) => DomHelpers.createAndPopulate(
      'div',
      null,
      {
        'class': 'circle',
        title: name
      },
      {
        backgroundColor: color,
        animationFillMode: 'forwards',
        animationIterationCount: '1',
        animationDelay: `${durationTotal}s`,
        animationDuration: `${animationDuration}s`,
        animationTimingFunction: 'ease',
        animationName: sanitiseName(name)
      }
    )
    addSlices() {
      const total = this.values.reduce((previousValue, currentValue) =>
        previousValue + Number(currentValue.value), 0)
      let rotationTotal = 0
      let durationTotal = 0
      const totalDegree = 360/total
      this.values.forEach(element => {
        const currentRotation = totalDegree * Number(element.value)
        const animationDuration = currentRotation / (360/this.animationDuration)
        this.shadow.prepend(this.createStyle(element.name, currentRotation));
        const slice = this.createSlice(element.name, rotationTotal)
        slice.append(this.createCircle(element.name, element.color, durationTotal, animationDuration))
        this.chart.prepend(slice)
        rotationTotal += currentRotation
        durationTotal += animationDuration
      })
    }
    get animationDuration() {
      return Number(this.getAttribute('animation-duration')) || 3
    }
    get holecolor() {
      return this.getAttribute('hole-color')
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if((oldValue !== newValue)){
        this.render()
      }
    }
  }
  window.customElements.define('wc-donut-chart', DonutChart)
})()