const TAST3_SPREADSHEET_ID = '1vmT6QXgNz7o0Bc3w_uKDy1Smr9L51E_j62mZ2p-b7fo';
const TAST3_SHEET_ID = 1394538477;
const TAST3_SHEET_NAME = 'การตอบแบบฟอร์ม 2';

function doGet(e) {
  try {
    const payload = {
      status: 'success',
      ok: true,
      data: getTast3ScoreRows_(),
      updatedAt: new Date().toISOString()
    };

    return outputTast3_(payload, e);
  } catch (error) {
    return outputTast3_({
      status: 'error',
      ok: false,
      message: error.message
    }, e);
  }
}

function getTast3ScoreRows_() {
  const spreadsheet = SpreadsheetApp.openById(TAST3_SPREADSHEET_ID);
  const sheet = getTast3TargetSheet_(spreadsheet);

  if (!sheet) {
    throw new Error('ไม่พบแท็บข้อมูลสำหรับ Tast_3');
  }

  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) {
    return [];
  }

  const headers = values.shift().map((header, index) => {
    const label = String(header || '').trim();
    return label || `Column ${index + 1}`;
  });

  return values
    .filter(row => row.some(cell => String(cell || '').trim() !== ''))
    .map(row => headers.reduce((item, header, index) => {
      item[header] = row[index] || '';
      return item;
    }, {}));
}

function getTast3TargetSheet_(spreadsheet) {
  const namedSheet = spreadsheet.getSheetByName(TAST3_SHEET_NAME);

  if (namedSheet) {
    return namedSheet;
  }

  return spreadsheet.getSheets().find(sheet => sheet.getSheetId() === TAST3_SHEET_ID);
}

function outputTast3_(payload, e) {
  const json = JSON.stringify(payload);
  const callback = e && e.parameter ? String(e.parameter.callback || '').trim() : '';

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}