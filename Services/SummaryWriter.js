// services/SummaryWriter.js
class SummaryWriter 
{
    constructor(sheetsService, bufferSheetName, summarySheetName) 
    {
        this.sheetsService = sheetsService;
        this.bufferSheetName = bufferSheetName;
        this.summarySheetName = summarySheetName;
    }
    
    clearBuffer() 
    {
        this.sheetsService.clearSheet(this.bufferSheetName);
    }
    
    writeToBuffer(orders) 
    {
        if (orders.length === 0) 
        {
            return;
        }
        
        const headers = [['OrderToDoID', 'OrderInProductID', 'ProductionStatusId', '№ Заказа', 
            'Окна, шт', 'Окна, м2', 'Щитовые, шт', 'Щитовые, м2', 'Готовность', 'Эконом', 'Рекламация']];
        const data = orders.map(order => [
            order.id,
            order.orderInProductID,
            order.productionStatusId,
            order.name,
            order.winAmount,
            order.winSqrt,
            order.plateAmount,
            order.plateSqrt,
            order.date,
            order.econom,
            order.claim
        ]);
        
        this.sheetsService.writeData(this.bufferSheetName, headers.concat(data));
    }
    
    writeSummary(summary) 
    {
        const headers = [['Участок', 'Окна, шт', 'Окна, м2', 'Щитовые, шт', 'Щитовые, м2']];
        const data = summary.map(row => [
            row.productionStatusId,
            row.winAmount,
            row.winSqrt,
            row.plateAmount,
            row.plateSqrt
        ]);
        
        this.sheetsService.writeData(this.summarySheetName, headers.concat(data));
        
        // Форматируем итоговую строку
        const sheet = this.sheetsService.getSheet(this.summarySheetName);
        const lastRow = sheet.getLastRow();
        const range = sheet.getRange(lastRow, 1, 1, 4);
        range.setFontWeight('bold');
        range.setBackground('#f0f0f0');
    }
}