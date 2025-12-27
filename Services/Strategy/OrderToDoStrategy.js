class OrdersToDoStrategy extends DataMappingStrategy 
{
  map(orders, fieldMappings) 
  {
    return orders.map(order => ({
        id: order[fieldMappings.RowID],
        order: order[fieldMappings.OrderNumber],
        readyDate: order[fieldMappings.ReadyDate],
        winCount: this.parseNumber(order[fieldMappings.WinAmount]),
        winArea: this.parseNumber(order[fieldMappings.WinSqrt]),
        plateCount: this.parseNumber(order[fieldMappings.PlateAmount]),
        plateArea: this.parseNumber(order[fieldMappings.PlateSqrt]),
        econom: this.parseBoolean(order[fieldMappings.Econom]),
        claim: this.parseBoolean(order[fieldMappings.Claim]),
        onlyPayed: this.parseBoolean(order[fieldMappings.OnlyPayed])
    }));
  }
}