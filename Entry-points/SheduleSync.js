// ScheduledSync.js
function setupDailyTrigger() 
{
  // Удаляем существующие триггеры с таким же именем, чтобы избежать дублирования
  removeExistingTriggers('scheduledSync');
  
  // Создаем новый триггер на каждый день в 2:00 ночи
  ScriptApp.newTrigger('scheduledSync')
    .timeBased()
    .atHour(2)  // 2:00 ночи
    .everyDays(1)
    .create();
  
  Logger.log('✅ Ежедневный триггер установлен на 2:00');
  
  // Также можно создать триггер на каждый час для тестирования (закомментировать после теста)
  // ScriptApp.newTrigger('scheduledSync')
  //   .timeBased()
  //   .everyHours(1)
  //   .create();
  
  return 'Триггер установлен на ежедневный запуск в 2:00';
}

function removeExistingTriggers(functionName) 
{
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => 
    {
        if (trigger.getHandlerFunction() === functionName) 
        {
        ScriptApp.deleteTrigger(trigger);
        Logger.log(`Удален существующий триггер для функции ${functionName}`);
        }
    });
}

function scheduledSync() 
{
  const startTime = new Date();
  
  try 
  {
    Logger.log(`🔄 Запуск автоматической синхронизации в ${startTime}`);
    
    // Вызываем вашу существующую функцию синхронизации
    const results = syncAllAppSheetData();  // или transferAllTables() в зависимости от вашей реализации
    
    const endTime = new Date();
    const executionTime = endTime - startTime;
    
    // Логируем результат
    logger.logSyncResult(results, executionTime);
    
    Logger.log(`✅ Синхронизация завершена за ${executionTime} мс`);
    
    // Отправляем уведомление на email (опционально)
    // sendSyncNotification(results, executionTime);
    
    return {
      success: true,
      executionTime: executionTime,
      results: results
    };
    
  } 
  catch (error) 
  {
    const endTime = new Date();
    const executionTime = endTime - startTime;
    
    // Логируем ошибку
    logger.logError(error, 'Автоматическая синхронизация');
    
    Logger.log(`❌ Ошибка синхронизации: ${error.toString()}`);
    
    // Отправляем уведомление об ошибке
    // sendErrorNotification(error);
    
    return {
      success: false,
      error: error.toString(),
      executionTime: executionTime
    };
  }
}

// Функция для ручного запуска (можно добавить в меню)
function manualSyncWithLogging() 
{
  const ui = SpreadsheetApp.getUi();
  
  try 
  {
    const result = ui.alert(
      'Запуск синхронизации',
      'Выполнить синхронизацию всех таблиц и записать результат в логи?',
      ui.ButtonSet.YES_NO
    );
    
    if (result === ui.Button.YES) 
    {
      scheduledSync();
      ui.alert('Синхронизация завершена. Результат записан в логи.');
    }
  } 
  catch (error) 
  {
    ui.alert('Ошибка: ' + error.toString());
  }
}

// Проверка наличия установленных триггеров
function checkExistingTriggers() 
{
    const triggers = ScriptApp.getProjectTriggers();
    const triggerList = [];
    
    triggers.forEach(trigger => 
    {
        triggerList.push({
            function: trigger.getHandlerFunction(),
            source: trigger.getTriggerSource(),
            type: trigger.getEventType()
        });
    });
    
    return triggerList;
}