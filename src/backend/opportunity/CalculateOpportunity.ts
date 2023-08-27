const ccxt = require("ccxt");
// Define the moving average periods
const shortPeriod = 10; // Short-term moving average
const longPeriod = 50; // Long-term moving average

// Function to calculate moving average
const calculateMovingAverage = (data: number[], period: number): number => {
  const sum = data.reduce((acc, value) => acc + value, 0);
  return sum / period;
};

// Function to calculate opportunities using Moving Average Crossover strategy
const calculateOpportunities = async (
  symbol: string,
  timeframe: string,
  limit: number,
  exchangeName: string = "binanceus"
): Promise<string> => {
  try {
    const exchange = new ccxt[exchangeName]({ enableRateLimit: true });
    const ohlcv = await exchange.fetchOHLCV(
      symbol,
      timeframe,
      undefined,
      limit
    );

    // Extract closing prices
    const closingPrices = ohlcv.map((data: any) => data[4]);

    // Calculate short-term moving average
    const shortMA = calculateMovingAverage(closingPrices, shortPeriod);

    // Calculate long-term moving average
    const longMA = calculateMovingAverage(closingPrices, longPeriod);

    // Identify opportunities based on crossover
    let opportunity: string;
    if (shortMA > longMA) {
      opportunity = "Buy";
    } else if (shortMA < longMA) {
      opportunity = "Sell";
    } else {
      opportunity = "No clear opportunity";
    }

    // Create opportunity object
    const opportunityObject = {
      symbol: symbol,
      timeframe: timeframe,
      opportunity: opportunity,
    };

    return JSON.stringify(opportunityObject);
  } catch (error: any) {
    throw new Error(`Error calculating opportunities: ${error.message}`);
  }
};

// Function to calculate opportunities for selected coins
export const calculateOpportunitiesForSelectedTickers = async (
  selectedTickers: string[],
  //   exchangeName: string = "bitstamp"

  exchangeName: string = "binanceus"
  //   exchangeName: string = "binanceusdm"
  //   exchangeName: string = "binancecoinm"
): Promise<string[]> => {
  try {
    const opportunities: string[] = [];

    const exchange = new ccxt[exchangeName]({ enableRateLimit: true });
    const tickers = await exchange.fetchTickers();
    const lastPrices = await exchange.פfetchLastPrices();
    const markets = await exchange.fetchMarkets();
    const history = await exchange.fetch;

    for (const ticker of selectedTickers) {
      const symbol = `${ticker}/USDT`;
      if (markets.some((market: any) => market.symbol === symbol)) {
        const opportunity = await calculateOpportunities(
          symbol,
          "1d",
          100,
          exchangeName
        );
        opportunities.push(opportunity);
      }
    }

    return opportunities;
  } catch (error: any) {
    throw new Error(
      `Error calculating opportunities for selected tickers: ${error.message}`
    );
  }
};
