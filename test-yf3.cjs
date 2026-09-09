const yfClass = require("yahoo-finance2").default;
const yf = new yfClass();
yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);
