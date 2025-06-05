
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
  if (waveformAnimationId !== null) {
    cancelAnimationFrame(waveformAnimationId);
  }

  // สร้างประกายระยิบระยับ particle ใหม่ๆ
  function createSparkles(x, y) {
    const count = 5;
    for (let i = 0; i < count; i++) {
      sparkleParticles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        alpha: 1,
        size: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  function drawSparkles() {
    for (let i = sparkleParticles.length - 1; i >= 0; i--) {
      const p = sparkleParticles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= 0.02;
      if (p.alpha <= 0) {
        sparkleParticles.splice(i, 1);
        continue;
      }
      canvasCtx.beginPath();
      const gradient = canvasCtx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.size
      );
      gradient.addColorStop(0, `rgba(252, 52, 104, ${p.alpha})`);
      gradient.addColorStop(1, `rgba(0, 255, 255, 0)`);
      canvasCtx.fillStyle = gradient;
      canvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      canvasCtx.fill();
    }
  }

  function draw() {
    waveformAnimationId = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;

    // Gradient สีแบบไล่โทน
    const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#00FFFF");
    gradient.addColorStop(0.5, "#FF00FF");
    gradient.addColorStop(1, "#00FFFF");
    canvasCtx.strokeStyle = gradient;

    canvasCtx.beginPath();

    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      // สร้างประกายที่บางจุดของเส้น (เช่น ทุก 10 ตัว)
      if (i % 10 === 0) {
        createSparkles(x, y);
      }
      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    drawSparkles();
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


  
  
  
  
  
  
  
  
  
