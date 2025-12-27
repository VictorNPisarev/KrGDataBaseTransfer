/**
 * Базовый интерфейс стратегии маппинга данных
 */
class DataMappingStrategy {
  /**
   * Преобразует сырые данные из AppSheet в структурированный формат
   * @param {Array} rawData - Массив сырых объектов из AppSheet
   * @param {Object} fieldMappings - Маппинг полей
   * @returns {Array} Преобразованные данные
   */
  map(rawData, fieldMappings) {
    throw new Error('Метод map() должен быть реализован в конкретной стратегии');
  }

  /**
   * Вспомогательный метод для преобразования boolean значений
   */
  parseBoolean(value) {
    if (value === undefined || value === null || value === '') return false;
    return String(value).toLowerCase() === 'y' || String(value).toLowerCase() === 'v';
  }

  /**
   * Вспомогательный метод для преобразования числовых значений
   */
  parseNumber(value) {
    if (!value && value !== 0) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
}