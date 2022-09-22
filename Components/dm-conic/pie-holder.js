class PieHolder extends HTMLElement {
  static get observedAttributes() {
    return [
      'width',    // width of the chart
      'duration', // duration of the animation
      'delay',    // delay before the animation
      'thickness' // thickness of the slices
    ];
  }
  get style() {
    const css = new CSSStyleSheet()
    css.replaceSync(`
      * {
        box-sizing: border-box;
      }
      @property --p{
        syntax: '<number>';
        inherits: true;
        initial-value: 0;
      }
      div {
        width: ${this.width}px;
        height: ${this.width}px;
        position: relative;
      }
    `)
    return css
  }
  constructor() {
    super()
    this.shadow = this.attachShadow({
      mode: 'open'
    })
    this.shadow.adoptedStyleSheets = [this.style];
    this.shadow.innerHTML = `
      <div>
        <slot name='pie-slices'></slot>
      </div>
    `
    this.segments = this.querySelector("[slot='pie-slices']")
  }
  connectedCallback() {
    const segments = [...this.querySelectorAll('pie-slice')]
    console.log(segments)
    const total = segments.reduce((p, c) => p + Number(c.getAttribute('value')), 0)

    let durationTotal = this.delay;
    let rotationTotal = 0
    const totalDegree = 360/total

    segments.forEach(segment => {
      const value = Number(segment.getAttribute('value'))
      const currentRotation = totalDegree * value
      const animationDuration = currentRotation / (360/Number(this.duration))
      segment.setAttribute('thickness', this.thickness * this.width)
      segment.setAttribute('end', (value / total) * 100)
      segment.setAttribute('rotate', rotationTotal)
      segment.setAttribute('delay', durationTotal)
      segment.setAttribute('duration', animationDuration)
      rotationTotal += currentRotation
      durationTotal += animationDuration
    })
  }
  get width() {
    return Number(this.getAttribute('width')) || 150      // 150px by default
  }
  get duration() {
    return Number(this.getAttribute('duration')) || 5000  // 5 seconds by default
  }
  get delay() {
    return Number(this.getAttribute('delay')) || 500      // half a second by default
  }
  get thickness() {
    return Number(this.getAttribute('thickness')) || 0.2   // 60% of width by default
  }
}

window.customElements.define('pie-holder', PieHolder)