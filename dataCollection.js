function updateLogdata(pad) {
  const padContainer = pad.replace(/-\d+$/, "");
  const volumeControll = document.querySelectorAll(`.${padContainer}-volume`);
  const bpmValue = document.getElementById("bpmSlider");
  const knobValues = {};
  let padStyle = null;

  volumeControll.forEach((div) => {
    const category = div.getAttribute("label");
    const volume = div.dataset.volume; // แปลงเป็นตัวเลข

    // เก็บไว้ใน knobValues โดยใช้ชื่อ category เป็น key
    knobValues[category] = volume;
  });

  if (padContainer == "padA") {
    padStyle = "Deep House";
  } else if (padContainer == "padB") {
    padStyle = "Trap";
  } else if (padContainer == "padC") {
    padStyle = "";
  } else if (padContainer == "padD") {
    padStyle = "EDM";
  }

  const mData = {
    pad_style: padStyle,
    mixer_pad: padContainer,
    bpm: bpmValue.value,
    knob_values: knobValues,
  };

  console.log(mData);
}
