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
      border-radius: 100%
    }
  `)
  class DonutChart extends HTMLElement {
    static get observedAttributes() {
      return [
        'duration',
        'delay',
        'diameter',
        'dimension'
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
          <slot name='segments'></slot>
          <div class="center"></div>
        </div>
      `
      this.render()
    }
    render() {
      const segments = [...this.querySelectorAll('dm-arc-part')]
      const total = segments.reduce((p, c) => p + Number(c.getAttribute('value')), 0)
      let durationTotal = this.delay;
      let rotationTotal = 0
      const totalDegree = 360/total
      const width = this.diameter
        ? (this.dimension - (this.dimension * this.diameter)) / 2
        : this.dimension / 2
      segments.forEach(segment => {
        const currentRotation = totalDegree * Number(segment.getAttribute('value'))
        const animationDuration = currentRotation / (360/Number(this.duration))
        segment.setAttribute('end', `${currentRotation}deg`)
        segment.setAttribute('rotate', `${rotationTotal}deg`)
        segment.setAttribute('delay', `${durationTotal}s`)
        segment.setAttribute('duration', `${animationDuration}s`)
        segment.setAttribute('width', `${width}px`)
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
      return Number(this.getAttribute('duration')) || 4.5
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
  window.customElements.define('dm-donut-chart', DonutChart)
})()