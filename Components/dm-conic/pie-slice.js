class PieSlice extends HTMLElement{
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
    const css = new CSSStyleSheet()
    css.replaceSync(`
      :host {
        --p: ${this.end}
      }
      * {
        box-sizing: border-box;
      }
      
      div {
        width: ${this.width}px;
        aspect-ratio:1;
        margin:0;
        position: absolute;
        left: 50%;
        top: 50%;
        animation-name: p;
        animation-fill-mode: both;
        animation-timing-function: ease-in-out;
        transform: translate(-50%, -50%) rotate(${this.rotate}deg);
        animation-duration: ${this.duration}ms;
        animation-delay: ${this.delay}ms;
      }
      div:before {
        content:"";
        position:absolute;
        border-radius:50%;
        inset:0;
        background: conic-gradient(${this.color} calc(${this.end}%), transparent 0);
        -webkit-mask: radial-gradient(farthest-side, transparent calc(99% - ${this.thickness}px), #000 calc(100% - ${this.thickness}px));
        mask: radial-gradient(farthest-side,#0000 calc(99% - ${this.thickness}px), #000 calc(100% - ${this.thickness}px));
      }
      @keyframes p {
        from{
          --p: 0
        }
      }
    `)
    return css
  }
  constructor() {
    super();
    this.shadow = this.attachShadow({
      mode: 'open'
    })
    this.shadow.adoptedStyleSheets = [this.style];
    this.shadow.innerHTML = `<div/>`
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
    return this.getAttribute('color')
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

window.customElements.define('pie-slice', PieSlice)