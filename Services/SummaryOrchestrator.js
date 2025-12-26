class SummaryOrchestrator 
{
  constructor() 
  {
    this.sheetsService = ServiceFactory.createGoogleSheetsService();
    this.appSheetService = ServiceFactory.createAppSheetService();
    
//    this.dateFilterService = ServiceFactory.createDateFilterService(this.sheetsService);
      this.todoFetcher = ServiceFactory.createOrdersToDoFetcher(this.appSheetService);
      this.productFetcher = ServiceFactory.createOrdersInProductFetcher(this.appSheetService);
      this.statusFetcher = ServiceFactory.createProductionStatusFetcher(this.appSheetService);
//    this.calculator = new SummaryCalculator();
    this.writer = ServiceFactory.createSummaryWriter(this.sheetsService);
    
    this.logger = new Logger();
  }

  async execute() 
  {
    this.logger.info('Starting summary calculation...');
    
    try 
    {
      // 1. Получаем период
      const period = this.dateFilterService.getCurrentPeriod();
      this.dateFilterService.validatePeriod(period);
      
      this.logger.info(`Period: ${period.from} - ${period.to}`);

      // 2. Получаем заказы
      this.logger.info('Fetching orders from AppSheet...');
      const orders = await this.todoFetcher.fetchByDateRange(period);
      this.logger.info(`Found ${orders.length} orders`);

      // 3. Пишем в буфер (опционально, для отладки)
      this.writer.clearBuffer();
      this.writer.writeToBuffer(orders);

      // 4. Рассчитываем итоги
      this.logger.info('Calculating summary...');
      const summary = this.calculator.calculate(orders);

      // 5. Пишем результаты
      this.logger.info('Writing summary to sheet...');
      this.writer.writeSummary(summary);

      // 6. Очищаем буфер
      //this.writer.clearBuffer();

      this.logger.info('Summary calculation completed successfully');
      
      return {
        success: true,
        period,
        ordersCount: orders.length,
        summaryRows: summary.length
      };

    } 
    catch (error) 
    {
      this.logger.error('Calculation failed:', error);
      throw error;
    }
  }
}