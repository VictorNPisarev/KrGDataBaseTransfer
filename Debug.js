// Запустите эту функцию в редакторе GAS
function debugAppSheetALL() {
  console.log("🧪 Тестирование подключения к AppSheet...");
  
  // 1. Проверим настройки
  const { APPSHEET_APP_ID, APPSHEET_API_KEY, APPSHEET_TABLE_NAME } = Constants.SCRIPT_PROPERTIES;
  
  console.log("📋 Конфигурация:");
  console.log("- App ID:", APPSHEET_APP_ID);
  console.log("- API Key:", APPSHEET_API_KEY ? "***установлен***" : "НЕТ");
  console.log("- Table Name:", APPSHEET_TABLE_NAME);
  
  // 2. Создаем тестовый запрос БЕЗ фильтров
  const url = `https://api.appsheet.com/api/v2/apps/${APPSHEET_APP_ID}/tables/${APPSHEET_TABLE_NAME}/Action`;
  
  const payload = {
    "Action": "Find",
    "Properties": {
      "Locale": "ru-RU"
    },
    "Rows": []  // БЕЗ фильтров - получим ВСЕ записи
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ApplicationAccessKey': APPSHEET_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  console.log("🌐 URL запроса:", url);
  console.log("📦 Payload:", JSON.stringify(payload, null, 2));
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log("📥 Ответ:");
    console.log("- Status Code:", responseCode);
    console.log("- Response Length:", responseText.length);
    console.log("- Response:", responseText);
    
    if (responseCode === 200 && responseText.trim() !== '') {
      try {
        const data = JSON.parse(responseText);
        console.log(`✅ Данные получены: ${data.length} записей`);
        
        if (data.length > 0) {
          console.log("📊 Пример первой записи:", JSON.stringify(data[0], null, 2));
          
          // Проверим, какие поля есть в данных
          console.log("🔑 Ключи первой записи:", Object.keys(data[0]));
        }
        
      } catch (e) {
        console.error("❌ Ошибка парсинга JSON:", e);
      }
    } else if (responseCode === 200 && responseText.trim() === '') {
      console.log("⚠️ Таблица существует, но ПУСТАЯ (нет записей)");
    }
    
  } catch (error) {
    console.error("🔥 Ошибка запроса:", error);
  }
}

// Debug.gs - тестирование AppSheet API без изменений в основном коде

function debugAppSheet() {
  console.log("🔍 ДИАГНОСТИКА APP SHEET API");
  console.log("=============================");
  
  // 1. Получаем настройки
  const props = PropertiesService.getScriptProperties();
  const appId = props.getProperty('APPSHEET_APP_ID');
  const apiKey = props.getProperty('APPSHEET_API_KEY');
  const tableName = props.getProperty('APPSHEET_MAIN_TABLE_NAME');
  
  console.log("📋 Конфигурация:");
  console.log("- App ID:", appId);
  console.log("- API Key:", apiKey ? "***установлен***" : "НЕТ");
  console.log("- Table:", tableName);
  
  if (!appId || !apiKey || !tableName) {
    console.error("❌ Не хватает настроек. Установите свойства скрипта.");
    return;
  }
  
  // 2. Тест 1: Запрос БЕЗ фильтра (все записи)
  console.log("\n🧪 ТЕСТ 1: Запрос без фильтра");
  testApiRequest(appId, apiKey, tableName, null);
  
  // 3. Тест 2: Запрос с фильтром по датам (как в реальном скрипте)
  console.log("\n🧪 ТЕСТ 2: Запрос с фильтром по датам");
  
  // Используем период из DateFilter или тестовый
  let startDate, endDate;

  try 
  {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DateFilter');
    if (sheet && sheet.getLastRow() >= 2) 
    {
      const lastRow = sheet.getLastRow();
      const startCell = sheet.getRange(lastRow, 1).getValue();
      const endCell = sheet.getRange(lastRow, 2).getValue();
      
      if (startCell && endCell) 
      {
        startDate = new Date(startCell);
        endDate = new Date(endCell);
      }
    }
  } 
  catch (e) 
  {
    console.log('Не удалось прочитать DateFilter:', e.message);
  }

  // Если не удалось получить даты из таблицы, используем тестовые
  if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) 
  {
    console.log('⚠️ Использую тестовый период (даты из таблицы невалидны или отсутствуют)');
    startDate = new Date(2025, 9, 24); // 1 декабря 2025
    endDate = new Date(2025, 11, 24); // 31 декабря 2025
  }

  console.log(`- Период: ${startDate.toLocaleDateString('ru-RU')} - ${endDate.toLocaleDateString('ru-RU')}`);
  console.log(`- Формат для AppSheet: ${formatDate(startDate)} - ${formatDate(endDate)}`);
  
  testApiRequest(appId, apiKey, tableName, formatDate(startDate), formatDate(endDate));
}

