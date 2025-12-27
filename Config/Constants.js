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

  //Поля в OrdersToDo
  static get OrdersToDo_MAPPINGS() 
  {
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

  //Поля в OrdersInProduct
  static get OrdersInProduct_MAPPINGS() 
  {
    return {
      // Поля в AppSheet
      RowID: 'Row ID',
      OrdersToDoId: 'OrdersToDoId',
      ProductionStatusId: 'ProductionStatusId',
      ProductionStatusChangeDate: 'Дата изменения этапа',
      Comment: 'Примечания',
      Lumber: 'Брус',
      GlazingBead: 'Штапик',
      TwoSidePaint: 'Двухстор. покраска'
    };
  }

  //Поля в ProductionStatus
  static get ProductionStatus_MAPPINGS() 
  {
    return {
      // Поля в AppSheet
      RowID: 'Row ID',
      Status: 'Status',
      PreviousWorkPlace: 'PreviousWorkPlace',
      IsWorkPlace: 'IsWorkPlace'
    };
  }

  //Поля в BoMFlags
  static get BoMFlags_MAPPINGS() 
  {
    return {
      // Поля в AppSheet
      RowID: 'Row ID',
      Order: '№ Заказа',
      OrdersToDoId: 'OrdersToDoId',
      Furniture: 'Фурнитура',
      Glass: 'Стеклопакеты',
      Paint: 'ЛКМ',
      AlumWaterShield: 'ППС, В/О',
      Lumber: 'Брус',
      WoodAlum: 'Дер-алюм',
      Comment: 'Примечание'
    };
  }

  static get SCRIPT_PROPERTIES() 
  {
    const props = PropertiesService.getScriptProperties();
    return {
      APPSHEET_APP_ID: props.getProperty('APPSHEET_APP_ID'),
      APPSHEET_API_KEY: props.getProperty('APPSHEET_API_KEY'),
      APPSHEET_MAIN_TABLE_NAME: props.getProperty('APPSHEET_MAIN_TABLE_NAME'),
      APPSHEET_PRODUCTION_TABLE_NAME: props.getProperty('APPSHEET_PRODUCTION_TABLE_NAME'),
      APPSHEET_PRODUCTIONSTATUS_TABLE_NAME: props.getProperty('APPSHEET_PRODUCTIONSTATUS_TABLE_NAME'),
      APPSHEET_BOMFLAGS_TABLE_NAME: props.getProperty('APPSHEET_BOMFLAGS_TABLE_NAME')
    };
  }
}