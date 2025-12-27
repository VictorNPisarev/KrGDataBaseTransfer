class SyncLogger 
{
  constructor() 
  {
    this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    this.logSheetName = 'SyncLogs';
    this.logSheet = this.getOrCreateLogSheet();
  }
  
  getOrCreateLogSheet() 
  {
    let sheet = this.spreadsheet.getSheetByName(this.logSheetName);
    if (!sheet) {
      sheet = this.spreadsheet.insertSheet(this.logSheetName);
      // Создаем заголовки
      const headers = 
      [
        'Дата и время',
        'Тип операции',
        'Таблица',
        'Кол-во записей',
        'Статус',
        'Время выполнения (мс)',
        'Доп. информация'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    return sheet;
  }
  
  logSyncResult(results, executionTime) 
  {
    const timestamp = new Date();
    
    // Логируем общую информацию о синхронизации
    this.logSheet.appendRow([
      timestamp,
      'Полная синхронизация',
      'Все таблицы',
      this.getTotalRecords(results),
      'Успешно',
      executionTime,
      `Синхронизировано таблиц: ${Object.keys(results.tables).length}`
    ]);
    
    // Логируем детали по каждой таблице
    for (const [tableName, tableStats] of Object.entries(results.tables)) 
    {
      this.logSheet.appendRow([
        timestamp,
        'Детализация',
        tableName,
        tableStats.records || 0,
        tableStats.written ? 'Записано' : 'Пропущено',
        '',
        `Записано: ${tableStats.written ? 'Да' : 'Нет'}`
      ]);
    }
    
    this.autoResizeColumns();
  }
  
  logError(error, context = '') 
  {
    const timestamp = new Date();
    this.logSheet.appendRow([
      timestamp,
      'Ошибка',
      context,
      0,
      'Ошибка',
      0,
      error.toString()
    ]);
  }
  
  getTotalRecords(results) 
  {
    let total = 0;
    if (results.tables) 
    {
        for (const tableStats of Object.values(results.tables)) 
        {
            total += tableStats.records || 0;
        }
    }
    return total;
  }
  
  autoResizeColumns() 
  {
    const lastColumn = this.logSheet.getLastColumn();
    for (let i = 1; i <= lastColumn; i++) 
    {
      this.logSheet.autoResizeColumn(i);
    }
  }
  
  getLastSyncInfo() 
  {
    const lastRow = this.logSheet.getLastRow();
    if (lastRow <= 1) return null;
    
    const lastLog = this.logSheet.getRange(lastRow, 1, 1, 7).getValues()[0];
    return {
      timestamp: lastLog[0],
      type: lastLog[1],
      table: lastLog[2],
      records: lastLog[3],
      status: lastLog[4],
      executionTime: lastLog[5],
      info: lastLog[6]
    };
  }
}

// Экспорт для использования в других файлах
const logger = new SyncLogger();