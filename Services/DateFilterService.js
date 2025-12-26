class DateFilterService 
{
    constructor(sheetsService) 
    {
        this.sheetsService = sheetsService;
        this.sheetName = Constants.SHEET_NAMES.DATE_FILTER;
    }
  
    getCurrentPeriod() 
    {
        const sheet = this.sheetsService.getSheet(this.sheetName);
        const lastRow = sheet.getLastRow();
        
        // Заголовки в первой строке
        if (lastRow < 2) 
        {
            throw new Error('Нет данных в DateFilter');
        }
        
        const periodFrom = sheet.getRange(lastRow, 1).getValue();
        const periodTo = sheet.getRange(lastRow, 2).getValue();
        
        return {
            from: new Date(periodFrom),
            to: new Date(periodTo)
        };
    }
    
    validatePeriod(period) 
    {
        if (!(period.from instanceof Date) || !(period.to instanceof Date)) 
        {
            throw new Error('Некорректный формат даты');
        }
        
        if (period.from > period.to) 
        {
            throw new Error('Дата начала не может быть позже даты окончания');
        }
        
        return true;
    }
}