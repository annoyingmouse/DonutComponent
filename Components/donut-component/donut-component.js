(() => {
  /**
   * Inspired by: https://codepen.io/hilar47/pen/RprXev
   * @type {HTMLTemplateElement}
   */
  const template = document.createElement('template')
  template.innerHTML = `
    <style>
      :host {
        --dimension: 150px;
      }
      * {
        box-sizing: border-box;
      }
      .donut-chart {
        position: relative;
        width: var(--dimension);
        height: var(--dimension);
        margin: 0 auto;
        border-radius: 100%
       }
      .center {
        position: absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        width: calc(var(--dimension) * .65);
        height: calc(var(--dimension) * .65);
        margin: auto;
        border-radius: 50%;
      }
      .portion-block {
        border-radius: 50%;
        clip: rect(0, var(--dimension), var(--dimension), calc(var(--dimension) * .5));
        height: 100%;
        position: absolute;
        width: 100%;
      }
      .circle {
        border-radius: 50%;
        clip: rect(0, calc(var(--dimension) * .5), var(--dimension), 0);
        height: 100%;
        position: absolute;
        width: 100%;
        font-size: 1.5rem;
      }
    </style>
    <div class="donut-chart">
      <div class="center"></div>
    </div>
  `
  const sanitiseName = value => value.replace(/[\s!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '').toLowerCase()
  class DonutComponent extends HTMLElement {
    static get observedAttributes() {
      return [
        'donut-values',
        'hole-colour',
        'animation-duration'
      ];
    }
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.hole = this.shadowRoot.querySelector('.center')
      this.hole.style.backgroundColor = this.holeColour
      this.chart = this.shadowRoot.querySelector('.donut-chart')
      this.addSlices();
    }
    addSlices() {
      const total = this.donutValues.reduce((previousValue, currentValue) => previousValue + Number(currentValue.value), 0)
      let rotationTotal = 0
      let durationTotal = 0
      this.donutValues.forEach((element, index) => {
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
        const slice = document.createElement('div')
        slice.id = sanitiseName(element.name)
        slice.classList.add('portion-block')
        slice.style.transform = `rotate(${rotationTotal}deg)`
        const circle = document.createElement('div')
        circle.classList.add('circle')
        circle.setAttribute('title', element.name)
        circle.style.backgroundColor = element.colour
        circle.style.animationFillMode = 'forwards'
        circle.style.animationIterationCount = '1'
        circle.style.animationDelay = `${durationTotal}s`
        circle.style.animationDuration = `${animationDuration}s`
        circle.style.animationTimingFunction = 'ease'
        circle.style.animationName = sanitiseName(element.name)
        slice.append(circle)
        this.chart.prepend(slice)
        rotationTotal += currentRotation
        durationTotal += animationDuration
      })
    }
    get donutValues() {
      return JSON.parse(this.getAttribute('donut-values'))
    }
    get animationDuration() {
      return Number(this.getAttribute('animation-duration')) || 3
    }
    get holeColour() {
      return this.getAttribute('hole-colour')
    }
  }

  window.customElements.define('donut-component', DonutComponent)
})()