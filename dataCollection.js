window.addEventListener("DOMContentLoaded", () => {
  console.log("on load");

  const defaultBtn = document.querySelector('.template-btn[data-key="A"]');
  if (defaultBtn) changeTemplate(defaultBtn, "A");

  controlVolume(); // เรียกทีเดียวพอ
});

function updateBpm() {
  console.log("click");
  const confirmBpm = document.getElementById("confirmBPM");
  const bpmValue = document.getElementById("bpmSlider");
  const bpmValueText = document.getElementById("bpmValue");

  const getPadId = confirmBpm.dataset.tab;
  updateLogDataBpm(getPadId, parseInt(bpmValue.value));
  bpmValueText.innerHTML = bpmValue.value;
}

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function controlVolume() {
  console.log("init control volume");

  const allPads = ["A", "B", "C", "D", "E"];

  allPads.forEach((pad) => {
    const volumepads = document.querySelectorAll(`.pad${pad}-volume`);

    volumepads.forEach((padEl, index) => {
      let lastVolume = padEl.getAttribute("data-volume");

      const logVolume = debounce(() => {
        const currentVolume = padEl.getAttribute("data-volume");
        if (currentVolume !== lastVolume) {
          console.log(
            `.pad${pad}-volume[${index}] final volume: ${currentVolume}`
          );
          lastVolume = currentVolume; // อัปเดตค่าล่าสุด
          updateLogdataKnob(pad);
        }
      }, 300);

      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-volume"
          ) {
            logVolume(); // debounce จะตรวจว่า volume เปลี่ยนจริงไหม ก่อนเรียก
          }
        }
      });

      observer.observe(padEl, {
        attributes: true,
        attributeFilter: ["data-volume"],
      });
    });
  });
}

function updateLogdataKnob(pad) {
  const volumeControll = document.querySelectorAll(`.pad${pad}-volume`);
  const bpmValue = document.getElementById("bpmSlider");
  const knobValues = {};
  let padStyle = null;

  volumeControll.forEach((div) => {
    const category = div.getAttribute("label");
    const volume = div.dataset.volume; // แปลงเป็นตัวเลข

    // เก็บไว้ใน knobValues โดยใช้ชื่อ category เป็น key
    knobValues[category] = volume * 100;
  });

  if (pad == "A") {
    padStyle = "Deep House";
  } else if (pad == "B") {
    padStyle = "Trap";
  } else if (pad == "C") {
    padStyle = "HipHop";
  } else if (pad == "D") {
    padStyle = "EDM";
  }

  const mData = {
    eventType: "VOLUME_ADJUST",
    presetName: padStyle,
    mixerPad: pad,
    bpm: Math.round(bpmValue.value),
    drumVolume: Math.round(knobValues.Drum),
    bassVolume: Math.round(knobValues.Bass),
    padVolume: Math.round(knobValues.Pad),
    synthVolume: Math.round(knobValues.Synth),
    fxVolume: Math.round(knobValues.FX),
  };

  console.log(mData);
  Collect_Data(mData);
}

function updateLogDataBpm(pad, bpm) {
  const mData = {
    eventType: "BPM_ADJUST",
    mixerPad: pad,
    bpm: bpm,
  };
  Collect_Data(mData);
}

function updateSelectPreset(pad) {
  let padStyle;
  if (pad == "A") {
    padStyle = "Deep House";
  } else if (pad == "B") {
    padStyle = "Trap";
  } else if (pad == "C") {
    padStyle = "HipHop";
  } else if (pad == "D") {
    padStyle = "EDM";
  }

  const mData = {
    eventType: "PRESET_SELECT",
    mixerPad: pad,
    presetName: padStyle,
  };
  console.log(mData);
  Collect_Data(mData);
}

function updatePadClick(pad, type) {
  const pad_type = type.slice(0, -2);

  const mData = {
    eventType: "PAD_CLICK",
    mixer_pad: pad,
    padType: pad_type,
    padId: type,
  };
  console.log(mData);
  Collect_Data(mData);
}

function updateFxClick(pad, type) {
  const pad_type = type.slice(0, -2);

  const mData = {
    eventType: "FX_CLICK",
    mixer_pad: pad,
    padType: pad_type,
    padId: type,
  };
  console.log(mData);
  Collect_Data(mData);
}

function updateStopPad(pad) {
  const padName = pad.replace(/pad/i, "");
  const mData = {
    eventType: "STOP_ALL",
    mixerPad: padName,
  };
  console.log(mData);
  Collect_Data(mData);
}
