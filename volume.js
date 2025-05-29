class VerticalSlider {
  constructor(node, colour, label_str) {
    this.node = node;
    this.colour = colour;
    this.label = label_str;
    this.min = 0;
    this.max = 127;
    this.val = 0;
    this.midiactions = [];

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
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
    this.knobImg.style.width = "80%";
    this.node.appendChild(this.knobImg);

    this.dark_colour = "#222"; // Default dark track color

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
    const knobHeight = this.canvas.height * 0.25;
    const sliderY =
      (1 - this.val / this.max) * this.canvas.height - knobHeight / 2;

    // Draw track
    ctx.fillStyle = this.dark_colour;
    ctx.fillRect(
      (this.canvas.width - barWidth) / 2,
      0,
      barWidth,
      this.canvas.height
    );

    // Position knob image
    this.knobImg.style.top = `${sliderY}px`;
    this.knobImg.style.left = `50%`;
    this.knobImg.style.transform = "translateX(-50%)";
    this.knobImg.style.height = `${knobHeight}px`;

    // Label
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = this.colour;
    ctx.fillText(
      this.label.replace("#", this.val),
      this.canvas.width / 2,
      this.canvas.height - 5
    );

    // MIDI actions
    this.midiactions.forEach((action) => action.trigger(this.val));

    // Dispatch event
    this.node.dispatchEvent(
      new CustomEvent("volume-change", { detail: { value: this.val } })
    );
  }

  resize() {
    this.canvas.width = this.node.offsetWidth;
    this.canvas.height = this.node.offsetHeight;
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
  }

  connectedCallback() {
    const label = this.getAttribute("label") || "Volume #";
    const colour = this.getAttribute("colour") || "#A82BE8";
    const init = parseInt(this.getAttribute("init"), 10) || 0;

    this.style.display = "inline-block";
    this.style.width = "40px";
    this.style.height = "120px";
    this.style.position = "relative";

    this.slider = new VerticalSlider(this, colour, label);
    this.slider.value = init;
  }

  get value() {
    return this.slider ? this.slider.value : 0;
  }

  set value(newVal) {
    if (this.slider) {
      this.slider.value = newVal;
    }
  }
}

customElements.define("midi-volume", MidiVolumeElement);
  
