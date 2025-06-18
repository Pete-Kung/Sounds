

var API_SERVER = "http://192.168.1.29:8080";
var AI_DATA = localStorage.getItem("ai_analyze_data");
const element = document.getElementById("show_ai_analyze");
const textAI = document.getElementById("ai_analyze_data_text");
const wait = document.getElementById("ai_analyze_data");
var token = localStorage.getItem("token");



function displayAnalysisResult(AI_DATA, textAI) {
  if (!AI_DATA) {
    textAI.style.display = "none"; // แสดงผลเพื่อให้เห็นข้อความ "No data"
  } else {
    // ถ้ามีข้อมูล
    textAI.style.display = "block";
    const formattedHtml = formatAIResponse(AI_DATA);
    // 2. นำ HTML ที่ได้ไปใส่ใน innerHTML ของ element เป้าหมาย
    textAI.innerHTML = formattedHtml;
  }
}
function GetToken() {
  console.log("test");
  $.ajax({
    type: "GET",
    url: API_SERVER + "/v1/auth/get-token",
    headers: {
    },
    dataType: "json",
    async: true,
    timeout: 10000, // ปรับเวลาได้ตามต้องการ
    success: function (data) {
      console.log(data, "token");

      if (data) {
        var token = data.data.accessToken; // หรือ key ตาม response จริง เช่น data.data.token
        console.log("Token ที่ได้:", token);
        localStorage.setItem("token", token);
        // ถ้าต้องเอา token ไปใช้ต่อก็จัดการตรงนี้ได้เลย เช่น เก็บไว้ หรือยิง API ถัดไป
      } else {
        // msgPageObj.show(NSLang("sys.serverError"));
      }
    },
    error: function (error) {
      if (error.status == 401) {
        //msgPageObj.show(NSLang("sys.authent"));
      } else if (error.status == 417) {
        // msgPageObj.show(getStatusCode(error.responseJSON.error));
      } else {
        //msgPageObj.show(NSLang("sys.serverError"));
      }
    },
  });
}
document.addEventListener('DOMContentLoaded', function () {
  if (token == null) {
    GetToken();
  } else {
    displayAnalysisResult(AI_DATA, textAI);

  }
});
function Collect_Data(DATA) {
  // ตรวจสอบว่าข้อมูลต้องใช้ eventType (camelCase) หรือไม่ แล้วแปลงชื่อ key ถ้าจำเป็น
  const mData = {
    ...DATA,
    eventType: DATA.eventType, // รองรับทั้งสองแบบ
  };

  console.log(mData, "mData");
  $.ajax({
    type: "POST",
    url: API_SERVER + "/v1/mixer-logs/event",
    data: JSON.stringify(mData),
    contentType: "application/json",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      console.log("Event logged successfully:", response);
    },
    error: function (error) {
      console.error("Error sending mixer event:", error);
    },
  });
}

function getDataAnalyze(el) {
  var token = localStorage.getItem("token");
  setVolumeAI("padC" , "test", 100);
  // หากถูก disable อยู่แล้ว อย่าให้ส่งซ้ำ
  if (el.disabled) return;
  // ตั้งให้ปุ่ม disable
  el.disabled = true;
  el.style.opacity = "0.5";
  el.style.cursor = "not-allowed";
  //element.style.display = "flex";
  textAI.style.display = "none";
  wait.style.display = "flex  ";
  $.ajax({
    type: "POST",
    url: API_SERVER + "/v1/mixer-logs/analyze",
    contentType: "application/json",
    dataType: "json",
    headers: { Authorization: "Bearer " + token },
    success: function (response) {
      console.log("Data analyze:", response.data);
      wait.style.display = "none";

      textAI.style.display = "block";
      // textAI.innerHTML = response.data;
      displayAnalysisResult(response.data, textAI);
      localStorage.setItem("ai_analyze_data", response.data);
      setTimeout(() => {
        element.style.display = "none";
      }, 10000);
    },
    error: function (error) {
      wait.style.display = "none";
      console.error("Error sending mixer event:", error);
      textAI.style.display = "block";
      textAI.innerHTML = "Error occurred while analyzing data.";
    },
    complete: function () {
      // ไม่ว่า success หรื error จะกลับมา enable
      el.disabled = false;
      el.style.opacity = "1";
      el.style.cursor = "pointer";
    },
  });
}

function getSounds(style, callback) {
  $.ajax({
    type: "GET",
    url: API_SERVER + "/v1/api/sounds/" + style,
    contentType: "application/json",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      console.log("Data sound:", response.data);
      if (callback) {
        callback(response.data); // เรียก callback พร้อมส่งข้อมูล
      }
    },
    error: function (error) {
      console.error("Error sending mixer event:", error);
      if (callback) {
        callback(null, error); // ส่ง error กลับด้วยถ้าต้องการ
      }
    },
  });
}

function formatAIResponse(rawText) {
  // 2. ทำความสะอาดข้อมูลเบื้องต้น
  // แทนที่ placeholder แปลกๆ ด้วยข้อความที่อ่านง่าย
  let cleanedText = rawText.replace(/##\d+\$\$ ##\d+\$\$/g, 'ประมาณ 4 นาที 20 วินาที');

  // 3. แยกข้อความเป็นบรรทัด และตัดช่องว่างที่ไม่จำเป็นออก
  const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  let htmlOutput = '';
  let inList = false; // ตัวแปรเพื่อเช็คว่าตอนนี้กำลังอยู่ใน list หรือไม่

  // 4. วนลูปทีละบรรทัดเพื่อสร้าง HTML
  for (const line of lines) {
    // ตรวจจับหัวข้อ (ขึ้นต้นและลงท้ายด้วย **)
    if (line.startsWith('**') && line.endsWith('**')) {
      if (inList) {
        htmlOutput += '</ol>\n'; // ปิด list เก่าก่อนเริ่มหัวข้อใหม่
        inList = false;
      }
      const title = line.substring(2, line.length - 2);
      htmlOutput += `<h3>${title}</h3>\n`;
    }
    // ตรวจจับรายการ (ขึ้นต้นด้วยตัวเลข. เช่น 1. 2.)
    else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        htmlOutput += '<ol>\n'; // เปิด list ใหม่ถ้ายังไม่เคยเปิด
        inList = true;
      }
      const listItem = line.substring(line.indexOf('.') + 1).trim();
      htmlOutput += `<li>${listItem}</li>\n`;
    }
    // ถ้าเป็นบรรทัดอื่นๆ ที่ไม่ใช่หัวข้อหรือรายการ
    else {
      if (inList) {
        htmlOutput += '</ol>\n'; // ปิด list เก่าก่อนเริ่ม paragraph ใหม่
        inList = false;
      }
      htmlOutput += `<p>${line}</p>\n`;
    }
  }

  // 5. หากจบ loop แล้วยังอยู่ใน list ให้ปิด tag ให้เรียบร้อย
  if (inList) {
    htmlOutput += '</ol>\n';
  }

  return htmlOutput;
}

