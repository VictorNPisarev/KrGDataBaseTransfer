class BoMFlagsStrategy extends DataMappingStrategy
{
    map(orders, fieldMappings) 
    {
      return orders.map(order => ({
        id: order[fieldMappings.RowID],
        orderNumber: order[fieldMappings.Order],
        ordersToDoId: order[fieldMappings.OrdersToDoId],
        furniture: this.parseBoolean(order[fieldMappings.Furniture]),
        glass: this.parseBoolean(order[fieldMappings.Glass]),
        paint: this.parseBoolean(order[fieldMappings.Paint]),
        alumWaterShield: this.parseBoolean(order[fieldMappings.AlumWaterShield]),
        lumber: order[fieldMappings.Lumber],
        woodAlum: order[fieldMappings.WoodAlum],
        comment: order[fieldMappings.Comment]
      }));
    }
}