class VerticalSlider {
  constructor(node, colour, label_str) {
    this.node = node;
    this.colour = colour;
    this.label_format = label_str;
    this.min = 0;
    this.max = 100;
    this.val = 0;
    this.midiactions = [];

    this.ro = new ResizeObserver(() => {
      this.resize();
    });
    this.ro.observe(this.node);

    // Create label div FIRST to get its height
    this.labelDiv = document.createElement("div");
    this.labelDiv.style.position = "absolute";
    this.labelDiv.style.bottom = "0"; // ตั้ง bottom เป็น 0 ให้อยู่ในขอบเขตของ this.node
    this.labelDiv.style.left = "0";
    this.labelDiv.style.width = "100%";
    this.labelDiv.style.textAlign = "center";
    this.labelDiv.style.color = "#FFFF";
    this.labelDiv.style.fontFamily = "Arial, sans-serif";
    this.labelDiv.style.fontSize = "12px";
    this.labelDiv.style.fontWeight = "bold";
    this.node.appendChild(this.labelDiv);

    // Set a temporary text content for labelDiv to ensure offsetHeight is calculated correctly
    this.labelDiv.textContent = this.label_format.replace("#", this.val);

    const labelHeight = this.labelDiv.offsetHeight;

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    // Height for canvas now explicitly calculated
    this.canvas.style.height = `calc(100% - ${labelHeight + 25}px)`;
    this.canvas.style.display = "block";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.node.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    // Create knob image
    this.knobImg = document.createElement("img");
    this.knobImg.src = "./images/volume_icon.png";
    this.knobImg.style.position = "absolute";
    this.knobImg.style.pointerEvents = "none";
    // knobImg width/height will be set in redraw() based on calculated knobHeight

    // === ตกแต่งให้สวยขึ้น ===
    this.knobImg.style.borderRadius = "50%";
    this.knobImg.style.boxShadow = "0 4px 10px rgba(0,0,0,0.4)";
    this.knobImg.style.border = "2px solid white";
    this.knobImg.style.backgroundColor = "#ffffffcc";
    // =========================

    this.node.appendChild(this.knobImg);

    this.dark_colour = "#222"; // Default dark track color
    this.track_fill_colour = this.colour; // เพิ่มสีสำหรับส่วนที่เติมของ track (ถ้ามี)

    // Bind events
    this.eventMouseDown = this.eventMouseDown.bind(this);
    this.eventMouseMove = this.eventMouseMove.bind(this);
    this.eventMouseUp = this.eventMouseUp.bind(this);

    // Attach events
    this.node.addEventListener("mousedown", this.eventMouseDown);
    this.node.addEventListener("touchstart", this.eventMouseDown, {
      passive: false,
    });

    // Initial draw
    this.resize(); // Includes redraw
    window.addEventListener("resize", () => this.resize());
  }

  eventMouseDown(event) {
    event.preventDefault();
    this.isDragging = true;

    document.addEventListener("mousemove", this.eventMouseMove);
    document.addEventListener("mouseup", this.eventMouseUp);

    document.addEventListener("touchmove", this.eventMouseMove, {
      passive: false,
    });
    document.addEventListener("touchend", this.eventMouseUp);

    this.updateValue(event);
  }

  eventMouseMove(event) {
    if (!this.isDragging) return;
    this.updateValue(event);
  }

  eventMouseUp(event) {
    this.isDragging = false;

    document.removeEventListener("mousemove", this.eventMouseMove);
    document.removeEventListener("mouseup", this.eventMouseUp);

    document.removeEventListener("touchmove", this.eventMouseMove);
    document.removeEventListener("touchend", this.eventMouseUp);
  }

