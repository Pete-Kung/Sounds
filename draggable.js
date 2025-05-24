let isEditMode = false;
  let buttonCount = 0;

  const canvasArea = document.getElementById("canvasArea");
  const toggleEditBtn = document.getElementById("toggleEditBtn");
  const addButton = document.getElementById("addButton");
  const clearButton = document.getElementById("clearButton");
  const saveButton = document.getElementById("saveButton");

  toggleEditBtn.addEventListener("click", () => {
    isEditMode = !isEditMode;
    toggleEditBtn.innerText = isEditMode ? "✅ ออกจากโหมดแก้ไข" : "🛠 เข้าสู่โหมดแก้ไข";

    document.querySelectorAll(".draggable").forEach(btn => {
      btn.style.cursor = isEditMode ? "move" : "default";
      btn.querySelector(".close-btn").style.display = isEditMode ? "block" : "none";
      btn.setAttribute("draggable", isEditMode);
    });
  });

  addButton.addEventListener("click", () => {
    if (!isEditMode) {
      alert("กรุณาเข้าสู่โหมดแก้ไขก่อนเพิ่มปุ่ม");
      return;
    }
    showTypePopup();
  });

  clearButton.addEventListener("click", () => {
    if (!isEditMode) {
      alert("เข้าสู่โหมดแก้ไขก่อนล้างข้อมูล");
      return;
    }
    document.querySelectorAll(".draggable").forEach(btn => btn.remove());
    localStorage.removeItem("buttons");
    buttonCount = 0;
  });

  saveButton.addEventListener("click", () => {
    const buttons = [];
    document.querySelectorAll(".draggable").forEach(btn => {
      buttons.push({
        id: btn.dataset.id,
        type: btn.dataset.type,
        label: btn.innerText.replace("✖", "").trim(),
        x: btn.style.left,
        y: btn.style.top
      });
    });
    localStorage.setItem("buttons", JSON.stringify(buttons));
    alert("บันทึกเรียบร้อยแล้ว!");

    // ปิดโหมดแก้ไข
    isEditMode = false;
    toggleEditBtn.innerText = "🛠 เข้าสู่โหมดแก้ไข";

    // ซ่อนปุ่ม close และเปลี่ยน cursor ของปุ่ม draggable
    document.querySelectorAll(".draggable").forEach(btn => {
      btn.style.cursor = "default";
      btn.querySelector(".close-btn").style.display = "none";
      btn.setAttribute("draggable", false);
    });
  });

  function showTypePopup() {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `<h3>เลือกประเภทปุ่ม</h3>`;

    const midiBtn = document.createElement("button");
    midiBtn.innerText = "🎚 MIDI Encoder";
    midiBtn.onclick = () => {
      document.body.removeChild(overlay);
      createDraggableButton("Bass #" + (++buttonCount), "midi");
    };

    const padBtn = document.createElement("button");
    padBtn.innerText = "🥁 Pad";
    padBtn.onclick = () => {
      document.body.removeChild(overlay);
      createDraggableButton("Pad " + (++buttonCount), "pad");
    };

    popup.appendChild(midiBtn);
    popup.appendChild(padBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

  function createDraggableButton(label, type, x = "50px", y = "50px", id = Date.now()) {
    const btn = document.createElement("div");
    btn.className = "draggable";
    btn.innerText = label;
    btn.dataset.type = type;
    btn.dataset.id = id;
    btn.style.left = x;
    btn.style.top = y;
    btn.style.position = "absolute";
    btn.style.cursor = isEditMode ? "move" : "default";

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.innerText = "✖";
    closeBtn.style.display = isEditMode ? "block" : "none";
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      btn.remove();
    };
  // เพิ่มบรรทัดนี้เพื่อหยุด propagation ของ mousedown และ touchstart
  closeBtn.addEventListener("mousedown", e => e.stopPropagation());
  closeBtn.addEventListener("touchstart", e => e.stopPropagation());
  
    btn.appendChild(closeBtn);
    canvasArea.appendChild(btn);

    enableDrag(btn);
  }

  function enableDrag(elm) {
    let offsetX, offsetY;

    elm.addEventListener("mousedown", dragStart);
    elm.addEventListener("touchstart", dragStart, { passive: false });

    function dragStart(e) {
      if (!isEditMode) return;
      e.preventDefault();

        // ถ้า target คือ closeBtn ให้หยุด ไม่เริ่ม drag
  if (e.target.classList.contains("close-btn")) {
    return;
  }
      const rect = canvasArea.getBoundingClientRect();

      let clientX, clientY;
      if (e.type === "touchstart") {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      offsetX = clientX - elm.offsetLeft;
      offsetY = clientY - elm.offsetTop;

      if (e.type === "touchstart") {
        document.addEventListener("touchmove", dragMove, { passive: false });
        document.addEventListener("touchend", dragEnd);
        document.addEventListener("touchcancel", dragEnd);
      } else {
        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", dragEnd);
      }
    }

   function dragMove(e) {
  if (!isEditMode) return;
  e.preventDefault();

  const rect = canvasArea.getBoundingClientRect();

  let clientX, clientY;
  if (e.type === "touchmove") {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  let newX = clientX - offsetX;
  let newY = clientY - offsetY;

  // ขอบเขต canvas
  if (newX < 0) newX = 0;
  else if (newX + elm.offsetWidth > rect.width) newX = rect.width - elm.offsetWidth;

  if (newY < 0) newY = 0;
  else if (newY + elm.offsetHeight > rect.height) newY = rect.height - elm.offsetHeight;

  // ตรวจสอบการชนกับปุ่มอื่น
  const futureRect = {
    left: newX,
    top: newY,
    right: newX + elm.offsetWidth,
    bottom: newY + elm.offsetHeight,
  };

  const others = Array.from(canvasArea.children).filter(el => el !== elm);
  const isOverlapping = others.some(other => {
    const otherX = parseInt(other.style.left, 10);
    const otherY = parseInt(other.style.top, 10);
    const otherRect = {
      left: otherX,
      top: otherY,
      right: otherX + other.offsetWidth,
      bottom: otherY + other.offsetHeight,
    };
    return !(
      futureRect.right <= otherRect.left ||
      futureRect.left >= otherRect.right ||
      futureRect.bottom <= otherRect.top ||
      futureRect.top >= otherRect.bottom
    );
  });

  if (!isOverlapping) {
    // ไม่ชน → เลื่อนตำแหน่ง และลบขอบแดงถ้ามี
    elm.style.left = newX + "px";
    elm.style.top = newY + "px";
    elm.style.border = "";
  } else {
    // ชน → ไม่เลื่อนตำแหน่ง แต่ไม่บล็อก event อื่นๆ เช่นการกด close ปุ่ม
    // ปรับแค่ border แจ้งเตือน
    elm.style.border = "2px solid red";
  }
}


    function dragEnd(e) {
      if (e.type.startsWith("touch")) {
        document.removeEventListener("touchmove", dragMove);
        document.removeEventListener("touchend", dragEnd);
        document.removeEventListener("touchcancel", dragEnd);
      } else {
        document.removeEventListener("mousemove", dragMove);
        document.removeEventListener("mouseup", dragEnd);
      }
    }
  }

  function loadButtonsFromStorage() {
    const saved = localStorage.getItem("buttons");
    if (saved) {
      const buttons = JSON.parse(saved);
      buttonCount = buttons.length;
      buttons.forEach(({ label, type, x, y, id }) => {
        createDraggableButton(label, type, x, y, id);
      });
    }
  }

  window.onload = loadButtonsFromStorage;