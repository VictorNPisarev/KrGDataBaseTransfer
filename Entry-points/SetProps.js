function setupProperties() 
{
  PropertiesService.getScriptProperties()
    .setProperties({
      'APPSHEET_APP_ID': '433d2cd6-9a87-401a-bd12-ca203df3feef',
      'APPSHEET_API_KEY': 'V2-LsZYa-MNgxT-v49R3-IoCSB-y7c86-LNxSH-9ksbq-NN9Ff',
      'APPSHEET_MAIN_TABLE_NAME': 'OrdersToDo',
      'APPSHEET_PRODUCTION_TABLE_NAME': 'OrdersInProduct',
      'APPSHEET_PRODUCTIONSTATUS_TABLE_NAME': 'ProductionStatus',
      'APPSHEET_BOMFLAGS_TABLE_NAME': 'BoMFlags'
    });
}