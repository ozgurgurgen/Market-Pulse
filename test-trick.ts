import yfAny from 'yahoo-finance2';
const YFClass = (yfAny as any).default || yfAny;
const yf = new YFClass({ suppressNotices: ['yahooSurvey'] });
yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);
