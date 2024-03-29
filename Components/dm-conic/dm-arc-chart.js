(() => {

  const mainSheet = new CSSStyleSheet()
  mainSheet.replaceSync(`
    :host {
      --dimension: 200px;
    }
    * {
      box-sizing: border-box;
    }
    .donut-chart {
      position: relative;
      width: var(--dimension);
      height: var(--dimension);
      margin: 0 auto;
    }
  `)
  class ArcChart extends HTMLElement {
    static get observedAttributes() {
      return [
        'duration', // total duration of the animation
        'delay',    // delay before the start of the animation
        'diameter', // width of the arc
        'dimension' // width of the chart
      ];
    }
    constructor() {
      super()
      this.shadow = this.attachShadow({
        mode: 'open'
      })
      this.shadow.adoptedStyleSheets = [mainSheet];
      this.shadow.innerHTML = `
        <div class="donut-chart">
          <slot name='segment'></slot>
        </div>
      `
      this.segments = this.querySelector("[slot='segments']")
    }
    connectedCallback() {
      const segments = [...this.querySelectorAll('dm-arc')]
      const total = segments.reduce((p, c) => p + Number(c.getAttribute('value')), 0)
      let durationTotal = this.delay;
      let rotationTotal = 0
      const totalDegree = 360/total
      segments.forEach(segment => {
        const currentRotation = totalDegree * Number(segment.getAttribute('value'))
        const animationDuration = currentRotation / (360/Number(this.duration))
        segment.setAttribute('end', `${currentRotation}deg`)
        segment.setAttribute('rotate', `${rotationTotal}deg`)
        segment.setAttribute('delay', durationTotal)
        segment.setAttribute('duration', animationDuration)
        segment.setAttribute('width', this.dimension)
        rotationTotal += currentRotation
        durationTotal += animationDuration
      })
      const sheet = new CSSStyleSheet()
      sheet.replaceSync( `
        :host {
          --dimension: ${this.dimension}px;
        }
      `)
      this.shadowRoot.adoptedStyleSheets = [mainSheet, sheet]
    }
    get duration() {
      return Number(this.getAttribute('duration')) || 4500
    }
    get delay() {
      return Number(this.getAttribute('delay')) || 0
    }
    get diameter() {
      return Number(this.getAttribute('diameter')) || null
    }
    get dimension() {
      return Number(this.getAttribute('dimension')) || 200
    }
  }
  window.customElements.define('dm-arc-chart', ArcChart)
})()