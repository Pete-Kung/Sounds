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
