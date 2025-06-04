window.addEventListener("DOMContentLoaded", () => {
  console.log("on load");

  const defaultBtn = document.querySelector('.template-btn[data-key="A"]');
  if (defaultBtn) changeTemplate(defaultBtn, "A");

  controlVolume(); // เรียกทีเดียวพอ
});

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
    knobValues[category] = volume;
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
    event_type: "knob_adjust",
    preset_name: padStyle,
    mixer_pad: pad,
    bpm: bpmValue.value,
    knob_values: knobValues,
  };

  console.log(mData);
}

function updateLogDataBpm(pad, bpm) {
  const mData = {
    event_type: "bpm_adjust",
    mixer_pad: pad,
    bpm: bpm,
  };
  console.log(mData);
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
    event_type: "preset_select",
    mixer_pad: pad,
    preset_name: padStyle,
    bpm: bpm,
  };
  console.log(mData);
}

function updatePadClick(pad, type) {
  const pad_type = type.slice(0, -2);

  const mData = {
    event_type: "pad_click",
    mixer_pad: pad,
    pad_type: pad_type,
    pad_id: type,
  };
  console.log(mData);
}

function updateFxClick(pad, type) {
  const pad_type = type.slice(0, -2);

  const mData = {
    event_type: "fx_click",
    mixer_pad: pad,
    pad_type: pad_type,
    pad_id: type,
  };
  console.log(mData);
}

function updateStopPad(pad) {
  const padName = pad.replace(/pad/i, "");
  const mData = {
    event_type: "stop_all",
    mixer_pad: padName,
  };
  console.log(mData);
}
