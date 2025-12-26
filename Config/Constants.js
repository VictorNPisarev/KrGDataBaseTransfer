class Constants 
{
  static get SHEET_NAMES() 
  {
    return {
      DATE_FILTER: 'GS_DateFilter',
      ORDERS_BUFFER: 'GS_OrdersToDo',
      SUMMARY: 'GS_ProductionStatusSummary'
    };
  }

  static get OrdersToDo_MAPPINGS() 
  {
    //OrdersToDo
    return {
      // Поля в AppSheet
      RowID: 'Row ID',
      OrderNumber: '№ Заказа',
      ReadyDate: 'Готовность',
      WinAmount: 'Окна, шт',
      WinSqrt: 'Окна, м2',
      PlateAmount: 'Щитовые, шт',
      PlateSqrt: 'Щитовые, м2',
      Econom: 'Эконом',
      Claim: 'Рекламация',
      OnlyPayed: 'Оплачен. Не запущен'
    };

  }

  static get OrdersInProduct_MAPPINGS() 
  {
    //OrdersInProduct
    return {
      // Поля в AppSheet
      RowID: 'Row ID',
      OrdersToDoId: 'OrdersToDoId',
      ProductionStatusId: 'ProductionStatusId',
      ProductionStatusChangeDate: 'Дата изменения этапа'
    };

  }

  static get SCRIPT_PROPERTIES() 
  {
    const props = PropertiesService.getScriptProperties();
    return {
      APPSHEET_APP_ID: props.getProperty('APPSHEET_APP_ID'),
      APPSHEET_API_KEY: props.getProperty('APPSHEET_API_KEY'),
      APPSHEET_MAIN_TABLE_NAME: props.getProperty('APPSHEET_MAIN_TABLE_NAME'),
      APPSHEET_PRODUCTION_TABLE_NAME: props.getProperty('APPSHEET_PRODUCTION_TABLE_NAME')
    };
  }
}