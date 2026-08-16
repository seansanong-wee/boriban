const SPREADSHEET_ID = '1SoeaQfnbN4iH5GYOuro1gHL4wXeubl1WMmkMPq6Cu2s';
const SHEET_ID = 764823269;
const SHEET_NAME = 'การตอบแบบฟอร์ม 2';

function doGet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getTargetSheet_(spreadsheet);

    if (!sheet) {
      throw new Error('ไม่พบชีตสำหรับ Tast_4');
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

    return json_({
      status: 'success',
      data: rows,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    return json_({
      status: 'error',
      message: error.message
    });
  }
}

function getTargetSheet_(spreadsheet) {
  const namedSheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (namedSheet) {
    return namedSheet;
  }

  return spreadsheet.getSheets().find(sheet => sheet.getSheetId() === SHEET_ID);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
