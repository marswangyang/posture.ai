/**
 * 處理 GET 請求 (新增功能)
 * 用途：讓您可以直接用瀏覽器開啟 Script 網址，確認後端是否正常運作 (Health Check)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'active', 'message': 'STATUS_CODE Backend is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 處理 POST 請求的主入口
 * 根據 action 參數決定是「紀錄流量」還是「處理報名」
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // 等待最多 10 秒

  try {
    // 1. 安全檢查：確認有收到資料
    if (!e.postData || !e.postData.contents) {
      throw new Error('No post data received');
    }

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var action = data.action || 'submit'; // 預設為 submit 以相容舊版

    // 2. 路由分流
    if (action === 'track') {
      return handleTracking(doc, data);
    } else {
      return handleSubmission(doc, data);
    }

  } catch (e) {
    // 錯誤處理：回傳 JSON 格式的錯誤訊息，讓前端可以顯示
    return ContentService
      .createTextOutput(JSON.stringify({ 'status': 'error', 'message': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * 處理網站流量紀錄 (寫入 Traffic 工作表)
 */
function handleTracking(doc, data) {
  var sheet = doc.getSheetByName('Traffic');
  // 如果 Traffic 工作表不存在，則創建並加上標題
  if (!sheet) {
    sheet = doc.insertSheet('Traffic');
    sheet.appendRow(['時間', 'IP', '城市', '國家', '裝置/瀏覽器', '來源(Referrer)', '螢幕寬度']);
  }

  var newRow = [
    new Date(),
    data.ip || 'Unknown',
    data.city || 'Unknown',
    data.country || 'Unknown',
    data.userAgent || 'Unknown',
    data.referrer || 'Direct/None',
    data.screenWidth || 'Unknown'
  ];

  sheet.appendRow(newRow);

  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'success', 'type': 'track' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 處理報名表單提交 (寫入 Sheet1 工作表)
 * 欄位對應 App.jsx 表單：name, email, deskHours, liftsStuck, painCompensation, painOther, paidToFix
 */
function handleSubmission(doc, data) {
  var sheet = doc.getSheetByName('Sheet1');
  if (!sheet) {
    sheet = doc.insertSheet('Sheet1');
  }

  // 若為新工作表，寫入標題列
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow([
      '提交時間',
      '姓名',
      'Email',
      '每日久坐時數',
      '複合動作與卡關',
      '痛點/代償',
      '痛點其他',
      '付費意願',
      '提交時間(ISO)',
      '來源國家'
    ]);
    lastRow = 1;
  }

  // 檢查 Email 重複 (Email 在第 3 欄 C)
  var email = data.email;
  if (lastRow >= 1) {
    var emailRange = sheet.getRange('C2:C' + lastRow);
    var emailList = emailRange.getValues().map(function(row) { return row[0]; });
    if (emailList.indexOf(email) !== -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ 'status': 'error', 'code': 'DUPLICATE_EMAIL', 'message': 'Email already exists' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // 寫入報名資料 (欄位順序與 App.jsx payload 一致)
  var newRow = [
    new Date(),                              // A: 提交時間
    data.name || '',                          // B: 姓名
    data.email || '',                         // C: Email
    data.deskHours || '',                     // D: 每日久坐時數
    data.liftsStuck || '',                    // E: 複合動作與卡關
    data.painCompensation || '',              // F: 痛點/代償 (已為字串)
    data.painOther || '',                     // G: 痛點其他
    data.paidToFix || '',                     // H: 付費意願
    data.submittedAt || '',                   // I: 提交時間(ISO)
    data.userCountry || 'Unknown'             // J: 來源國家
  ];

  sheet.appendRow(newRow);

  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'success', 'row': sheet.getLastRow() }))
    .setMimeType(ContentService.MimeType.JSON);
}
