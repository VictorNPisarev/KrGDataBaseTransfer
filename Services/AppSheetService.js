class AppSheetService 
{
  constructor({ appId, apiKey }) 
  {
    this.baseUrl = `https://api.appsheet.com/api/v2/apps/${appId}`;
    this.headers = 
    {
      'Content-Type': 'application/json',
      'ApplicationAccessKey': apiKey
    };
  }

  /**
   * Только метод Find - остальное не нужно
   */
  async findOrdersByDateRange(tableName, dateField, startDate, endDate) 
  {
    const payload = 
    {
      "Action": "Find",
      "Properties": 
      {
        "Locale": "ru-RU",
        "Selector": "Select(" + tableName + "[Row ID], and([" + dateField + "] >= '" + this.formatDate(startDate, "GMT+3", "MM/dd/yyyy") + 
                                            "', [" + dateField + "] <= '" + this.formatDate(endDate, "GMT+3", "MM/dd/yyyy") + "'))"
      },
      "Rows": []
    };

    const url = `${this.baseUrl}/tables/${tableName}/Action`;
    const options = 
    {
      method: 'POST',
      headers: this.headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = await UrlFetchApp.fetch(url, options);
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    console.log(`AppSheet API Response Code: ${responseCode}`);
    console.log(`AppSheet API Response Text: ${responseText}`);

    if (responseCode !== 200) 
    {
      throw new Error(`AppSheet API error: ${responseCode} - ${responseText}`);
    }

    try 
    {
      return JSON.parse(responseText);
    } 
    catch (error) 
    {
      console.error('Failed to parse JSON:', error);
      console.error('Response text that failed to parse:', responseText);
      throw new Error('Invalid JSON response from AppSheet API');
    }

  }

  formatDate(date) 
  {
    return Utilities.formatDate(date, "GMT+3", "MM-dd-yyyy");
  }
}