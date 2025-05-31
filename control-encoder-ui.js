// encoder.js v1.5 (ปรับใหม่แบบ slider)

class Encoder {
  constructor(node, colour, label_str) {
    this.node = node;
    this.colour = colour;
    this.dark_colour = shadeBlend(-0.6, this.colour);
    this.min = 0;
    this.max = 100;
    this.val = 0;
    this.label = label_str;
    this.midiactions = [];
    this.isDragging = false;

    // Bind methods
    this.eventMouseDown = this.eventMouseDown.bind(this);
    this.eventMouseMove = this.eventMouseMove.bind(this);
    this.eventMouseUp = this.eventMouseUp.bind(this);

    // Canvas setup
    this.canvas = document.createElement("canvas");
    this.canvas.width = node.offsetWidth;
    this.canvas.height = node.offsetHeight;
    this.span = Math.min(this.canvas.width, this.canvas.height);
    this.node.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    // Listeners
    this.node.addEventListener("mousedown", this.eventMouseDown);
    this.node.addEventListener("touchstart", this.eventMouseDown);

    this.redraw();
  }

  eventMouseDown(event) {
    event.preventDefault();
    this.isDragging = true;

    document.addEventListener("mousemove", this.eventMouseMove);
    document.addEventListener("mouseup", this.eventMouseUp);

    document.addEventListener("touchmove", this.eventMouseMove);
    document.addEventListener("touchend", this.eventMouseUp);

    this.startY = event.clientY || event.touches[0].clientY;
  }

  eventMouseMove(event) {
    if (!this.isDragging) return;

    const currY = event.clientY || event.touches[0].clientY;
    const dy = currY - this.startY;

    this.callMove(dy);

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

  callMove(dy) {
    const step = 0.5; // ปรับ sensitivity ตรงนี้
    let new_val = this.val - dy * step;

    if (new_val > this.max) new_val = this.max;
    if (new_val < this.min) new_val = this.min;
    this.val = Math.round(new_val);

    this.redraw();
  }

  callMouseUp() {
    this.redraw();
  }

  redraw() {
    const ctx = this.ctx;
    const wedge = 0.7;
    const rad = this.span / 2.5;
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, rad, Math.PI * 0.7, Math.PI * 0.3, false);
    ctx.lineWidth = this.span / 12;
    ctx.lineCap = "round";
    ctx.strokeStyle = this.dark_colour;
    ctx.stroke();

    // Foreground arc
    ctx.beginPath();
    const angle =
      Math.PI * wedge +
      ((this.val - this.min) / (this.max - this.min)) *
        (Math.PI * 2.0 - Math.PI * 0.4);
    ctx.arc(cx, cy, rad, Math.PI * wedge, angle, false);
    ctx.lineWidth = this.span / 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = this.colour;
    ctx.stroke();

    let text =
      this.label.indexOf("#") >= 0
        ? this.label.replace("#", this.val)
        : this.label;
    const lab_len = Math.max(text.length, 3);
    const font_size = (this.canvas.width / lab_len) * 0.7;

    ctx.textAlign = "center";
    ctx.font = font_size + "px Arial"; // normal
    ctx.fillStyle = this.colour;
    ctx.fillText(text, cx, cy + font_size / 3);

    // Trigger MIDI actions
    for (let i = 0; i < this.midiactions.length; i++) {
      this.midiactions[i].trigger(this.val);
    }

    // Dispatch custom event
    this.node.dispatchEvent(
      new CustomEvent("encoder-change", { detail: { value: this.val } })
    );
  }

  resize() {
    this.canvas.width = this.node.offsetWidth;
    this.canvas.height = this.node.offsetHeight;
    this.span = Math.min(this.canvas.width, this.canvas.height);
    this.redraw();
  }
}

// ===========================
// Custom Element
// ===========================
class MidiEncoderElement extends HTMLElement {
  constructor() {
    super();
    this.encoder = null;
  }

  connectedCallback() {
    const label = this.getAttribute("label") || "Encoder";
    const colour = this.getAttribute("colour") || "#A82BE8";
    const init = parseInt(this.getAttribute("init"), 10);

    // ตั้งค่า style
    this.style.display = "inline-block";
    this.style.width = "100px";
    this.style.height = "100px";
    // this.style.border = `2px solid ${colour}`;
    this.style.borderRadius = "50%";
    this.style.boxSizing = "border-box";
    this.style.position = "relative";

    // ✅ สร้าง Encoder
    this.encoder = new Encoder(this, colour, label);

    // ถ้ามีค่า init
    if (!isNaN(init)) {
      this.encoder.val = Math.max(
        this.encoder.min,
        Math.min(this.encoder.max, init)
      );
      this.encoder.redraw();
    }
  }

  resize() {
    if (this.encoder) {
      this.encoder.resize();
    }
  }

  // Optional getter/setter
  get value() {
    return this.encoder ? this.encoder.val : 0;
  }

  set value(newVal) {
    if (this.encoder) {
      this.encoder.val = Math.max(
        this.encoder.min,
        Math.min(this.encoder.max, newVal)
      );
      this.encoder.redraw();
    }
  }
}

customElements.define("midi-encoder", MidiEncoderElement);
