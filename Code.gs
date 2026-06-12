/**
 * Sherry Aerial 2026 Anniversary - The Ultimate Secure & Polished Version
 */

const SHEET_NAMES = {
  LIST: "抽獎名單",
  PRIZES: "獎項設定"
};

// 啟動選單
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📧 系統管理')
    .addItem('一鍵寄送中獎通知信', 'sendVerificationEmails')
    .addToUi();
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    let result;

    if (action === "getEmailList") { result = getEmailList(); }
    else if (action === "verifyAndDraw") { result = verifyAndDraw(params.email, params.code); }
    else if (action === "confirmSelection") { result = confirmSelection(params.email, params.code, params.rank, params.prizeName); }
    
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, msg: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

// 取得名單：只有「已寄信」且「尚未抽獎」的學員才會顯示在網頁選單
function getEmailList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.LIST);
  const data = sheet.getDataRange().getValues();
  const emails = data.slice(1).filter(r => {
    const isSent = r[6] && r[6].toString().trim().toLowerCase() === "yes";
    const notUsed = !r[2] || r[2].toString().trim() === "";
    return isSent && notUsed && r[0];
  }).map(r => r[0].toString().trim());
  return { success: true, emails: [...new Set(emails)] };
}

// 第一階段：驗證並立刻鎖定
function verifyAndDraw(email, code) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const listSheet = ss.getSheetByName(SHEET_NAMES.LIST);
  const listData = listSheet.getDataRange().getValues();
  
  let matchRow = -1;
  for (let i = 1; i < listData.length; i++) {
    if (listData[i][0].toString().trim() === email.trim() && listData[i][1].toString().trim() === code.trim()) {
      if (listData[i][2] === "Yes") return { success: false, msg: "此驗證碼已完成抽取或正在處理中" };
      matchRow = i + 1; break;
    }
  }
  if (matchRow === -1) return { success: false, msg: "驗證碼不正確" };

  const prizeSheet = ss.getSheetByName(SHEET_NAMES.PRIZES);
  const pData = prizeSheet.getDataRange().getValues();
  const finalRank = calculateRank(pData);
  
  listSheet.getRange(matchRow, 3, 1, 3).setValues([[ "Yes", new Date(), finalRank ]]);

  let prizes = pData.slice(1)
    .filter(row => {
      const isRank = row[0].toString().trim() === finalRank;
      const stock = parseFloat(row[5]); 
      return isRank && stock > 0; 
    })
    .map(row => row[2].toString().trim());

  if (prizes.length === 0) return { success: false, msg: `RANK ${finalRank} 的所有獎項皆已領取完畢！` };

  return { success: true, rank: finalRank, prizes: prizes };
}

// 第二階段：更新獎項名稱與扣庫存
function confirmSelection(email, code, rank, prizeName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const listSheet = ss.getSheetByName(SHEET_NAMES.LIST);
  const listData = listSheet.getDataRange().getValues();
  for (let i = 1; i < listData.length; i++) {
    if (listData[i][0].toString().trim() === email.trim() && listData[i][1].toString().trim() === code.trim()) {
      listSheet.getRange(i + 1, 6).setValue(prizeName); 
      break;
    }
  }

  const prizeSheet = ss.getSheetByName(SHEET_NAMES.PRIZES);
  const pData = prizeSheet.getDataRange().getValues();
  for (let j = 1; j < pData.length; j++) {
    if (pData[j][0].toString().trim() === rank && pData[j][2].toString().trim() === prizeName) {
      let currentClaimed = parseFloat(pData[j][4]) || 0;
      prizeSheet.getRange(j + 1, 5).setValue(currentClaimed + 1);
      break;
    }
  }
  return { success: true };
}

function calculateRank(pData) {
  const rand = Math.random();
  let cum = 0;
  const ranks = [];
  const seen = new Set();
  pData.slice(1).forEach(r => {
    let rName = r[0].toString().trim();
    if(!seen.has(rName) && rName) {
      ranks.push({n: rName, p: parseFloat(r[1]) || 0});
      seen.add(rName);
    }
  });
  for (let r of ranks) { cum += r.p; if (rand <= cum) return r.n; }
  return ranks[ranks.length-1].n;
}

// 一鍵寄信功能
function sendVerificationEmails() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const listSheet = ss.getSheetByName(SHEET_NAMES.LIST);
  const data = listSheet.getDataRange().getValues();
  const today = new Date();
  const formattedDate = Utilities.formatDate(today, "GMT+8", "yyyy-MM-dd HH:mm");
  const webUrl = "https://sherryaerial-web.github.io/2026-anniversary/";
  
  let count = 0;

  for (let i = 1; i < data.length; i++) {
    const email = data[i][0];
    const code = data[i][1];
    const isUsed = data[i][2];
    const isSentFlag = data[i][6];
    const sentDate = data[i][7];
    
    if (email && code && 
        isSentFlag.toString().trim().toLowerCase() === "yes" && 
        (!isUsed || isUsed.toString().trim() === "") && 
        (!sentDate || sentDate.toString().trim() === "")) {
        
      try {
        MailApp.sendEmail({
          to: email,
          subject: "【Sherry Aerial Studio】您的週年慶抽獎驗證碼通知",
          htmlBody: `
            <div style="font-family: 'Microsoft JhengHei', sans-serif; color: #333; line-height: 1.8; max-width: 550px; margin: auto; border: 1px solid #e5e4e2; padding: 40px; border-radius: 25px; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #2d2d2d; margin-bottom: 5px; font-weight: 500;">親愛的學員您好</h2>
                <div style="width: 50px; height: 2px; background: #b8b8b8; margin: auto;"></div>
              </div>
              <p>感謝您對 <b>Sherry Aerial Studio</b> 的支持！<br>
              為了慶祝 2026 週年慶，這是為您準備的專屬抽獎驗證碼：</p>
              <div style="background: #fdfbfb; border: 1px dashed #b8b8b8; padding: 25px; text-align: center; margin: 30px 0; border-radius: 15px;">
                <p style="margin: 0 0 10px 0; color: #888; font-size: 14px; letter-spacing: 2px;">YOUR CODE</p>
                <span style="font-size: 32px; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 6px; color: #2d2d2d;">${code}</span>
              </div>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${webUrl}" style="background-color: #2d2d2d; color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; letter-spacing: 2px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">點此前往抽獎網頁</a>
              </div>
              <p style="font-size: 14px; color: #666;"><b>抽獎小提醒：</b><br>
              1. 進入網頁後，請於選單選擇您的 Email。<br>
              2. 輸入上方驗證碼即可開始抽獎。<br>
              3. <span style="color: #d9534f;">驗證碼僅限使用一次，送出後即無法更改獎項。</span></p>
              <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; text-align: center;">
                Sherry Aerial Studio © 2026
              </div>
            </div>
          `
        });
        listSheet.getRange(i + 1, 8).setValue(formattedDate); 
        count++;
      } catch (err) {
        console.log("發送信件失敗: " + email);
      }
    }
  }
  SpreadsheetApp.getUi().alert('✨ 任務完成！共寄出 ' + count + ' 封信件。');
}
