// services/DataSyncOrchestrator.js
/**
 * Оркестратор для полной синхронизации данных
 */
class DataSyncOrchestrator 
{
  constructor() 
  {
    this.appSheetService = ServiceFactory.createAppSheetService();
    this.writer = ServiceFactory.createGoogleSheetsDataWriter();
  }

  /**
   * Полная синхронизация всех таблиц
   */
  async syncAllTables() 
  {
    console.log('🔄 Начало полной синхронизации данных AppSheet → Google Sheets');
    
    const results = {
      success: true,
      tables: {},
      errors: []
    };

    try 
    {
      // 1. Получаем фетчеры
      const todoFetcher = ServiceFactory.createOrdersToDoFetcher(this.appSheetService);
      const productFetcher = ServiceFactory.createOrdersInProductFetcher(this.appSheetService);
      const statusFetcher = ServiceFactory.createProductionStatusFetcher(this.appSheetService);
      const bomFetcher = ServiceFactory.createB0MFlagsFetcher(this.appSheetService);

      // 2. Определяем период (например, за последние 90 дней)
      const period = this.getDefaultPeriod();

      // 3. Загружаем данные параллельно
      const [ordersToDo, ordersInProduct, productionStatus, bomFlags] = await Promise.all([
        todoFetcher.fetchByDateRange(period).catch(e => {
          console.error('Ошибка загрузки OrdersToDo:', e);
          results.errors.push({ table: 'OrdersToDo', error: e.message });
          return [];
        }),
        
        // Для OrdersInProduct используем специальный запрос
        productFetcher.fetchWithSelector('Select(OrdersInProduct[*])').catch(e => {
          console.error('Ошибка загрузки OrdersInProduct:', e);
          results.errors.push({ table: 'OrdersInProduct', error: e.message });
          return [];
        }),
        
        // Все статусы
        statusFetcher.fetchWithSelector('Select(ProductionStatus[*])').catch(e => {
          console.error('Ошибка загрузки ProductionStatus:', e);
          results.errors.push({ table: 'ProductionStatus', error: e.message });
          return [];
        }),
        
        // Все флаги BOM
        bomFetcher.fetchWithSelector('Select(BoMFlags[*])').catch(e => {
          console.error('Ошибка загрузки BoMFlags:', e);
          results.errors.push({ table: 'BoMFlags', error: e.message });
          return [];
        })
      ]);

      // 4. Записываем данные
      const writeResults = await this.writer.writeAllTables({
        ordersToDo,
        ordersInProduct,
        productionStatus,
        bomFlags: bomFlags // сырые данные, так как нет стратегии
      });

      // 5. Формируем отчет
      results.tables = {
        ordersToDo: { records: ordersToDo.length, written: !!writeResults.ordersToDo },
        ordersInProduct: { records: ordersInProduct.length, written: !!writeResults.ordersInProduct },
        productionStatus: { records: productionStatus.length, written: !!writeResults.productionStatus },
        bomFlags: { records: bomFlags.length, written: !!writeResults.bomFlags }
      };

      console.log('✅ Синхронизация завершена:', results);

    } catch (error) {
      console.error('❌ Критическая ошибка синхронизации:', error);
      results.success = false;
      results.errors.push({ table: 'SYSTEM', error: error.message });
    }

    return results;
  }

  /**
   * Синхронизация одной таблицы
   */
  async syncTable(tableName, period = null) 
  {
    const fetchers = 
    {
      'OrdersToDo': () => ServiceFactory.createOrdersToDoFetcher(this.appSheetService),
      'OrdersInProduct': () => ServiceFactory.createOrdersInProductFetcher(this.appSheetService),
      'ProductionStatus': () => ServiceFactory.createProductionStatusFetcher(this.appSheetService),
      'BoMFlags': () => ServiceFactory.createB0MFlagsFetcher(this.appSheetService)
    };

    if (!fetchers[tableName]) 
    {
      throw new Error(`Неизвестная таблица: ${tableName}`);
    }

    const fetcher = fetchers[tableName]();
    let data;

    if (tableName === 'OrdersToDo' && period) 
    {
      data = await fetcher.fetchByDateRange(period);
    } 
    else 
    {
      // Для остальных таблиц загружаем все
      data = await fetcher.fetchAll();
    }

    // Записываем
    const writeMethod = `write${tableName.replace(/ /g, '')}`;
    if (this.writer[writeMethod]) 
    {
      await this.writer[writeMethod](data);
      return { success: true, records: data.length };
    } 
    else 
    {
      // Для таблиц без метода пишем в общий дамп
      const sheetName = `${tableName}_Dump`;
      await this.writer.sheetsService.writeSheet(sheetName, [], data);
      return { success: true, records: data.length, note: 'Сырые данные' };
    }
  }

  getDefaultPeriod() {
    // Последние 90 дней
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    
    return { from: startDate, to: endDate };
  }
}