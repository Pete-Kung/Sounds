// var API_SERVER = "http://192.168.1.99:8080";
var API_SERVER = "http://172.20.10.3:8080";

var token = localStorage.getItem("token");
function GetToken() {
  console.log("test");
  $.ajax({
    type: "GET",
    url: API_SERVER + "/v1/auth/get-token",
    headers: {
      // ถ้า API ไม่ต้องใช้ Authorization ตอนเรียก ก็ไม่ต้องใส่
      // Authorization: "Bearer " + token,
    },
    dataType: "json",
    async: true,
    timeout: 10000, // ปรับเวลาได้ตามต้องการ
    success: function (data) {
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
if (token == null) {
  GetToken();
}
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

function getDataAnalyze() {
  const element = document.getElementById("show_ai_analyze");
  element.style.display = "flex";


  $.ajax({
    type: "POST",
    url: API_SERVER + "/v1/mixer-logs/analyze",

    contentType: "application/json",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      console.log("Data analyze:", response.data);
      document.getElementById("ai_analyze_data").innerHTML = response.data;

      setTimeout(() => {
        element.style.display = "none";
      }, 3000);
    },
    error: function (error) {
      console.error("Error sending mixer event:", error);
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
