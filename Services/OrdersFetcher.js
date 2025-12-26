// services/OrdersFetcher.js
class OrdersFetcher {
  /**
   * @param {AppSheetService} appSheetService - Сервис работы с API
   * @param {string} tableName - Имя таблицы в AppSheet
   * @param {Object} fieldMappings - Маппинг полей таблицы
   * @param {DataMappingStrategy} mappingStrategy - Стратегия маппинга
   */
  constructor(appSheetService, tableName, fieldMappings, mappingStrategy = null) {
    this.appSheetService = appSheetService;
    this.tableName = tableName;
    this.fieldMappings = fieldMappings;
    this.mappingStrategy = mappingStrategy;
  }
  
  /**
   * Получить данные за период
   */
  async fetchByDateRange(period) {
    console.log(`📥 Загрузка ${this.tableName} за период...`);
    
    const rawData = await this.appSheetService.findOrdersByDateRange(
      this.tableName,
      this.fieldMappings.ReadyDate,
      period.from,
      period.to
    );
    
    return this.mapData(rawData);
  }
  
  /**
   * Получить данные по произвольному Selector
   */
  async fetchWithSelector(selector) {
    console.log(`📥 Загрузка ${this.tableName} с Selector...`);
    
    const rawData = await this.appSheetService.findWithSelector(
      this.tableName,
      selector
    );
    
    return this.mapData(rawData);
  }
  
  /**
   * Преобразование данных с использованием стратегии
   */
  mapData(rawData) {
    if (!this.mappingStrategy) {
      console.warn(`⚠️ Для ${this.tableName} не указана стратегия маппинга`);
      return rawData;
    }
    
    try {
      const mappedData = this.mappingStrategy.map(rawData, this.fieldMappings);
      console.log(`✅ ${this.tableName}: преобразовано ${mappedData.length} записей`);
      return mappedData;
    } catch (error) {
      console.error(`❌ Ошибка маппинга ${this.tableName}:`, error);
      throw error;
    }
  }
  
  /**
   * Получить информацию о фетчере (для отладки)
   */
  getInfo() {
    return {
      tableName: this.tableName,
      hasStrategy: !!this.mappingStrategy,
      strategyName: this.mappingStrategy?.constructor?.name || 'Нет',
      fieldCount: Object.keys(this.fieldMappings).length
    };
  }
}