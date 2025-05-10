
function createPad(sound) {
    const pad = document.createElement("div");
    pad.classList.add("pad");
    pad.innerText = sound.name;
    pad.dataset.playing = "false";
    pad.buffer = null;
    pad.source = null;
  
    loadBuffer(`./sounds/${sound.file}`).then((buffer) => {
      pad.buffer = buffer;
    });
  
    const container = document.getElementById(sound.container);
  
    if (sound.container === "fxContainer") {
      // แบบ "กดค้างเพื่อเล่น loop / ปล่อยเพื่อหยุด"
      pad.addEventListener("mousedown", () => {
        if (pad.dataset.playing !== "true") {
          queueStartPad(pad);
        }
      });
      pad.addEventListener("mouseup", () => {
        if (pad.dataset.playing === "true") {
          stopPad(pad);
        }
      });
  
      // รองรับมือถือ
      pad.addEventListener("touchstart", () => {
        if (pad.dataset.playing !== "true") {
          queueStartPad(pad);
        }
      });
      pad.addEventListener("touchend", () => {
        if (pad.dataset.playing === "true") {
          stopPad(pad);
        }
      });
    } else {
      // ปุ่มอื่นใช้ click toggle ปกติ
      pad.addEventListener("click", () => {
        const currentlyPlayingPad = container.querySelector(".pad[data-playing='true']");
        if (currentlyPlayingPad && currentlyPlayingPad !== pad) {
          stopPad(currentlyPlayingPad);
        }
  
        if (pad.dataset.playing === "true") {
          stopPad(pad);
        } else {
          queueStartPad(pad);
        }
      });
    }
  
    container.appendChild(pad);
  }
  
sounds.forEach(createPad);

function queueStartPad(pad) {
    const container = document.getElementById(pad.parentElement.id);
    const currentlyPlayingPad = container.querySelector(
        ".pad[data-playing='true']"
    );

    if (currentlyPlayingPad && currentlyPlayingPad !== pad) {
        stopPad(currentlyPlayingPad);
        // รอจนกว่า pad เดิมจะหยุดก่อนค่อยเริ่มใหม่
        const waitTime =
            (currentlyPlayingPad.pendingStopTime || audioContext.currentTime) -
            audioContext.currentTime;

        setTimeout(() => {
            actuallyQueuePad(pad);
        }, waitTime * 1000);
    } else {
        actuallyQueuePad(pad);
    }
}
function actuallyQueuePad(pad) {
    const nextBarTime =
        Math.ceil(audioContext.currentTime / barDuration) * barDuration;
    const currentBeat = Math.floor((nextBarTime % barDuration) / beatDuration);
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = pad.buffer;
    source.loop = true;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    pad.source = source;
    pad.gainNode = gainNode;
    gainNode.gain.setValueAtTime(1, nextBarTime);
    source.start(nextBarTime);
    pad.dataset.playing = "true";
    pad.classList.add("active");
    // optional: บอกผู้ใช้ว่ากำลังจะเริ่ม
    beatEls[currentBeat].classList.add("pending");
    setTimeout(() => {
        beatEls[currentBeat].classList.remove("pending");
    }, (nextBarTime - audioContext.currentTime) * 1000);
}
function stopPad(pad) {
    if (pad.source && pad.gainNode) {
        const stopTime =
            Math.ceil(audioContext.currentTime / barDuration) * barDuration;
        pad.gainNode.gain.setValueAtTime(
            pad.gainNode.gain.value,
            audioContext.currentTime
        );
        pad.gainNode.gain.linearRampToValueAtTime(0, stopTime);
        pad.source.stop(stopTime);
        pad.pendingStopTime = stopTime; // 👈 เก็บเวลาไว้
        pad.dataset.playing = "false";
        pad.classList.remove("active");

        setTimeout(() => {
            try {
                pad.source?.disconnect?.();
                pad.gainNode?.disconnect?.();
            } catch (e) {
                console.warn("Error while disconnecting:", e);
            }
            pad.source = null;
            pad.gainNode = null;
            pad.pendingStopTime = null;
        }, (stopTime - audioContext.currentTime) * 1000 + 50);
        
    }
}