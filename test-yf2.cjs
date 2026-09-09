const { YahooFinance } = require("yahoo-finance2");
const yf = new YahooFinance();
yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);
