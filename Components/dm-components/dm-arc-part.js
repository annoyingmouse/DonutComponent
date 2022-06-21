(() => {
  const mainSheet = new CSSStyleSheet()
  mainSheet.replaceSync(`
    :host { 
      --end: 20deg;
    }
    * {
      box-sizing: border-box;
    }
    .segment-holder {
      border-radius: 50%;
      clip: rect(0, var(--dimension), var(--dimension), calc(var(--dimension) * 0.5));
      height: 100%;
      position: absolute;
      width: 100%;
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
      animation-fill-mode: forwards;
      animation-iteration-count: 1;
      animation-timing-function: ease;
      animation-name: rotate;
    }
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(var(--end));
      }
    }
  `)

  class ArcPart extends HTMLElement {
    static get observedAttributes() {
      return [
        'name',
        'color',
        'rotate',
        'duration',
        'start',
        'width'
      ];
    }
    constructor() {
      super()
      this.shadow = this.attachShadow({
        mode: 'open'
      })
      this.shadow.adoptedStyleSheets = [mainSheet];
      this.shadow.innerHTML = `
        <div class="segment-holder">
          <div class="segment"></div>
        </div>
      `
      this.render()
    }
    render() {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync( `
        :host { 
          --end: ${this.end};
        }
        .segment-holder {
          transform: rotate(${this.rotate});
        }
        .segment {
          border-width: ${this.width};
          border-color: ${this.color};
          border-style: solid;
          animation-delay: ${this.delay};
          animation-duration: ${this.duration};
        }
      `)
      this.shadowRoot.adoptedStyleSheets = [mainSheet, sheet]
    }

    get end() {
      return this.getAttribute('end') || '120deg'
    }
    get color() {
      return this.getAttribute('color') || '#000000'
    }
    get delay() {
      return this.getAttribute('delay') || '0s'
    }
    get duration() {
      return this.getAttribute('duration') || '0s'
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
    attributeChangedCallback(name, oldValue, newValue) {
      if((oldValue !== newValue)){
        this.render()
      }
    }
  }
  window.customElements.define('dm-arc-part', ArcPart)
})()