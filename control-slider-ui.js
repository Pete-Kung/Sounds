// slider.js (v1.4 — Fixed version)

function shadeBlend(p, c) {
  var n = p < 0 ? p * -1 : p,
    u = Math.round,
    w = parseInt,
    t = c.length > 7 ? c.slice(1, 7) : c.slice(1),
    R = w(t.substr(0, 2), 16),
    G = w(t.substr(2, 2), 16),
    B = w(t.substr(4, 2), 16);

  return (
    "#" +
    (
      0x1000000 +
      (u((1 - n) * R + n * (p < 0 ? 0 : 255)) << 16) +
      (u((1 - n) * G + n * (p < 0 ? 0 : 255)) << 8) +
      u((1 - n) * B + n * (p < 0 ? 0 : 255))
    )
      .toString(16)
      .slice(1)
  );
}

class Slider {
  constructor(node, type, colour, label_str) {
    this.node = node;
    this.type = type.toUpperCase();
    this.colour = colour;
    this.dark_colour = shadeBlend(-0.6, this.colour);
    this.min = 0;
    this.max = 100;
    this.val = 0;
    this.label = label_str;
    this.midiactions = [];
    this.isDragging = false;

    this.eventMouseDown = this.eventMouseDown.bind(this);
    this.eventMouseMove = this.eventMouseMove.bind(this);
    this.eventMouseUp = this.eventMouseUp.bind(this);

    this.node.addEventListener("mousedown", this.eventMouseDown);
    this.node.addEventListener("touchstart", this.eventMouseDown);

    this.node.firstElementChild.style.color = this.colour;
    this.node.style.borderColor = this.colour;

    this.redraw();
  }

  eventMouseDown(event) {
    event.preventDefault();
    this.isDragging = true;

    document.addEventListener("mousemove", this.eventMouseMove);
    document.addEventListener("mouseup", this.eventMouseUp);

    document.addEventListener("touchmove", this.eventMouseMove);
    document.addEventListener("touchend", this.eventMouseUp);

    this.startX = event.clientX || event.touches[0].clientX;
    this.startY = event.clientY || event.touches[0].clientY;
  }

  eventMouseMove(event) {
    if (!this.isDragging) return;

    const currX = event.clientX || event.touches[0].clientX;
    const currY = event.clientY || event.touches[0].clientY;

    const dx = currX - this.startX;
    const dy = currY - this.startY;

    this.callMove(dx, dy);

    this.startX = currX;
    this.startY = currY;
  }

  eventMouseUp(event) {
    this.isDragging = false;

    document.removeEventListener("mousemove", this.eventMouseMove);
    document.removeEventListener("mouseup", this.eventMouseUp);

    document.removeEventListener("touchmove", this.eventMouseMove);
    document.removeEventListener("touchend", this.eventMouseUp);

    this.callMouseUp();
  }

  callMove(dx, dy) {
    let new_val = 0;
    const step = 0.5;

    if (this.type === "HORIZONTAL") new_val = this.val + dx * step;
    else new_val = this.val - dy * step;

    new_val = Math.max(this.min, Math.min(this.max, new_val));
    this.val = Math.round(new_val);

    this.redraw();
  }

  callMouseUp() {
    this.redraw();
  }

  redraw() {
    if (this.label.indexOf("#") >= 0)
      this.node.firstElementChild.innerHTML = this.label.replace("#", this.val);
    else this.node.firstElementChild.innerHTML = this.label;

    const lab_len = Math.max(this.node.firstElementChild.innerHTML.length, 1);
    if (this.type == "HORIZONTAL")
      this.node.firstElementChild.style.fontSize = (60 / lab_len) * 1.8 + "px";
    else
      this.node.firstElementChild.style.fontSize = (60 / lab_len) * 1.3 + "px";

    const perc = ((this.val - this.min) / (this.max - this.min)) * 100.0;
    const angle = this.type == "HORIZONTAL" ? 90 : 0;
    this.node.style.background = `linear-gradient(${angle}deg, ${this.dark_colour} ${perc}%, black ${perc}%)`;

    for (let i = 0; i < this.midiactions.length; i++) {
      this.midiactions[i].trigger(this.val);
    }
  }
}

class MidiSliderElement extends HTMLElement {
  constructor() {
    super();
    this.slider = null;
  }