function testApiRequest(appId, apiKey, tableName, formattedStart, formattedEnd) {
  const url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;
  
  const payload = {
    "Action": "Find",
    "Properties": {
      "Locale": "ru-RU",
      "Selector": "Select(" + tableName + "[Row ID], [Готовность] = '"+ formattedStart + "')"
    },
    "Rows": []
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ApplicationAccessKey': apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  console.log("🌐 URL:", url);
  console.log("📦 Payload:", JSON.stringify(payload, null, 2));
  
  try {
    const startTime = Date.now();
    const response = UrlFetchApp.fetch(url, options);
    const responseTime = Date.now() - startTime;
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log("📥 Ответ:");
    console.log("- Status Code:", responseCode);
    console.log("- Время ответа:", responseTime + "мс");
    console.log("- Длина ответа:", responseText.length + " байт");
    console.log("- Первые 500 символов:", responseText.substring(0, 2500));
    
    if (responseCode === 200) {
      // Проверяем, валиден ли JSON
      try {
        const data = JSON.parse(responseText);
        console.log(`✅ JSON валиден, записей: ${data.length}`);
        
        // Проверяем, обрывается ли последняя запись
        if (data.length > 0) {
          const lastRecord = data[data.length - 1];
          const lastRecordJson = JSON.stringify(lastRecord);
          console.log("- Последняя запись целиком?:", lastRecordJson.length < 500 ? lastRecordJson : "слишком длинная");
          
          // Проверяем целостность JSON
          const isComplete = responseText.trim().endsWith("}]");
          console.log("- Ответ заканчивается на '}]'?:", isComplete);
          
          if (!isComplete) {
            console.warn("⚠️ Возможен обрыв ответа!");
            // Находим, где обрывается
            const lastBracket = responseText.lastIndexOf("}]");
            if (lastBracket === -1) {
              console.warn("⚠️ Вообще нет закрывающих скобок!");
            } else {
              const truncated = responseText.substring(lastBracket);
              console.warn(`⚠️ Обрыв после позиции ${lastBracket}`);
            }
          }
        }
      } catch (e) {
        console.error("❌ Невалидный JSON:", e.message);
        
        // Пытаемся найти, где обрыв
        console.log("🔍 Анализ обрыва JSON...");
        analyzeJsonBreak(responseText);
      }
    } else {
      console.error("❌ HTTP ошибка:", responseText);
    }
    
  } catch (error) {
    console.error("🔥 Исключение:", error);
  }
}

function testApiRequestWithSelect(appId, apiKey, tableName) {
  const url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;
  
  // Запрашиваем только ключевые поля
  const payload = {
    "Action": "Find",
    "Properties": {
      "Locale": "ru-RU",
      "Select": ["_RowNumber", "Номер заказа", "Дата готовности", "Окна, шт", "Окна, м2", "Щитовые, шт", "Щитовые, м2"]
    },
    "Rows": []
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ApplicationAccessKey': apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const startTime = Date.now();
    const response = UrlFetchApp.fetch(url, options);
    const responseTime = Date.now() - startTime;
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log("📥 Ответ (только выбранные поля):");
    console.log("- Status Code:", responseCode);
    console.log("- Время ответа:", responseTime + "мс");
    console.log("- Длина ответа:", responseText.length + " байт");
    
    if (responseCode === 200) {
      try {
        const data = JSON.parse(responseText);
        console.log(`✅ Записей: ${data.length}, Размер: ${responseText.length} байт`);
        
        // Считаем примерный размер на запись
        if (data.length > 0) {
          const avgSize = responseText.length / data.length;
          console.log(`📊 Средний размер записи: ${avgSize.toFixed(2)} байт`);
          
          // Оцениваем, сколько записей можно получить до 80КБ
          const maxRecords = Math.floor(80000 / avgSize);
          console.log(`📈 Примерный лимит до 80КБ: ${maxRecords} записей`);
        }
      } catch (e) {
        console.error("❌ Невалидный JSON:", e.message);
      }
    }
    
  } catch (error) {
    console.error("🔥 Исключение:", error);
  }
}

function analyzeJsonBreak(jsonText) {
  // Ищем последний валидный JSON объект
  let lastValidPos = 0;
  let braceCount = 0;
  let inString = false;
  let escape = false;
  
  for (let i = 0; i < jsonText.length; i++) {
    const char = jsonText[i];
    
    if (escape) {
      escape = false;
      continue;
    }
    
    if (char === '\\') {
      escape = true;
      continue;
    }
    
    if (char === '"' && !escape) {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      
      // Если нашли конец объекта и следом идет запятая или закрывающая скобка массива
      if (braceCount === 0 && char === '}') {
        // Проверяем следующие символы
        const nextChar = i + 1 < jsonText.length ? jsonText[i + 1] : '';
        if (nextChar === ',' || nextChar === ']') {
          lastValidPos = i + (nextChar === ',' ? 1 : 2);
        }
      }
    }
  }
  
  console.log(`🔍 Позиция последнего валидного объекта: ${lastValidPos}/${jsonText.length}`);
  
  if (lastValidPos > 0 && lastValidPos < jsonText.length) {
    const validPart = jsonText.substring(0, lastValidPos);
    const brokenPart = jsonText.substring(lastValidPos);
    
    console.log("✅ Валидная часть:", validPart.length, "байт");
    console.log("❌ Обрыв:", brokenPart.length, "байт");
    console.log("Обрыв начинается с:", brokenPart.substring(0, 100));
    
    // Пытаемся восстановить, что было в обрыве
    if (brokenPart.trim().length > 0) {
      console.log("\n🔧 Попытка восстановить обрыв:");
      console.log(brokenPart);
    }
  }
}

function formatDate(date) {
  return Utilities.formatDate(date, "GMT+3", "MM/dd/yyyy");
}

// Функция для тестирования с разными BatchSize
function testBatchSizes() {
  console.log("🧪 Тестирование разных BatchSize");
  
  const props = PropertiesService.getScriptProperties();
  const appId = props.getProperty('APPSHEET_APP_ID');
  const apiKey = props.getProperty('APPSHEET_API_KEY');
  const tableName = props.getProperty('APPSHEET_TABLE_NAME');
  
  const batchSizes = [50, 100, 150, 200, 250, 300, 500, 1000];
  
  batchSizes.forEach(batchSize => {
    console.log(`\n📦 BatchSize = ${batchSize}:`);
    
    const url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;
    
    const payload = {
      "Action": "Find",
      "Properties": {
        "Locale": "ru-RU",
        "BatchSize": batchSize
      },
      "Rows": []
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApplicationAccessKey': apiKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    try {
      const startTime = Date.now();
      const response = UrlFetchApp.fetch(url, options);
      const responseTime = Date.now() - startTime;
      
      const responseText = response.getContentText();
      
      console.log(`- Время: ${responseTime}мс`);
      console.log(`- Размер: ${responseText.length} байт`);
      
      try {
        const data = JSON.parse(responseText);
        console.log(`- Записей: ${data.length}`);
        
        // Проверяем целостность
        const isComplete = responseText.trim().endsWith("}]");
        console.log(`- Цельный: ${isComplete ? "✅" : "❌"}`);
        
        if (!isComplete) {
          console.warn("  ⚠️ Обрыв при BatchSize =", batchSize);
        }
      } catch (e) {
        console.error("- ❌ JSON ошибка");
      }
    } catch (error) {
      console.error("- ❌ Ошибка запроса:", error.message);
    }
  });
}

// Простой тест для быстрой проверки
function quickTest() {
  console.log("⚡ Быстрый тест AppSheet API");
  
  const props = PropertiesService.getScriptProperties();
  const appId = props.getProperty('APPSHEET_APP_ID');
  const apiKey = props.getProperty('APPSHEET_API_KEY');
  const tableName = props.getProperty('APPSHEET_TABLE_NAME');
  
  const url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;
  
  const payload = {
    "Action": "Find",
    "Properties": {
      "Locale": "ru-RU",
      "BatchSize": 100
    },
    "Rows": []
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ApplicationAccessKey': apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const text = response.getContentText();
    
    console.log("Статус:", response.getResponseCode());
    console.log("Длина:", text.length, "байт");
    console.log("Последние 200 символов:");
    console.log(text.substring(text.length - 200));
    
    // Проверяем обрыв
    if (!text.trim().endsWith("}]")) {
      console.error("⚠️ ОБРЫВ ОТВЕТА!");
      console.log("Ищем, где обрыв...");
      
      const lastBracket = text.lastIndexOf("}]");
      if (lastBracket !== -1) {
        console.log("Должно быть на позиции:", lastBracket);
        console.log("А обрывается на:", text.length);
        console.log("Обрыв:", text.substring(lastBracket - 50, text.length));
      }
    }
    
  } catch (error) {
    console.error("Ошибка:", error);
  }
}