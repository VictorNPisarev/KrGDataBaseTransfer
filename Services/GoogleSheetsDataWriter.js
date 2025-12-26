/**
 * Сервис для записи данных из AppSheet в Google Sheets
 */
class GoogleSheetsDataWriter {
  constructor(sheetsService) {
    this.sheetsService = sheetsService;
  }

  /**
   * Записать данные OrdersToDo
   */
  writeOrdersToDo(data, sheetName = 'OrdersToDo_Dump') {
    const headers = [
      'Row ID', '№ Заказа', 'Готовность', 'Окна, шт', 'Окна, м2',
      'Щитовые, шт', 'Щитовые, м2', 'Эконом', 'Рекламация', 'Оплачен'
    ];

    const rows = data.map(order => [
      order.id,
      order.orderNumber,
      order.readyDate,
      order.windowCount,
      order.windowArea,
      order.shieldCount,
      order.shieldArea,
      order.isEconom ? 'Да' : 'Нет',
      order.isClaim ? 'Да' : 'Нет',
      order.isOnlyPayed ? 'Да' : 'Нет'
    ]);

    return this.sheetsService.writeSheet(sheetName, headers, rows);
  }

  /**
   * Записать данные OrdersInProduct
   */
  writeOrdersInProduct(data, sheetName = 'OrdersInProduct_Dump') {
    const headers = [
      'Row ID', 'ID заказа', 'ID статуса', 'Дата изменения',
      'Примечания', 'Брус', 'Штапик', 'Двухсторонняя покраска'
    ];

    const rows = data.map(relation => [
      relation.id,
      relation.ordersToDoId,
      relation.productionStatusId,
      relation.changeDate,
      relation.comment,
      relation.hasLumber ? 'Да' : 'Нет',
      relation.hasGlazingBead ? 'Да' : 'Нет',
      relation.needsTwoSidePaint ? 'Да' : 'Нет'
    ]);

    return this.sheetsService.writeSheet(sheetName, headers, rows);
  }

  /**
   * Записать данные ProductionStatus
   */
  writeProductionStatus(data, sheetName = 'ProductionStatus_Dump') {
    const headers = [
      'Row ID', 'Статус', 'Предыдущий участок', 'Активный участок'
    ];

    const rows = data.map(status => [
      status.id,
      status.statusName,
      status.previousWorkPlace,
      status.isWorkPlace ? 'Да' : 'Нет'
    ]);

    return this.sheetsService.writeSheet(sheetName, headers, rows);
  }

  /**
   * Записать все таблицы разом
   */
  async writeAllTables(dataCollections) {
    const results = {};

    if (dataCollections.ordersToDo) {
      results.ordersToDo = this.writeOrdersToDo(dataCollections.ordersToDo);
    }

    if (dataCollections.ordersInProduct) {
      results.ordersInProduct = this.writeOrdersInProduct(dataCollections.ordersInProduct);
    }

    if (dataCollections.productionStatus) {
      results.productionStatus = this.writeProductionStatus(dataCollections.productionStatus);
    }

    return results;
  }
}