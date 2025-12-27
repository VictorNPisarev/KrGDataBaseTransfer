class ServiceFactory 
{
    static createAppSheetService() 
    {
      const { APPSHEET_APP_ID, APPSHEET_API_KEY } = Constants.SCRIPT_PROPERTIES;
      return new AppSheetService({
                                  appId: APPSHEET_APP_ID,
                                  apiKey: APPSHEET_API_KEY
                                  });

    }

    static createGoogleSheetsService() 
    {
      return new GoogleSheetsService();
    }

    static createDateFilterService(sheetsService) 
    {
      return new DateFilterService
      (
        sheetsService, 
        Constants.SHEET_NAMES.DATE_FILTER
      );
    }

    static createOrdersToDoFetcher(appSheetService) 
    {
      const { APPSHEET_MAIN_TABLE_NAME } = Constants.SCRIPT_PROPERTIES;
      return new OrdersFetcher
      (
        appSheetService,
        APPSHEET_MAIN_TABLE_NAME,
        Constants.OrdersToDo_MAPPINGS,
        new OrdersToDoStrategy()
      );
    }

    static createOrdersInProductFetcher(appSheetService) 
    {
      const { APPSHEET_PRODUCTION_TABLE_NAME } = Constants.SCRIPT_PROPERTIES;
      return new OrdersFetcher
      (
        appSheetService,
        APPSHEET_PRODUCTION_TABLE_NAME,
        Constants.OrdersInProduct_MAPPINGS,
        new OrdersInProductStrategy()
      );
    }

    static createProductionStatusFetcher(appSheetService) 
    {
      const { APPSHEET_PRODUCTIONSTATUS_TABLE_NAME } = Constants.SCRIPT_PROPERTIES;
      return new OrdersFetcher
      (
        appSheetService,
        APPSHEET_PRODUCTIONSTATUS_TABLE_NAME,
        Constants.ProductionStatus_MAPPINGS,
        new ProductionStatusStrategy()
      );
    }

    static createB0MFlagsFetcher(appSheetService) 
    {
      const { APPSHEET_BOMFLAGS_TABLE_NAME } = Constants.SCRIPT_PROPERTIES;
      return new OrdersFetcher
      (
        appSheetService,
        APPSHEET_BOMFLAGS_TABLE_NAME,
        Constants.BoMFlags_MAPPINGS,
        new BoMFlagsStrategy()
      );
    }

      /**
     * Создаем специальный фетчер для производственной статистики
     */
    static createProductionStatsFetcher(appSheetService) 
    {
      return new ProductionStatsFetcher(appSheetService);
    }

    static createGoogleSheetsDataWriter() 
    {
      return new GoogleSheetsDataWriter(this.createGoogleSheetsService());
    }
}