  updateValue(event) {
    const rect = this.canvas.getBoundingClientRect();
    const y =
      (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
    const valRatio = 1 - y / this.canvas.height;
    this.val = Math.max(
      this.min,
      Math.min(this.max, Math.round(valRatio * (this.max - this.min)))
    );
    this.redraw();
  }

  redraw() {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const barWidth = this.canvas.width / 4;
    const trackX = (this.canvas.width - barWidth) / 2;
    const usableCanvasHeight = this.canvas.height;

    const knobSizeRatio = 0.6;
    const knobHeight = this.canvas.width * knobSizeRatio;
    const knobWidth = knobHeight;

    const knobTravelRange = usableCanvasHeight - knobHeight;

    // คำนวณตำแหน่งของ knob (ชดเชยให้เลื่อนลงสุดพอดี)
    let sliderY = (1 - this.val / this.max) * knobTravelRange;
    sliderY = Math.min(Math.max(sliderY, 0), knobTravelRange); // Clamp ค่าไม่ให้ออกนอกขอบ

    // --- วาด Track ---
    const knobCenterY = sliderY + knobHeight / 2;

    // 1. Filled track (จากล่างถึง knob)
    const fillHeight = usableCanvasHeight - knobCenterY;
    const fillY = knobCenterY;

    if (fillHeight > 0) {
      ctx.fillStyle = this.track_fill_colour;
      ctx.fillRect(trackX, fillY, barWidth, fillHeight);
    }

    // 2. Empty track (จากบนถึง knob)
    const emptyHeight = knobCenterY;
    ctx.fillStyle = this.dark_colour;
    ctx.fillRect(trackX, 0, barWidth, emptyHeight);

    // --- วางตำแหน่ง Knob ---
    this.knobImg.style.top = `${sliderY}px`;
    this.knobImg.style.left = `50%`;
    this.knobImg.style.transform = "translateX(-50%)";
    this.knobImg.style.height = `${knobHeight}px`;
    this.knobImg.style.width = `${knobWidth}px`;

    // --- Label ---
    this.labelDiv.textContent = this.label_format.replace("#", this.val);

    // MIDI actions
    this.midiactions.forEach((action) => action.trigger(this.val));

    // Dispatch event
    this.node.dispatchEvent(
      new CustomEvent("volume-change", { detail: { value: this.val } })
    );
  }

  resize() {
    if (!this.canvas || !this.labelDiv) return;

    const labelHeight = this.labelDiv.offsetHeight;
    const labelMarginBottom = 5;

    this.canvas.width = this.node.offsetWidth;
    this.canvas.height =
      this.node.offsetHeight - (labelHeight + labelMarginBottom);

    this.redraw();
  }

  get value() {
    return this.val;
  }

  set value(newVal) {
    this.val = Math.max(this.min, Math.min(this.max, newVal));
    this.redraw();
  }
}

class MidiVolumeElement extends HTMLElement {
  constructor() {
    super();
    this.slider = null;
    this._value = 0; // สำหรับเก็บค่า value แยกต่างหาก
  }

  static get observedAttributes() {
    return ["label", "init"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "label") {
      this.label = newValue;
      if (this.labelDiv) {
        this.labelDiv.textContent = `${this.label} ${this._value}`;
      }
    }

    if (name === "init") {
      const parsed = parseInt(newValue);
      if (!isNaN(parsed)) {
        this._value = parsed;
        if (this.slider) {
          this.slider.value = parsed; // ถ้ามี slider แล้ว → ตั้งค่าเลย
        }
      }
    }

    console.log("attributeCallback:", name, newValue);
  }

  connectedCallback() {
    const label = this.getAttribute("label") || "Volume #";
    const colour = this.getAttribute("colour") || "#A82BE8";

    // อ่านค่าจาก attribute อีกครั้ง (ใช้ _value ถ้า attributeChanged เคยโดนเรียก)
    const init = !isNaN(this._value)
      ? this._value
      : parseInt(this.getAttribute("init")) || 0;

    this.style.display = "inline-block";
    this.style.width = "40px";
    this.style.height = "150px";
    this.style.position = "relative";
    this.style.display = "flex";
    this.style.flexDirection = "column";
    this.style.alignItems = "center";

    this.slider = new VerticalSlider(this, colour, label);

    requestAnimationFrame(() => {
      this.slider.value = init; // ✅ ใช้ค่าที่เก็บไว้
      this.slider.resize();
    });
  }

  get value() {
    return this.slider ? this.slider.value : this._value;
  }

  set value(newVal) {
    this._value = newVal;
    if (this.slider) {
      this.slider.value = newVal;
    }
  }
}

customElements.define("midi-volume", MidiVolumeElement);
