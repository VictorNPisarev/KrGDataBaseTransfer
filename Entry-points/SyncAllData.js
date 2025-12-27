// entry-points/syncAllData.js
function syncAllAppSheetData() 
{
  const orchestrator = new DataSyncOrchestrator();
  return orchestrator.syncAllTables();
}

function syncOrdersToDo() 
{
  const orchestrator = new DataSyncOrchestrator();
  const period = { from: new Date('2024-11-09'), to: new Date('2026-12-31') };
  return orchestrator.syncTable('OrdersToDo');
}

function syncOrdersInProduct() 
{
  const orchestrator = new DataSyncOrchestrator();
  return orchestrator.syncTable('OrdersInProduct');
}

function syncProductionStatus() 
{
  const orchestrator = new DataSyncOrchestrator();
  return orchestrator.syncTable('ProductionStatus');
}

function syncBoMFlags() 
{
  const orchestrator = new DataSyncOrchestrator();
  return orchestrator.syncTable('BoMFlags');
}

// Для ручного запуска из редактора GAS
function testSync() 
{
  console.log('Тест синхронизации OrdersToDo...');
  const result = syncOrdersToDo();
  console.log('Результат:', result);
}