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
      Constants.OrdersToDo_MAPPINGS
    );
  }

  static createOrdersToDoFetcher(appSheetService) 
  {
    const { APPSHEET_MAIN_TABLE_NAME } = Constants.SCRIPT_PROPERTIES;
    return new OrdersFetcher
    (
      appSheetService,
      APPSHEET_MAIN_TABLE_NAME,
      Constants.OrdersToDo_MAPPINGS
    );
  }

  static createSummaryWriter(sheetsService) 
  {
    return new SummaryWriter
    (
      sheetsService,
      Constants.SHEET_NAMES.ORDERS_BUFFER,
      Constants.SHEET_NAMES.SUMMARY
    );
  }
}