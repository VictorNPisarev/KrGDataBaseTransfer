class OrdersToDoStrategy extends DataMappingStrategy 
{
  map(orders, fieldMappings) 
  {
    return orders.map(order => ({
        id: order[fieldMappings.RowID],
        orderNumber: order[fieldMappings.OrderNumber],
        readyDate: order[fieldMappings.ReadyDate],
        winAmount: Number(order[fieldMappings.WinAmount]) || 0,
        winSqrt: Number(order[fieldMappings.WinSqrt]) || 0,
        plateAmount: Number(order[fieldMappings.PlateAmount]) || 0,
        plateSqrt: Number(order[fieldMappings.PlateSqrt]) || 0,
        econom: this.parseBoolean(order[fieldMappings.Econom]),
        claim: this.parseBoolean(order[fieldMappings.Claim]),
        onlyPayed: this.parseBoolean(order[fieldMappings.OnlyPayed])
    }));
  }
}