  connectedCallback() {
    const label = this.getAttribute("label") || "Slider";
    const colour = this.getAttribute("colour") || "#A82BE8";
    const type = this.getAttribute("type") || "vertical";
    const init = parseInt(this.getAttribute("init"), 10);

    this.style.display = "flex";
    this.style.alignItems = "center";
    this.style.justifyContent = "center";
    this.style.border = `2px solid ${colour}`;
    this.style.userSelect = "none";
    this.style.touchAction = "none";
    this.style.boxSizing = "border-box";
    this.style.borderRadius = "8px";

    if (type.toLowerCase() === "horizontal") {
      this.style.width = "200px";
      this.style.height = "60px";
    } else {
      this.style.width = "60px";
      this.style.height = "200px";
    }

    const span = document.createElement("span");
    span.style.pointerEvents = "none";
    span.style.textAlign = "center";
    this.appendChild(span);

    this.slider = new Slider(this, type, colour, label);
    // ถ้ามีค่า init -> ตั้งค่าตั้งต้น
    if (!isNaN(init)) {
      this.slider.val = Math.max(
        this.slider.min,
        Math.min(this.slider.max, init)
      );
      this.slider.redraw();
    }

    const originalRedraw = this.slider.redraw.bind(this.slider);
    this.slider.redraw = () => {
      originalRedraw();
      this.dispatchEvent(
        new CustomEvent("slider-change", {
          detail: { value: this.slider.val },
        })
      );
    };
  }

  get value() {
    return this.slider ? this.slider.val : 0;
  }

  set value(newVal) {
    if (this.slider) {
      this.slider.val = Math.max(
        this.slider.min,
        Math.min(this.slider.max, newVal)
      );
      this.slider.redraw();
    }
  }
}

customElements.define("midi-slider", MidiSliderElement);

class MidiKnobElement extends HTMLElement {
  static get observedAttributes() {
    return ["type", "colour", "label", "min", "max", "step", "init", "clock"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._value = 0;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.angleRange = 270;
    this.startAngle = -135;
  }

  get value() {
    return this._value;
  }

  set value(newVal) {
    const clampedVal = Math.max(this.min, Math.min(this.max, newVal));
    if (clampedVal !== this._value) {
      this._value = clampedVal;
      this.updateRotation();
      this.dispatchEvent(
        new CustomEvent("knob-volume-change", {
          detail: { value: this._value },
        })
      );
      if (this.valueDisplay) {
        this.valueDisplay.innerText = this._value;
      }
    }
  }

  connectedCallback() {
    // อ่านค่า attribute
    this.min = parseFloat(this.getAttribute("min")) || this.min;
    this.max = parseFloat(this.getAttribute("max")) || this.max;
    this.step = parseFloat(this.getAttribute("step")) || this.step;
    const initAttr = this.getAttribute("init");
    if (initAttr !== null) {
      this._value = parseFloat(initAttr);
    }
    this._value = Math.max(this.min, Math.min(this.max, this._value));

    this.render();
    this.updateRotation();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "type" && this.wrapper) {
      this.applyStyle(this.wrapper, newVal);
    }

    if (name === "label" && this.labelDisplay) {
      this.labelDisplay.innerText = newVal;
    }

    if (name === "colour" && this.wrapper) {
      this.applyStyle(this.wrapper, this.getAttribute("type") || "metallic");
    }

    if (["min", "max", "step"].includes(name)) {
      this[name] = parseFloat(newVal);
      this.value = this._value; // re-clamp
    }
    if (name === "init") {
      this._value = parseFloat(newVal);
      this._value = Math.max(this.min, Math.min(this.max, this._value));
      this.updateRotation();
    }
  }

