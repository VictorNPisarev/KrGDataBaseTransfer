class GoogleSheetsService
{
  constructor(spreadsheetId = null) 
  {
    this.spreadsheet = spreadsheetId 
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();
  }

  getSheet(name) 
  {
    const sheet = this.spreadsheet.getSheetByName(name);
    if (!sheet) 
    {
      throw new Error(`Sheet "${name}" not found`);
    }
    return sheet;
  }

  writeData(sheetName, data, startRow = 1, startCol = 1) 
  {
    const sheet = this.getSheet(sheetName);
    
    if (data.length === 0) 
    {
      sheet.clear();
      return;
    }

    const range = sheet.getRange
    (
      startRow, 
      startCol, 
      data.length, 
      data[0].length
    );
    range.setValues(data);
  }

  clearSheet(sheetName) 
  {
    this.getSheet(sheetName).clear();
  }

  getLastRowData(sheetName) 
  {
    const sheet = this.getSheet(sheetName);
    const lastRow = sheet.getLastRow();
    
    if (lastRow < 2) return null;
    
    return {
      from: sheet.getRange(lastRow, 1).getValue(),
      to: sheet.getRange(lastRow, 2).getValue()
    };
  }
}