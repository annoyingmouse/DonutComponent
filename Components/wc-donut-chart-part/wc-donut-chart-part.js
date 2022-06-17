(() => {
  const template = document.createElement('template')
  template.innerHTML = `
    <style>
      * {
        box-sizing: border-box;
      }
      .holder {
        border-radius: 50%;
        clip: rect(0, var(--dimension), var(--dimension), calc(var(--dimension) * 0.5));
        height: 100%;
        position: absolute;
        width: 100%;
      }
      .center {
        border-radius: 50%;
        clip: rect(0, calc(var(--dimension) * .5), var(--dimension), 0);
        height: 100%;
        position: absolute;
        width: 100%;
        font-size: 1.5rem;
        animation-fill-mode: forwards;
        animation-iteration-count: 1;
        animation-timing-function: ease;
        animation-name: rotate;
      }
    </style>
    <div class="holder">
      <div class="center"></div>
    </div>
  `

  class DonutChartPart extends HTMLElement {
    static get observedAttributes() {
      return [
        'name',
        'color',
        'rotate',
        'duration',
        'start'
      ];
    }
    constructor() {
      super()
      this.shadow = this.attachShadow({
        mode: 'closed'
      })
      this.shadow.appendChild(template.content.cloneNode(true))
      this.holder = this.shadow.querySelector('.holder')
      this.center = this.shadow.querySelector('.center')
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(${this.end});
          }
        }
      `
      this.shadow.prepend(style)
      this.render()
    }
    render() {
      this.holder.style.transform = `rotate(${this.rotate})`
      this.center.style.backgroundColor = this.color
      this.center.style.animationDelay = this.delay
      this.center.style.animationDuration = this.duration
      if(this.title){
        this.center.title = this.title
      }
    }

    get end() {
      return this.getAttribute('end') || '120deg'
    }
    get color() {
      return this.getAttribute('color') || '#000000'
    }
    get delay() {
      return this.getAttribute('delay') || '2s'
    }
    get duration() {
      return this.getAttribute('duration') || '1s'
    }
    get rotate() {
      return this.getAttribute('rotate') || '0deg'
    }
    get title() {
      return this.getAttribute('title') || null
    }
  }
  window.customElements.define('wc-donut-chart-part', DonutChartPart)
})()