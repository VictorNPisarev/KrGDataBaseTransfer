function onEdit(e) 
{
    // Быстрая проверка, чтобы не запускаться на каждом редактировании
    const sheet = e.range.getSheet();
    if (sheet.getName() !== Constants.SHEET_NAMES.DATE_FILTER) 
    {
        return;
    }

    // Проверяем, что редактируется колонка A или B и есть дата
    if (e.range.getColumn() <= 3 || e.range.getRow() < 2) 
    {
        return;
    }

    // Запускаем расчет асинхронно (чтобы не превысить лимит времени триггера)
    setTimeout(calculateSummary, 100);
}

// entry-points/manualRun.js
function calculateSummary() 
{
    try 
    {
        const orchestrator = new SummaryOrchestrator();
        const result = orchestrator.execute();
        
        // Можно отправить уведомление
        if (result.success) 
        {
            console.log(`✅ Рассчитано: ${result.ordersCount} заказов`);
        }
        
        return result;
    } 
    catch (error) 
    {
        console.error('❌ Ошибка:', error);
        throw error;
    }
}

function testCalculation() 
{
    // Для ручного тестирования
    return calculateSummary();
}