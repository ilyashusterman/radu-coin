// eslint-disable-next
import * as vscode from "vscode";
import got from "got";
const ccxt = require("ccxt");

const TOTAL_SECONDS_COINS_IMAGES = 3600;
const COIN_GECKO_API_VERSION = "https://api.coingecko.com";
export interface CoinData {
  id: string;
  image: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const getSymbolImages = async () => {
  const data: any = await got(
    `${COIN_GECKO_API_VERSION}/api/v3/coins/markets`,
    {
      searchParams: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 300,
        page: 1,
        sparkline: false,
        precision: 3,
      },
    }
  ).json();
  return data.reduce((acc: any, { id, image, symbol }: CoinData) => {
    acc[id] = image;
    acc[symbol.toUpperCase()] = image;
    return acc;
  }, {});
};

interface Ticker {
  symbol: string;
  close: number;
  previousClose: number;
  change: number;
  percentage: number;
  info: any;
}
export const getTickers = async (
  exchangeName: string = "binanceus"
): Promise<CoinData[]> => {
  const exchange = new ccxt[exchangeName]({ enableRateLimit: true });
  const tickers: Record<string, Ticker> = await exchange.fetchTickers();
  return Object.values(tickers).reduce(
    (acc: any, { symbol, close, change, previousClose, percentage, info }) => {
      if (!symbol.endsWith("/USD")) {
        return acc;
      }
      if (close === undefined) {
        close = previousClose;
      }
      if (percentage === undefined) {
        percentage = Number(info.priceChangePercent);
      }
      const name = symbol.replace("/USD", "");
      const ticker: CoinData = {
        name,
        id: name,
        image: "",
        symbol: name,
        current_price: close,
        price_change_percentage_24h: percentage,
      };
      return [...acc, ticker];
    },
    []
  );
};

export const getCoinsPrices = async (context: vscode.ExtensionContext) => {
  const coins = await getTickers();
  setimageCoinsCacheTime(context);
  let coinImages: any = context.globalState.get("coinImageCache", {});
  if (Object.values(coinImages).length === 0) {
    try {
      coinImages = await getSymbolImages();
      context.globalState.update("coinImageCache", coinImages);
    } catch (e) {
      console.log(e);
    }
  }
  return coins.map((coin: CoinData) => {
    const image = coinImages[coin.id] || null;
    return {
      ...coin,
      image,
    };
  });
};

const setimageCoinsCacheTime = (context: vscode.ExtensionContext) => {
  const time = new Date().getTime();
  let cacheImagesTime = context.globalState.get(
    "lastTimeCoinImageCache",
    undefined
  );
  if (
    cacheImagesTime === undefined ||
    (cacheImagesTime - time) / 1000 > TOTAL_SECONDS_COINS_IMAGES
  ) {
    context.globalState.update("coinImageCache", {});
    context.globalState.update("lastTimeCoinImageCache", time);
  }
};
