const SPREADSHEET_ID = '1TM6vfUlREHWP5Q6Yrd6XJm3X0R-TdXK62Kp-EUGIB8g';
const SHEET_ID = 773278743;
const SHEET_NAME = 'การตอบแบบฟอร์ม 2';

function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getTargetSheet_(spreadsheet);

    if (!sheet) {
      throw new Error('ไม่พบชีตสำหรับ Tast_5');
    }

    const values = sheet.getDataRange().getDisplayValues();
    const headers = values.shift().map((header, index) => {
      const label = String(header || '').trim();
      return label || `Column ${index + 1}`;
    });

    const rows = values
      .filter(row => row.some(cell => String(cell || '').trim() !== ''))
      .map(row => headers.reduce((item, header, index) => {
        item[header] = row[index] || '';
        return item;
      }, {}));

    return output_({
      status: 'success',
      ok: true,
      data: rows,
      updatedAt: new Date().toISOString()
    }, e);
  } catch (error) {
    return output_({
      status: 'error',
      ok: false,
      message: error.message
    }, e);
  }
}

function getTargetSheet_(spreadsheet) {
  const namedSheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (namedSheet) {
    return namedSheet;
  }

  return spreadsheet.getSheets().find(sheet => sheet.getSheetId() === SHEET_ID);
}

function output_(payload, e) {
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
