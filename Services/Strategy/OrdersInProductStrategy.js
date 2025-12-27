class OrdersInProductStrategy extends DataMappingStrategy 
{
  map(relations, fieldMappings) 
  {
    return relations.map(relation => ({
        id: relation[fieldMappings.RowID],
        ordersToDoId: relation[fieldMappings.OrdersToDoId],
        productionStatusId: relation[fieldMappings.ProductionStatusId],
        changeDate: relation[fieldMappings.ProductionStatusChangeDate],
        comment: relation[fieldMappings.Comment],
        lumber: relation[fieldMappings.Lumber],
        glazingBead: relation[fieldMappings.GlazingBead],
        twoSidePaint: this.parseBoolean(relation[fieldMappings.TwoSidePaint])
    }));
  }
}