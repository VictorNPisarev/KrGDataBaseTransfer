class GoogleSheetsService
{
  constructor(spreadsheetId = null) 
  {
    this.spreadsheet = spreadsheetId 
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();
  }

  /**
   * Получить лист по имени (создает, если не существует)
   */
  getSheet(sheetName, createIfMissing = true) {
    let sheet = this.spreadsheet.getSheetByName(sheetName);
    
    if (!sheet && createIfMissing) {
      sheet = this.spreadsheet.insertSheet(sheetName);
      console.log(`✅ Создан новый лист: ${sheetName}`);
    } else if (!sheet) {
      throw new Error(`Лист "${sheetName}" не найден`);
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

  /**
   * Очистить лист
   */
  clearSheet(sheetName) {
    try {
      const sheet = this.getSheet(sheetName, false);
      sheet.clear();
      console.log(`🧹 Лист "${sheetName}" очищен`);
      return { success: true };
    } catch (error) {
      console.warn(`⚠️ Не удалось очистить лист "${sheetName}":`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Записать данные в буферный лист (для отладки)
   */
  writeToBuffer(sheetName, data, description = '') {
    const timestamp = new Date().toLocaleString('ru-RU');
    const headers = ['Время', 'Описание', 'Данные'];
    const rows = [[timestamp, description, JSON.stringify(data)]];
    
    return this.writeSheet(sheetName, headers, rows, {
      clearSheet: false,
      startRow: this.getSheet(sheetName, false).getLastRow() + 1
    });
  }

    /**
   * Основной метод: записать данные в лист
   * @param {string} sheetName - Название листа
   * @param {Array} headers - Массив заголовков
   * @param {Array} dataRows - Массив строк данных
   * @param {Object} options - Дополнительные опции
   */
  writeSheet(sheetName, headers = [], dataRows = [], options = {}) {
    try {
      console.log(`📝 Запись в лист "${sheetName}": ${dataRows.length} строк`);
      
      const sheet = this.getSheet(sheetName, options.createSheet !== false);
      
      // Очищаем лист, если нужно
      if (options.clearSheet !== false) {
        sheet.clear();
        console.log(`🧹 Лист "${sheetName}" очищен`);
      }
      
      const allRows = [];
      
      // Добавляем заголовки, если они есть
      if (headers && headers.length > 0) {
        allRows.push(headers);
        console.log(`📋 Заголовки: ${headers.join(', ')}`);
      }
      
      // Добавляем данные
      if (dataRows && dataRows.length > 0) {
        allRows.push(...dataRows);
      }
      
      // Записываем все данные разом
      if (allRows.length > 0) {
        const startRow = options.startRow || 1;
        const startColumn = options.startColumn || 1;
        
        const range = sheet.getRange(
          startRow, 
          startColumn, 
          allRows.length, 
          allRows[0].length
        );
        
        range.setValues(allRows);
        console.log(`✅ Записано ${allRows.length} строк в ${sheetName}`);
        
        // Форматирование заголовков
        if (headers && headers.length > 0 && options.formatHeaders !== false) {
          const headerRange = sheet.getRange(1, 1, 1, headers.length);
          headerRange.setFontWeight('bold');
          headerRange.setBackground('#f0f0f0');
        }
        
        // Автонастройка ширины столбцов
        if (options.autoResizeColumns !== false) {
          sheet.autoResizeColumns(1, headers.length || dataRows[0]?.length || 1);
        }
        
        return {
          success: true,
          sheetName: sheetName,
          rowsWritten: allRows.length,
          range: range.getA1Notation()
        };
      } else {
        console.log(`📭 Нет данных для записи в "${sheetName}"`);
        return { success: true, note: 'Нет данных для записи' };
      }
      
    } catch (error) {
      console.error(`❌ Ошибка записи в лист "${sheetName}":`, error);
      throw error;
    }
  }

  /**
   * Записать массив объектов в лист (автоматически определяет заголовки)
   */
  writeObjects(sheetName, objects = [], options = {}) {
    if (!objects || objects.length === 0) {
      return this.writeSheet(sheetName, [], [], options);
    }
    
    // Определяем заголовки из ключей первого объекта
    const headers = Object.keys(objects[0]);
    
    // Преобразуем объекты в строки
    const rows = objects.map(obj => 
      headers.map(header => obj[header] !== undefined ? obj[header] : '')
    );
    
    return this.writeSheet(sheetName, headers, rows, options);
  }

  /**
   * Получить данные из листа в виде массива объектов
   */
  readSheet(sheetName, hasHeaders = true) {
    try {
      const sheet = this.getSheet(sheetName, false);
      const data = sheet.getDataRange().getValues();
      
      if (data.length === 0) {
        return [];
      }
      
      if (!hasHeaders) {
        return data;
      }
      
      // Преобразуем в массив объектов
      const headers = data[0];
      const rows = data.slice(1);
      
      return rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] !== undefined ? row[index] : null;
        });
        return obj;
      });
      
    } catch (error) {
      console.error(`❌ Ошибка чтения листа "${sheetName}":`, error);
      throw error;
    }
  }

  /**
   * Записать данные в буферный лист (для отладки)
   */
  writeToBuffer(sheetName, data, description = '') {
    const timestamp = new Date().toLocaleString('ru-RU');
    const headers = ['Время', 'Описание', 'Данные'];
    const rows = [[timestamp, description, JSON.stringify(data)]];
    
    return this.writeSheet(sheetName, headers, rows, {
      clearSheet: false,
      startRow: this.getSheet(sheetName, false).getLastRow() + 1
    });
  }

}