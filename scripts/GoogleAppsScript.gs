/**
 * POSTURE.AI 表單與流量後端
 * 部署為 Google Apps Script Web App，供 Landing Page 呼叫
 *
 * 部署步驟：
 * 1. 擴充功能 → Apps Script，貼上此程式碼並儲存
 * 2. 部署 → 新增部署 → 類型選「網頁應用程式」
 * 3. 執行身份：我；存取權：任何人（否則前端會因 CORS 收不到回應）
 * 4. 部署後複製「網頁應用程式 URL」貼到前端的 VITE_GOOGLE_SCRIPT_URL
 *
 * 若前端「沒反應」：用瀏覽器開該 URL（GET）應看到 {"status":"active",...}；
 * 若 GET 正常但表單送出仍失敗，請看瀏覽器開發者工具 → Network 的該 POST 回應內容
 */

/**
 * 處理 GET 請求 (Health Check)
 * 用瀏覽器開啟 Script 網址可確認後端是否正常運作
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'active', 'message': 'POSTURE.AI Backend is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 處理 POST 請求的主入口
 * 根據 action 參數決定是「紀錄流量」還是「處理報名」
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error('No post data received');
    }

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var action = data.action || 'submit';

    if (action === 'track') {
      return handleTracking(doc, data);
    } else {
      return handleSubmission(doc, data);
    }

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': e.toString(),
        'stack': e.stack ? e.stack.toString() : ''
      }))
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
 * Sheet1 表頭（與目前網頁表單欄位對應）
 * A: 時間, B: 姓名, C: Email, D: 每日桌時數, E: 複合動作卡關, F: 痛點代償, G: 痛點其他, H: 付費意願, I: 來源國家
 */
var SUBMISSION_HEADERS = ['時間', '姓名', 'Email', '每日桌時數', '複合動作卡關', '痛點代償', '痛點其他', '付費意願', '來源國家'];

/**
 * 處理報名表單提交 (寫入 Sheet1)
 * 欄位對應目前 Landing Page：姓名、Email、桌時數、卡關描述、痛點(複選)、痛點其他、付費意願
 */
function handleSubmission(doc, data) {
  var sheet = doc.getSheetByName('Sheet1');
  if (!sheet) {
    sheet = doc.insertSheet('Sheet1');
    sheet.appendRow(SUBMISSION_HEADERS);
  }

  // 若 Sheet1 是空的，先寫入表頭
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SUBMISSION_HEADERS);
  }

  var email = (data.email || '').toString().trim().toLowerCase();
  var lastRow = sheet.getLastRow();
  var emailCol = 3; // C 欄 = Email

  // 只有當已有資料列（至少第 2 行）才檢查 Email 重複，避免 getRange(2,3,1,3) 無效範圍錯誤
  if (lastRow > 1) {
    var emailRange = sheet.getRange(2, emailCol, lastRow, emailCol);
    var emailValues = emailRange.getValues();
    for (var i = 0; i < emailValues.length; i++) {
      if (String(emailValues[i][0]).trim().toLowerCase() === email) {
        return ContentService
          .createTextOutput(JSON.stringify({ 'status': 'error', 'code': 'DUPLICATE_EMAIL', 'message': 'Email already exists' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  var newRow = [
    new Date(),                                    // A: 時間
    data.name || '',                               // B: 姓名
    data.email || '',                              // C: Email
    data.deskHours || '',                          // D: 每日桌時數 (<4, 4-8, 8-12, 12+)
    data.liftsStuck || '',                         // E: 複合動作卡關 (自由文字)
    data.painCompensation || '',                   // F: 痛點代償 (多選合併字串)
    data.painOther || '',                          // G: 痛點其他
    data.paidToFix || '',                          // H: 付費意願 (pt_chiro / massage_programs / youtube_only)
    data.userCountry || 'Unknown'                  // I: 來源國家
  ];

  sheet.appendRow(newRow);

  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'success', 'row': sheet.getLastRow() }))
    .setMimeType(ContentService.MimeType.JSON);
}
