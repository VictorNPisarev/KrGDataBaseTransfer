// Code.js - добавить в существующий onOpen()
function onOpen() 
{
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('AppSheet Sync');
  
  menu.addItem('🔄 Синхронизировать все таблицы', 'syncAllAppSheetData');
  menu.addItem('📊 Синхронизация с логированием', 'manualSyncWithLogging');
  menu.addSeparator();
  menu.addItem('⏰ Установить ежедневный триггер', 'setupDailyTrigger');
  menu.addItem('❌ Удалить триггеры', 'removeAllTriggers');
  menu.addSeparator();
  menu.addItem('📈 Показать логи', 'showSyncLogs');
  menu.addToUi();
}

// Новая функция для удаления всех триггеров
function removeAllTriggers() 
{
    const ui = SpreadsheetApp.getUi();
    const result = ui.alert(
        'Удаление триггеров',
        'Удалить все установленные триггеры?',
        ui.ButtonSet.YES_NO
    );
    
    if (result === ui.Button.YES) 
    {
        const triggers = ScriptApp.getProjectTriggers();
        triggers.forEach(trigger => 
        {
            ScriptApp.deleteTrigger(trigger);
        });
        ui.alert(`Удалено ${triggers.length} триггеров`);
    }
}

// Функция для отображения логов
function showSyncLogs() 
{
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SyncLogs');
    if (sheet) 
    {
        SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet);
    } 
    else 
    {
        SpreadsheetApp.getUi().alert('Логи не найдены. Выполните хотя бы одну синхронизацию.');
    }
}