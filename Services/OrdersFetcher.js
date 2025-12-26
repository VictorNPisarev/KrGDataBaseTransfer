// services/OrdersFetcher.js
class OrdersFetcher
{
    constructor(appSheetService, tableName, fieldMappings) 
    {
        this.appSheetService = appSheetService;
        this.tableName = tableName;
        this.fieldMappings = fieldMappings;
    }
    
    async fetchByDateRange(period) 
    {
        const orders = await this.appSheetService.findOrdersByDateRange
        (
            this.tableName,
            this.fieldMappings.ReadyDate,
            period.from,
            period.to
        );
        
        return orders.map(
            order => ({
                id: order[this.fieldMappings.RowID],
                orderInProductID: null,
                productionStatusId: '1111',
                name: order[this.fieldMappings.OrderNumber],
                date: order[this.fieldMappings.ReadyDate],
                winAmount: order[this.fieldMappings.WinAmount],
                winSqrt: order[this.fieldMappings.WinSqrt],
                plateAmount: order[this.fieldMappings.PlateAmount],
                plateSqrt: order[this.fieldMappings.PlateSqrt],
                econom: order[this.fieldMappings.Econom].toLowerCase() === "true",
                claim: order[this.fieldMappings.Claim].toLowerCase() === "true"
            }));
    }
}