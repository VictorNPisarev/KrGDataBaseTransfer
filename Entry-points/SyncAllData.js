// entry-points/syncAllData.js
function syncAllAppSheetData() 
{
  const orchestrator = new DataSyncOrchestrator();
  return orchestrator.syncAllTables();
}

function syncOrdersToDo() 
{
  const orchestrator = new DataSyncOrchestrator();
  const period = { from: new Date('2024-01-01'), to: new Date() };
  return orchestrator.syncTable('OrdersToDo', period);
}

// Для ручного запуска из редактора GAS
function testSync() 
{
  console.log('Тест синхронизации OrdersToDo...');
  const result = syncOrdersToDo();
  console.log('Результат:', result);
}