let waveformAnimationId = null;

let sparkleParticles = [];
let sparkleHue = 0;

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
function drawWaveformLine(analyser, canvas, canvasCtx, dataArray) {
  const bufferLength = analyser.frequencyBinCount;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.6;

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i];
      const percent = value / 255;
      const barLength = percent * radius;
      const angle = (i / bufferLength) * Math.PI * 2;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const xEnd = centerX + Math.cos(angle) * (radius + barLength);
      const yEnd = centerY + Math.sin(angle) * (radius + barLength);

      const hue = (i / bufferLength) * 360;
      canvasCtx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
      canvasCtx.lineWidth = 2;
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, y);
      canvasCtx.lineTo(xEnd, yEnd);
      canvasCtx.stroke();
    }
  }

  draw();
}

function drawSoftBars(analyser, canvas, canvasCtx, dataArray) {
  const bufferLength = analyser.frequencyBinCount;

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1.2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      const hue = (i / bufferLength) * 100 + 200;
      canvasCtx.fillStyle = `hsl(${hue}, 80%, 70%)`;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 0.5;
    }
  }

  draw();
}

function drawCircularBars(analyser, canvas, canvasCtx, dataArray) {
  const bufferLength = analyser.frequencyBinCount;

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 40;
    const barCount = bufferLength;
    const angleStep = (Math.PI * 2) / barCount;

    canvasCtx.beginPath();
    canvasCtx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
    canvasCtx.fillStyle = "rgba(255, 255, 255, 0.05)";
    canvasCtx.fill();

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i];
      const barLength = (value / 255) * (canvas.height / 2 - radius - 20);

      const angle = i * angleStep;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barLength);
      const y2 = centerY + Math.sin(angle) * (radius + barLength);

      const gradient = canvasCtx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `hsla(${(i / barCount) * 360}, 100%, 70%, 0.8)`);
      gradient.addColorStop(
        1,
        `hsla(${(i / barCount) * 360 + 30}, 100%, 50%, 0.9)`
      );

      canvasCtx.strokeStyle = gradient;
      canvasCtx.lineWidth = 2;
      canvasCtx.shadowBlur = 8;
      canvasCtx.shadowColor = `hsla(${(i / barCount) * 360}, 100%, 60%, 0.6)`;

      canvasCtx.beginPath();
      canvasCtx.moveTo(x1, y1);
      canvasCtx.lineTo(x2, y2);
      canvasCtx.stroke();
    }

    canvasCtx.shadowBlur = 0;
  }

  draw();
}

function drawWavePeaks(analyser, canvas, canvasCtx, dataArray) {
  const bufferLength = analyser.frequencyBinCount;

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const waveLayers = 3;
    const gap = 10;
    const baseHeight = canvas.height / 2;

    for (let layer = 0; layer < waveLayers; layer++) {
      const opacity = 1 - layer * 0.3;
      const offset = layer * gap;

      canvasCtx.beginPath();

      for (let i = 0; i < bufferLength; i++) {
        const x = (i / bufferLength) * canvas.width;
        const value = dataArray[i];
        const y =
          baseHeight - ((value / 255) * canvas.height) / (2.5 + layer * 1.2);

        i === 0
          ? canvasCtx.moveTo(x, y + offset)
          : canvasCtx.lineTo(x, y + offset);
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

  draw();
}