  render() {
    const label = this.getAttribute("label") || "Knob";
    const type = this.getAttribute("type") || "metallic";
    this.colour = this.getAttribute("colour") || "#A82BE8";
    this.clock = this.getAttribute("clock") || "#A82BE8";
    const darkerColour = this.darkenColor(this.clock, 0.2);

    this.wrapper = document.createElement("div");
    Object.assign(this.wrapper.style, {
      position: "relative",
      width: "120px", // ขยายขนาด
      height: "140px",
      borderRadius: "16px", // กรอบมน
      display: "flex",
      flexDirection: "column", // ให้ label/value อยู่ด้านบน/ล่างของ knob
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#111", // โทนดำ
      padding: "10px",
      boxSizing: "border-box",
      boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
    });

    this.applyStyle(this.wrapper, type);

    // Label
    this.labelDisplay = document.createElement("div");
    Object.assign(this.labelDisplay.style, {
      color: "#fff",
      fontSize: "13px",
      marginBottom: "6px",
      fontWeight: "bold",
    });
    this.labelDisplay.innerText = label;

    // ปุ่ม pointer
    const knob = document.createElement("div");
    Object.assign(knob.style, {
      position: "relative",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#222",
      border: "2px solid #444",
      boxShadow: "inset -2px -2px 5px #000, inset 2px 2px 5px #555",
    });

    this.pointer = document.createElement("div");
    Object.assign(this.pointer.style, {
      width: "4px",
      height: "35%",
      background: darkerColour,
      position: "absolute",
      top: "10%",
      borderRadius: "2px",
      transformOrigin: "bottom center",
      transition: "transform 0.05s ease-out",
    });
    knob.appendChild(this.pointer);

    // ค่า value
    this.valueDisplay = document.createElement("div");
    Object.assign(this.valueDisplay.style, {
      color: "#ccc",
      fontSize: "14px",
      marginTop: "6px",
      fontWeight: "bold"
    });
    this.valueDisplay.innerText = this._value;

    this.wrapper.appendChild(this.labelDisplay);
    this.wrapper.appendChild(knob);
    this.wrapper.appendChild(this.valueDisplay);
    this.shadowRoot.appendChild(this.wrapper);

    this.initEvents();
  }

  initEvents() {
    let startY = 0;
    let startValue = this._value;

    const onMove = (e) => {
      const dy = (e.clientY || e.touches[0].clientY) - startY;
      let newVal = startValue - dy * this.step;
      newVal = Math.round(newVal / this.step) * this.step;
      this.value = newVal;
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };

    this.wrapper.addEventListener("mousedown", (e) => {
      startY = e.clientY;
      startValue = this._value;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });

    this.wrapper.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
      startValue = this._value;
      document.addEventListener("touchmove", onMove);
      document.addEventListener("touchend", onUp);
    });

    this.wrapper.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.value += e.deltaY < 0 ? this.step : -this.step;
    });
  }

  updateRotation() {
    const ratio = (this._value - this.min) / (this.max - this.min);
    const angle = this.startAngle + ratio * this.angleRange;
    this.pointer.style.transform = `rotate(${angle}deg)`;
    this.valueDisplay.innerText = this._value;
    this.dispatchEvent(
      new CustomEvent("knob-volume-change", { detail: { value: this._value } })
    );
  }

  darkenColor(color, percent) {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
    return `rgb(${r},${g},${b})`;
  }

  applyStyle(el, style) {
    switch (style) {
      case "metallic":
        el.style.background = `radial-gradient(circle at 30% 30%, #2e2e2e, ${this.colour})`; // โทนดำเทา
        el.style.border = `2px solid #555`; // ขอบเทาเข้ม
        el.style.boxShadow = `
                              inset -2px -2px 4px #1a1a1a, 
                              inset 2px 2px 6px #666`; // แสงและเงาแบบมีมิติ
        break;
      case "carbon":
        el.style.background = `repeating-linear-gradient(45deg, #2b2b2b, #2b2b2b 10px, #1c1c1c 10px, #1c1c1c 20px)`;
        el.style.border = `2px solid #444`;
        el.style.boxShadow = `0 0 10px rgba(0,0,0,0.5)`;
        break;
      case "plastic":
        el.style.background = this.colour;
        el.style.border = `2px solid #000`;
        el.style.boxShadow = `inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3)`;
        break;
      case "fire":
        el.style.background = `radial-gradient(circle at center, #ff5722, #b71c1c)`;
        el.style.border = `2px solid #ff8a65`;
        el.style.boxShadow = `0 0 10px #ff5722, 0 0 20px #ff7043`;
        break;
      case "threeD":
        el.style.background = `linear-gradient(145deg, ${this.colour}, #222)`;
        el.style.boxShadow = `
          5px 5px 15px rgba(0,0,0,0.7),
          -5px -5px 15px rgba(255,255,255,0.2),
          inset 2px 2px 5px rgba(255,255,255,0.3),
          inset -2px -2px 5px rgba(0,0,0,0.7)
        `;
        el.style.borderRadius = "8px";
        break;
      case "flat":
      default:
        el.style.background = this.colour;
        el.style.border = "none";
        el.style.boxShadow = "none";
        break;
    }
  }
}

customElements.define("midi-knob", MidiKnobElement);
