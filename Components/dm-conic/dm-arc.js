(() => {
  const mainSheet = new CSSStyleSheet()
  mainSheet.replaceSync(`
    * {
      box-sizing: border-box;
    }
    .segment {
      background-color: transparent;
      border-radius: 50%;
      border-width: 65px;
      border-color: blue;
      border-style: solid;
      clip: rect(0, calc(var(--dimension) * .5), var(--dimension), 0);
      height: 100%;
      position: absolute;
      width: 100%;
    }
  `)

  class Arc extends HTMLElement {
    static get observedAttributes() {
      return [
        // 'name',
        // 'color',
        // 'rotate',
        // 'duration',
        // 'start',
        // 'width',
      ];
    }
    constructor() {
      super()
      this.shadow = this.attachShadow({
        mode: 'open'
      })
      this.shadow.adoptedStyleSheets = [mainSheet];
      this.shadow.innerHTML = `
        <div class="segment"></div>
      `
      this.segment = this.shadow.querySelector('.segment')
    }
    connectedCallback() {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync( `
        
      `)
      this.segment.animate(
        [
          {
            transform: 'rotate(0deg)'
          }, {
            transform: `rotate(${this.end})`
          }
        ],
        {
          duration: this.duration,
          delay: this.delay,
          iterations: 1,
          fill: 'forwards',
          easing: 'ease-in-out',
        }
      )
      this.shadowRoot.adoptedStyleSheets = [mainSheet, sheet]
    }
    get name() {
      return this.getAttribute('name') || null
    }
    get end() {
      return this.getAttribute('end') || '120deg'
    }
    get color() {
      return this.getAttribute('color') || '#000000'
    }
    get delay() {
      return Number(this.getAttribute('delay')) || 0
    }
    get duration() {
      return Number(this.getAttribute('duration')) || 0
    }
    get rotate() {
      return this.getAttribute('rotate') || '0deg'
    }
    get title() {
      return this.getAttribute('title') || null
    }
    get width() {
      return this.getAttribute('width') || null
    }
  }
  window.customElements.define('dm-arc', Arc)
})()