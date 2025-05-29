class DrumKnob extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.totalDots = 20;
    this.dotElems = [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: 120px;
          height: 120px;
          background: linear-gradient(145deg, #5b6e7e, #2e353d);
          border-radius: 20px;
          font-family: sans-serif;
          color: white;
          text-align: center;
          padding-top: 10px;
          user-select: none;
        }
        .label {
          font-size: 14px;
          font-weight: bold;
          color: #d7f0ff;
        }
        .knob-circle {
          width: 70px;
          height: 70px;
          margin: 10px auto;
          background: radial-gradient(circle at 30% 30%, #2e353d, #1e2328);
          border-radius: 50%;
          box-shadow: -3px -3px 6px rgba(255,255,255,0.1), 3px 3px 6px rgba(0,0,0,0.5);
          position: relative;
        }
        svg {
          position: absolute;
          top: -15px;
          left: -15px;
        }
        .volume-label {
          font-size: 10px;
          color: #3f6b7a;
        }
      </style>
      <div class="label"></div>
      <div class="knob-circle">
        <svg width="190" height="190" viewBox="0 0 190 190">
          <g transform="translate(50,50)"></g>
        </svg>
      </div>
      <div class="volume-label">VOLUME</div>
    `;
  }

  static get observedAttributes() {
    return ["label", "init"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "label") {
      this.label = newValue;
      if (this.labelDiv) {
        this.labelDiv.textContent = `${this.label} ${this.value}`;
      }
    }
    if (name === "init") {
      this.init = parseInt(newValue) || 100;
      this.value = this.init;
      this.redraw();
    }
  }

  connectedCallback() {
    this.label = this.getAttribute("label") || "Drum";
    this.init = parseInt(this.getAttribute("init")) || 100;
    this.value = this.init;

    this.labelDiv = this.shadowRoot.querySelector(".label");
    this.g = this.shadowRoot.querySelector("g");

    for (let i = 0; i < this.totalDots; i++) {
      const angle = (i / this.totalDots) * 2 * Math.PI + Math.PI / 2;
      const x = 40 * Math.cos(angle);
      const y = 40 * Math.sin(angle);
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 2.5);
      dot.setAttribute("fill", "#3b4a52");
      this.g.appendChild(dot);
      this.dotElems.push(dot);
    }

    this.redraw();

    this.isDragging = false;
    this.startY = 0;

    const onMove = (e) => {
      if (!this.isDragging) return;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      const dy = this.startY - y;
      this.startY = y;
      this.value = Math.max(0, Math.min(100, this.value + dy));
      this.value = Math.round(this.value);
      this.redraw();
    };

    const onUp = () => {
      this.isDragging = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    const onDown = (e) => {
      this.isDragging = true;
      this.startY = e.clientY ?? e.touches?.[0]?.clientY;
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchmove", onMove);
      window.addEventListener("touchend", onUp);
    };

    this.shadowRoot.querySelector(".knob-circle").addEventListener("mousedown", onDown);
    this.shadowRoot.querySelector(".knob-circle").addEventListener("touchstart", onDown);
  }

  redraw() {
    const percent = this.value / 100;
    const litDots = Math.round(this.totalDots * percent);
    this.dotElems.forEach((dot, i) => {
      dot.setAttribute("fill", i < litDots ? "#a2ecff" : "#3b4a52");
    });
    if (this.labelDiv) {
    //   this.labelDiv.textContent = `${this.label} ${this.value}`;
      this.labelDiv.textContent = `${this.label}`;
    }
    this.dispatchEvent(new CustomEvent("knob-change", { detail: { value: this.value } }));
  }
}

customElements.define("drum-knob", DrumKnob);
