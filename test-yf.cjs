const yf = require("yahoo-finance2").default;
yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);
