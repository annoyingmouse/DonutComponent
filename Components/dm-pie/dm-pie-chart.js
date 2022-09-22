class DMPieChart extends HTMLElement {
  static get observedAttributes() {
    return [
      'width',    // width of the chart
      'duration', // duration of the animation
      'delay',    // delay before the animation
      'thickness' // thickness of the slices
    ];
  }
  get style() {
    return `
      <style>
        * {
          box-sizing: border-box;
        }
        div {
          width: ${this.width}px;
          height: ${this.width}px;
          position: relative;
        }
      </style>
    `
  }
  constructor() {
    super()
    this.shadow = this.attachShadow({
      mode: 'closed'
    })
    this.shadow.innerHTML = `
      ${this.style}
      <div>
        <slot name='pie-slices'></slot>
      </div>
    `
    try {
      window.CSS.registerProperty({
        name: '--p',
        syntax: '<number>',
        inherits: true,
        initialValue: 0,
      })
    }catch (e) {
      console.warn('Browser does not support animated conical gradients')
    }
  }
  connectedCallback() {
    const segments = [...this.querySelectorAll('dm-pie-slice')]
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
      segment.setAttribute('width', this.width)
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

class DMPieSlice extends HTMLElement{
  static get observedAttributes() {
    return [
      'width',      // width of the chart
      'duration',   // duration of the animation
      'delay',      // delay before the animation
      'color',      // color of the arc
      'thickness',   // thickness of the arc
      'rotate'      // how far to rotate the arc
    ];
  }
  get style() {
    return `
      <style>
        * {
          box-sizing: border-box;
        }
        div {
          --p: ${this.end};
          width: ${this.width}px;
          aspect-ratio: 1;
          margin: 0;
          position: absolute;
          left: 50%;
          top: 50%;
          animation-name: p;
          animation-fill-mode: both;
          animation-timing-function: ease-in-out;
          transform: translate(-50%, -50%);
          animation-duration: ${this.duration}ms;
          animation-delay: ${this.delay}ms;
        }
        div:before {
          content: "";
          position: absolute;
          border-radius: 50%;
          inset: 0;
          background: conic-gradient(from ${this.rotate}deg, ${this.color} calc(var(--p)*1%), transparent 0);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(99% - ${this.thickness}px), #000 calc(100% - ${this.thickness}px));
          mask: radial-gradient(farthest-side,#0000 calc(99% - ${this.thickness}px), #000 calc(100% - ${this.thickness}px));
        }
        @keyframes p {
          from {
            --p: 0
          }
        }
      </style>
    `
  }
  constructor() {
    super();
    this.shadow = this.attachShadow({
      mode: 'closed'
    })
    this.shadow.innerHTML = `${this.style}<div/>`
  }
  get width() {
    return Number(this.getAttribute('width')) || 150      // 150px by default
  }
  get duration() {
    return Number(this.getAttribute('duration'))
  }
  get delay() {
    return Number(this.getAttribute('delay'))
  }
  get color() {
    return this.getAttribute('color') || '#000000'        // black by default
  }
  get thickness() {
    return Number(this.getAttribute('thickness'))
  }
  get rotate() {
    return Number(this.getAttribute('rotate'))
  }
  get end() {
    return Number(this.getAttribute('end'))
  }
}

window.customElements.define('dm-pie-chart', DMPieChart)
window.customElements.define('dm-pie-slice', DMPieSlice)