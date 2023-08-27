const ccxt = require("ccxt");

export async function getCoinsAndOrderBook(
  exchangeName: string,
  symbol: string
): Promise<void> {
  const exchange = new ccxt[exchangeName]({ enableRateLimit: true });

  // Markets data
  const markets = await exchange.fetchMarkets();
  console.log("Total number of markets: ", Object.keys(markets).length);

  // Currencies
  const currencies = await exchange.fetchCurrencies();
  console.log("Currencies: ", JSON.stringify(currencies));

  // Order book data
  const orderbook = await exchange.fetchOrderBook(symbol);
  // Order book data
  const tickers = await exchange.fetchTickers();
  const data = await exchange.fetchOHLCV(symbol);
  // const data = await exchange.(symbol);
  console.log("Order book ", data);
}
