
const soundsB = [
  { name: "Drum 1", file: "Drum_130_01.wav", container: "padB-1" },
  { name: "Drum 2", file: "Drum_130_02.wav", container: "padB-1" },
  { name: "Drum 3", file: "Drum_130_03.wav", container: "padB-1" },
  { name: "Drum 4", file: "Drum_130_04.wav", container: "padB-1" },
  { name: "Bass 1", file: "Bass_130_01.wav", container: "padB-2" },
  { name: "Bass 2", file: "Bass_130_02.wav", container: "padB-2" },
  { name: "Bass 3", file: "Bass_130_03.wav", container: "padB-2" },
  { name: "Bass 4", file: "Bass_130_04.wav", container: "padB-2" }
];

const mainGainNodeB = audioContext.createGain();
mainGainNodeB.connect(audioContext.destination);

async function loadBufferB(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

function queueStartPadB(pad) {
    if (!pad.buffer) return;
  
    const source = audioContext.createBufferSource();
    source.buffer = pad.buffer;
    source.connect(mainGainNodeB);
    source.loop = true;
    source.start();
  
    pad.source = source;
    pad.dataset.playing = "true";
    pad.classList.add("playing"); // ✅ เพิ่มไฮไลท์
  
    source.onended = () => {
      pad.dataset.playing = "false";
      pad.source = null;
      pad.classList.remove("playing"); // ✅ เอาไฮไลท์ออกเมื่อจบเสียง
    };
  }
  

  function stopPadB(pad = null) {
    if (pad) {
      if (pad.source) {
        pad.source.stop();
        pad.source.disconnect();
        pad.dataset.playing = "false";
        pad.source = null;
        pad.classList.remove("playing"); // ✅ ลบไฮไลท์
      }
    } else {
      document.querySelectorAll(".pad[data-playing='true']").forEach(p => {
        if (p.source) {
          p.source.stop();
          p.source.disconnect();
          p.dataset.playing = "false";
          p.source = null;
          p.classList.remove("playing"); // ✅ ลบไฮไลท์ทั้งหมด
        }
      });
    }
  }
  function stopAllPadsB() {
    const pads = document.querySelectorAll(".padB");
    pads.forEach((pad) => {
      if (pad.dataset.playing === "true") {
        stopPadB(pad);
      }
    });
  }
  

function createPadB(sound) {
  const pad = document.createElement("div");
  pad.classList.add("padB");
  pad.innerText = sound.name;
  pad.dataset.playing = "false";
  pad.buffer = null;
  pad.source = null;


  loadBufferB(`./sounds/Loop2/${sound.file}`).then((buffer) => {
    pad.buffer = buffer;
  });

  const container = document.getElementById(sound.container);

  pad.addEventListener("click", () => {
    const currentlyPlayingPad = container.querySelector(".pad[data-playing='true']");
    if (currentlyPlayingPad && currentlyPlayingPad !== pad) {
      stopPadB(currentlyPlayingPad);
    }

    if (pad.dataset.playing === "true") {
      stopPadB(pad);
    } else {
      queueStartPadB(pad);
    }
  });

  container.appendChild(pad);
}

// เรียกสร้าง pad ทั้งหมด
soundsB.forEach(sound => createPadB(sound));