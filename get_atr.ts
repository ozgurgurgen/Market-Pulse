import { calculateATR } from './server/signalEngine/indicators';

async function run() {
  const ticker = 'THYAO.IS';
  const period1 = Math.floor(new Date('2021-01-01').getTime() / 1000);
  const period2 = Math.floor(new Date('2022-01-01').getTime() / 1000);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${period1}&period2=${period2}`;
  
  const res = await fetch(url);
  const data = await res.json() as any;
  const result = data?.chart?.result?.[0];
  const timestamps = result?.timestamp;
  const quote = result?.indicators?.quote?.[0];
  
  if (timestamps) {
    const bars: any[] = [];
    for (let i = 0; i < timestamps.length; i++) {
        bars.push({
            date: new Date(timestamps[i] * 1000).toISOString().split('T')[0],
            high: quote.high[i],
            low: quote.low[i],
            close: quote.close[i]
        });
    }
    const highs = bars.map(b => b.high);
    const lows = bars.map(b => b.low);
    const closes = bars.map(b => b.close);
    
    const atrs = calculateATR(highs, lows, closes, 14);
    
    const targetDates = ['2021-03-31', '2021-06-30', '2021-09-30', '2021-12-31'];
    console.log("| Pencere | Tarih | THYAO ATR(14) |");
    console.log("| :--- | :--- | :--- |");
    for (let i = 0; i < bars.length; i++) {
        if (targetDates.includes(bars[i].date)) {
            const wName = targetDates.indexOf(bars[i].date) + 2; 
            console.log(`| W-${wName} | ${bars[i].date} | ${atrs[i]?.toFixed(3)} |`);
        }
    }
  }
}
run();
