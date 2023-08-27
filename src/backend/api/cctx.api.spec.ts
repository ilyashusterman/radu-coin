const { getCoinsAndOrderBook } = require("./cctx");

// run npx jest src/backend/api/cctx.spec.ts
describe("getCoinsAndOrderBook", () => {
  it("should fetch coins and order book data", async () => {
    const exchangeName = "bitstamp";
    const symbol = "BTC/USD";
    const result = await getCoinsAndOrderBook(exchangeName, symbol);
    console.log(result);
  });
});
