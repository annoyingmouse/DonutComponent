import Helpers from '../Helpers.js'
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
  class DonutComponent extends HTMLElement {
    static get observedAttributes() {
      return [
        'values',
        'hole-color'
      ];
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.hole = this.shadowRoot.querySelector('.center')
      this.hole.style.backgroundColor = this.holecolor
      this.chart = this.shadowRoot.querySelector('.donut-chart')
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
          this.values.push({name: attribute.nodeName.replace(nameTest, '')})
        }
      })
      this.values.forEach(obj => {
        obj.value = Number(this.getAttribute(`${obj.name}-value`))
        obj.color = this.getAttribute(`${obj.name}-color`)
      })
      //this.checkData()
      console.log(this.values)
      this.addSlices()
    }
    checkdata() {

    }
    addSlices() {
      const total = this.values.reduce((previousValue, currentValue) => previousValue + Number(currentValue.value), 0)
      let rotationTotal = 0
      let durationTotal = 0
      this.values.forEach(element => {
        const animationDuration = ((360/total) * Number(element.value)) / (360/this.animationDuration)
        const currentRotation = (360/total) * Number(element.value)
        const style = document.createElement('style')
        style.innerHTML = `
          @keyframes ${sanitiseName(element.name)} {
            from {transform: rotate(0deg);}
            to {transform: rotate(${currentRotation}deg);}
          }
        `
        this.shadowRoot.prepend(style);
        const slice = Helpers.createElement('div')
        Helpers.setAttributes(slice, {
          'id': sanitiseName(element.name),
          'class': 'portion-block',
          'style': `transform: rotate(${rotationTotal}deg)`
        })

        const circle = Helpers.createAndPopulate(
          'div',
          null,
          {
            'class': 'circle',
            title: element.name
          },
          {
            backgroundColor: element.color,
            animationFillMode: 'forwards',
            animationIterationCount: '1',
            animationDelay: `${durationTotal}s`,
            animationDuration: `${animationDuration}s`,
            animationTimingFunction: 'ease',
            animationName: sanitiseName(element.name)
          }
        )
        slice.append(circle)
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
  }

  window.customElements.define('donut-component', DonutComponent)
})()