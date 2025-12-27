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
   * Базовый метод для выполнения запросов Find
   * @private
   */
  async _executeFindRequest(tableName, payload) 
  {
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

    console.log(`AppSheet API ${tableName} → Code: ${responseCode}, Length: ${responseText.length}`);

    console.log(`AppSheet API Response Text: ${responseText}`);


    if (responseCode !== 200) 
    {
      throw new Error(`AppSheet API error: ${responseCode} - ${responseText.substring(0, 200)}`);
    }

    try 
    {
      return JSON.parse(responseText);
    } 
    catch (error) 
    {
      console.error('Failed to parse JSON:', error.message);
      console.error('Response sample:', responseText.substring(0, 500));
      throw new Error('Invalid JSON response from AppSheet API');
    }
  }

  /**
   * Поиск по диапазону дат (существующий метод)
   */
  async findOrdersByDateRange(tableName, dateField, startDate, endDate) 
  {
/*    const payload = 
    {
      "Action": "Find",
      "Properties": 
      {
        "Locale": "ru-RU",
        "Selector": `Select(${tableName}[*], and([${dateField}] >= '${this.formatDate(startDate, "MM/dd/yyyy")}', [${dateField}] <= '${this.formatDate(endDate, "MM/dd/yyyy")}'))`
      },
      "Rows": []
    };
*/
    const payload = 
    {
      "Action": "Find",
      "Properties": 
      {
        "Locale": "ru-RU",
        "Selector": "Select(" + tableName + "[Row ID], and([" + dateField + "] >= '" + this.formatDate(startDate) + 
                                            "', [" + dateField + "] <= '" + this.formatDate(endDate) + "'))"
      },
      "Rows": []
    };

    return await this._executeFindRequest(tableName, payload);
  }

  /**
   * Новый метод: поиск по произвольному Selector
   */
  async findWithSelector(tableName, selector) 
  {
    const payload = 
    {
      "Action": "Find",
      "Properties": 
      {
        "Locale": "ru-RU",
        "Selector": selector
      },
      "Rows": []
    };

    return await this._executeFindRequest(tableName, payload);
  }

  /**
   * Получить все записи таблицы (без фильтра)
   */
  async findAll(tableName) 
  {
    const payload = 
    {
      "Action": "Find",
      "Properties": 
      {
        "Locale": "ru-RU"
      },
      "Rows": []
    };

    return await this._executeFindRequest(tableName, payload);
  }

  /**
   * Поиск по ID (для связей между таблицами)
   */
  async findByIds(tableName, ids, idField = '_RowNumber', batchSize = 1000) 
  {
    if (!ids || ids.length === 0) return [];
    
    // AppSheet ограничивает оператор $in ~50 значениями
    const batchSizeIds = 50;
    const batches = [];
    for (let i = 0; i < ids.length; i += batchSizeIds) 
    {
      batches.push(ids.slice(i, i + batchSizeIds));
    }

    let allResults = [];
    
    for (const batchIds of batches) 
    {
      const selector = `Select(${tableName}[*], [${idField}] in (${batchIds.map(id => `'${id}'`).join(', ')}))`;
      const batchResults = await this.findWithSelector(tableName, selector, batchSize);
      allResults = allResults.concat(batchResults);
      
      if (batches.length > 1) 
      {
        Utilities.sleep(100); // Пауза между запросами
      }
    }

    return allResults;
  }

  formatDate(date, format = "MM/dd/yyyy") 
  {
    return Utilities.formatDate(date, "GMT+3", format);
  }
}