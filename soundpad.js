// สร้าง GainNode หลักที่ใช้รวมเสียงทั้งหมด
const mainGainNode = audioContext.createGain();
mainGainNode.connect(audioContext.destination); // เชื่อมต่อกับ output ของ audioContext
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
                queueStartPadFx(pad);
            }
        });
        pad.addEventListener("mouseup", () => {
            if (pad.dataset.playing === "true") {
                stopPadFx(pad);
            }
        });

        // รองรับมือถือ
        pad.addEventListener("touchstart", () => {
            if (pad.dataset.playing !== "true") {
                queueStartPadFx(pad);
            }
        });
        pad.addEventListener("touchend", () => {
            if (pad.dataset.playing === "true") {
                stopPadFx(pad);
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

function queueStartPadFx(pad) {
    const nextBarTime = audioContext.currentTime;

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = pad.buffer;
    source.loop = pad.parentElement.id !== "fxContainer"; // ถ้าไม่ใช่ fxContainer ให้ loop

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.connect(mainGainNode);

    pad.source = source;
    pad.gainNode = gainNode;

    gainNode.gain.setValueAtTime(1, nextBarTime);
    source.start(nextBarTime);

    pad.dataset.playing = "true";
    pad.classList.add("active");

    pad.pendingStopTime = null;
    pad._startTime = nextBarTime;

    // 📌 เพิ่ม event สำหรับ "ปล่อยมือ"
    const stopPad = () => {
        if (pad.dataset.playing === "true") {
            try {
                pad.source.stop();
            } catch (e) {
                console.warn("already stopped");
            }

            pad.dataset.playing = "false";
            pad.classList.remove("active");
        }

        // ลบ event listener หลังใช้
        window.removeEventListener("mouseup", stopPad);
        window.removeEventListener("touchend", stopPad);
    };

    // ⌛ รอจนกว่าผู้ใช้จะปล่อย
    window.addEventListener("mouseup", stopPad);
    window.addEventListener("touchend", stopPad);
}

function stopPadFx(pad) {
    if (pad.source && pad.gainNode) {
        const now = audioContext.currentTime;
        const holdDuration = now - (pad._startTime || now); // 🕒 คำนวณกดค้างนานแค่ไหน

        pad.gainNode.gain.setValueAtTime(pad.gainNode.gain.value, now);
        pad.gainNode.gain.linearRampToValueAtTime(0, now + 0.05); // fade out

        pad.source.stop(now + 0.05);
        pad.pendingStopTime = now + 0.05;
        pad.dataset.playing = "false";
        pad.classList.remove("active");

        setTimeout(() => {
            try {
                pad.source?.disconnect?.();
                pad.gainNode?.disconnect?.();
            } catch (e) {
                console.warn("disconnect error", e);
            }
            pad.source = null;
            pad.gainNode = null;
            pad.pendingStopTime = null;
            pad._startTime = null;
            pad.classList.remove("active");

        }, 100); // cleanup หลังเสียงหยุด
    }
}


function queueStartPad(pad) {
    const container = document.getElementById(pad.parentElement.id);
    const currentlyPlayingPad = container.querySelector("[data-playing='true']");
    const containerPads = document.querySelectorAll(".padContainer");
    let currentlyPlayingPad2 = null;

    containerPads.forEach(containerpad => {
        const padInContainer = containerpad.querySelector(".pad[data-playing='true']");
        if (padInContainer) {
            currentlyPlayingPad2 = padInContainer;
        }
    });

    const lockedTime = audioContext.currentTime;
    const syncedStartTime = Math.ceil(lockedTime / barDuration) * barDuration;

    if (currentlyPlayingPad2 == null) {
        // ✅ ไม่มี pad เล่นอยู่ → เริ่มทันทีแบบไม่ต้อง sync
        actuallyQueuePad(pad, false, lockedTime, lockedTime); // sync = false
    } else {
        if (currentlyPlayingPad !== pad) {
            stopPad(currentlyPlayingPad);
            const waitTime = (currentlyPlayingPad?.pendingStopTime || lockedTime) - lockedTime;
            setTimeout(() => {
                actuallyQueuePad(pad, true, lockedTime, syncedStartTime);
            }, waitTime * 1000);
        } else {
            actuallyQueuePad(pad, true, lockedTime, syncedStartTime);
        }
    }
}

function actuallyQueuePad(pad, sync = true, lockedTime = audioContext.currentTime, startTime = null) {
    const actualStartTime = sync
        ? (startTime ?? Math.ceil(lockedTime / barDuration) * barDuration)
        : lockedTime; // ถ้าไม่ sync → เริ่มทันที

    const currentBeat = Math.floor((lockedTime % barDuration) / beatDuration);

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    console.log(`[PAD START] startTime: ${actualStartTime.toFixed(3)}, now: ${lockedTime.toFixed(3)}, diff: ${(actualStartTime - lockedTime).toFixed(3)}`);

    source.buffer = pad.buffer;
    source.loop = true;

    source.connect(gainNode);
    gainNode.connect(mainGainNode);

    pad.source = source;
    pad.gainNode = gainNode;

    gainNode.gain.setValueAtTime(1, actualStartTime);
    source.start(actualStartTime);

    pad.dataset.playing = "true";
    pad.classList.add("active");

    const nextStartTime = Math.ceil(lockedTime / barDuration) * barDuration;
    pad.pendingStopTime = nextStartTime;

    if (sync) {
        beatEls[currentBeat].classList.add("pending");
        setTimeout(() => {
            beatEls[currentBeat].classList.remove("pending");
        }, (nextStartTime - lockedTime) * 1000);
    }
}




function stopPad(pad) {
    if (pad && pad.source && pad.gainNode) { // Ensure pad is not null/undefined
        try {
            pad.source.stop(); // ⬅️ หยุดทันที
            pad.source.disconnect?.();
            pad.gainNode.disconnect?.();
        } catch (e) {
            console.warn("Error while stopping/disconnecting:", e);
        }

        pad.source = null;
        pad.gainNode = null;
        pad.pendingStopTime = null;

        pad.dataset.playing = "false";
        pad.classList.remove("active");
    } else {
        console.warn("No valid pad to stop", pad);
    }
}

// สร้าง AnalyserNode สำหรับดึงข้อมูลเสียง
const analyser = audioContext.createAnalyser();
mainGainNode.connect(analyser);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const canvas = document.getElementById("waveformCanvas");
const canvasCtx = canvas.getContext("2d");
// ตั้งค่าขนาด canvas ให้ตรงกับ DOM
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas(); // เรียกครั้งแรก
// รองรับการ resize หน้าจอ
window.addEventListener("resize", () => {
    resizeCanvas();
});
// ฟังก์ชันวาดแท่งเสียง
function drawWaveformLine() {
    requestAnimationFrame(drawWaveformLine);
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "#00FFFF"; // สีฟ้านีออน
    canvasCtx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // กลางที่ 128
        const y = (v * canvas.height) / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}
function drawSoftBars() {
    requestAnimationFrame(drawSoftBars);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 1.2;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const hue = (i / bufferLength) * 100 + 200; // ไล่สีแนวพาสเทลม่วงฟ้า
        canvasCtx.fillStyle = `hsl(${hue}, 80%, 70%)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 0.5;
    }
}
function drawCircularBars() {
    requestAnimationFrame(drawCircularBars);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 40;
    const barCount = bufferLength;
    const angleStep = (Math.PI * 2) / barCount;

    // วาดวงกลมตรงกลางให้ดูเนียน
    canvasCtx.beginPath();
    canvasCtx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
    canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    canvasCtx.fill();

    for (let i = 0; i < barCount; i++) {
        const value = dataArray[i];
        const barLength = value / 255 * (canvas.height / 2 - radius - 20);

        const angle = i * angleStep;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barLength);
        const y2 = centerY + Math.sin(angle) * (radius + barLength);

        // ไล่เฉดสีแนวฟ้าชมพูเรืองแสง
        const gradient = canvasCtx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `hsla(${(i / barCount) * 360}, 100%, 70%, 0.8)`);
        gradient.addColorStop(1, `hsla(${(i / barCount) * 360 + 30}, 100%, 50%, 0.9)`);

        canvasCtx.strokeStyle = gradient;
        canvasCtx.lineWidth = 2;

        // เพิ่ม glow ด้วย shadow
        canvasCtx.shadowBlur = 8;
        canvasCtx.shadowColor = `hsla(${(i / barCount) * 360}, 100%, 60%, 0.6)`;

        canvasCtx.beginPath();
        canvasCtx.moveTo(x1, y1);
        canvasCtx.lineTo(x2, y2);
        canvasCtx.stroke();
    }

    // ล้าง shadow หลังวาดเสร็จ
    canvasCtx.shadowBlur = 0;
}
function drawWavePeaks() {
    requestAnimationFrame(drawWavePeaks);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const waveLayers = 3; // จำนวนคลื่นซ้อนกัน
    const gap = 10;       // ช่องว่างระหว่าง layer
    const baseHeight = canvas.height / 2;

    for (let layer = 0; layer < waveLayers; layer++) {
        const opacity = 1 - layer * 0.3;
        const offset = layer * gap;

        canvasCtx.beginPath();

        for (let i = 0; i < bufferLength; i++) {
            const x = (i / bufferLength) * canvas.width;
            const value = dataArray[i];
            const y = baseHeight - (value / 255 * canvas.height / (2.5 + layer * 1.2)); // ยอดคลื่น

            if (i === 0) {
                canvasCtx.moveTo(x, y + offset);
            } else {
                canvasCtx.lineTo(x, y + offset);
            }
        }

        const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, `rgba(255, 99, 132, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(54, 162, 235, ${opacity})`);
        gradient.addColorStop(1, `rgba(75, 192, 192, ${opacity})`);

        canvasCtx.strokeStyle = gradient;
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    }
}

drawWavePeaks()
// drawCircularBars()
//  drawSoftBars()
// drawWaveformLine(); 
