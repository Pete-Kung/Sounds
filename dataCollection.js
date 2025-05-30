
function updateLogdata (pad) {

    const padContainer = pad.replace(/-\d+$/, "");
    const volumeControll = document.querySelectorAll(`.${padContainer}-volume`);
    const bpmValue = document.getElementById("bpmSlider");
    const knobValues = {};

    volumeControll.forEach((div) => {
      const category = div.getAttribute("label");
      const volume = div.dataset.volume; // แปลงเป็นตัวเลข

      // เก็บไว้ใน knobValues โดยใช้ชื่อ category เป็น key
      knobValues[category] = volume;
    });

    const mData = {
      mixer_pad: padContainer,
      bpm: bpmValue.value,
      knob_values: knobValues,
    };

    console.log(mData);

    

}