// services/SummaryCalculator.js
class SummaryCalculator 
{
    calculate(orders) 
    {
        const groups = new Map();
        let totalWinAmount = 0;
        let totalWinSqrt = 0;
        let totalPlateAmount = 0;
        let totalPlateSqrt = 0;
        
        orders.forEach(order => 
        {
            const key = `${order.productionStatusId}`;
        
            if (!groups.has(key)) 
            {
                groups.set(key, {
                    productionStatusId: '111',//productionStatusId,
                    winAmount: 0,
                    winSqrt: 0,
                    plateAmount: 0,
                    plateSqrt: 0
                });
            }
            
            const group = groups.get(key);
            group.winAmount += Number(order.winAmount);
            group.winSqrt += Number(order.winSqrt);
            group.plateAmount += Number(order.plateAmount);
            group.plateSqrt += Number(order.plateSqrt);
            
            totalWinAmount += Number(order.winAmount);
            totalWinSqrt += Number(order.winSqrt);
            totalPlateAmount += Number(order.plateAmount);
            totalPlateSqrt += Number(order.plateSqrt);
        });
        
        // Преобразуем Map в массив и сортируем
        const summary = Array.from(groups.values()).sort((a, b) => {
            return a.productionStatusId.localeCompare(b.productionStatusId);
        });
        
        // Добавляем итоговую строку
        summary.push({
            productionStatusId: 'ИТОГО:',
            winAmount: totalWinAmount,
            winSqrt: totalWinSqrt,
            plateAmount: totalPlateAmount,
            plateSqrt: totalPlateSqrt
        });
        
        return summary;
    }
}