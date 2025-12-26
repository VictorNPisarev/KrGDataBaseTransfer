// utils/DateUtils.js
class DateUtils 
{
    static formatForAppSheet(date)
    {
        return Utilities.formatDate(date, "GMT+3", "yyyy-MM-dd");
    }
    
    static isValidDate(date) 
    {
        return date instanceof Date && !isNaN(date);
    }
}