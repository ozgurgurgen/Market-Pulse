const yfClass = require("yahoo-finance2").default;
yfClass.search("AAPL").then(res => console.log(res.quotes[0].symbol)).catch(console.error);
