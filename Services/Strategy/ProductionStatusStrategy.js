class ProductionStatusStrategy extends DataMappingStrategy
{
    map(statuses, fieldMappings) 
    {
        return statuses.map(status => ({
            id: status[fieldMappings.RowID],
            status: status[fieldMappings.Status],
            previousWorkPlace: status[fieldMappings.PreviousWorkPlace],
            isWorkPlace: this.parseBoolean(status[fieldMappings.IsWorkPlace])
      }));
    }
}