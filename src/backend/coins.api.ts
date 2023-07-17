import * as vscode from "vscode";
import axios from "axios";

export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: null;
    last_updated: string;
  }
  export const getCoinsPrices = async (context:vscode.ExtensionContext) => {
    const response = await axios.get(
      'https://api.coincap.io/v2/assets'
    );
    const allCoins = response.data.data;
    let coinImages: any = context.globalState.get('coinImageCache');
    if (coinImages === null || coinImages === undefined) {

      try {
        const { data } = await axios.get<CoinData[]>(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        coinImages = data.reduce((acc: any, { id, image }) => {
          acc[id] = image;
          return acc;
        }, {});
        context.globalState.update('coinImageCache', coinImages);
        context.globalState.update('coinImageCacheTest', data);
      } catch (e) {
        console.log(e);
      }
    }
    // all coins to CoinData
    const coins = allCoins.map((coin: any) => {
      const { id, symbol, name, priceUsd, changePercent24Hr, marketCapUsd, volumeUsd24Hr, vwap24Hr, explorer } = coin;
      const image = coinImages.hasOwnProperty(id) ? coinImages[id] : null;
      return {
        id,
        name,
        symbol,
        image,
        current_price: Number(priceUsd),
        roi: null,
        market_cap: Number(marketCapUsd),
        market_cap_rank: 0,
        fully_diluted_valuation: 0,
        total_volume: Number(volumeUsd24Hr),
        high_24h: 0,
        low_24h: 0,
        price_change_24h: 0,
        price_change_percentage_24h: Number(changePercent24Hr),
        market_cap_change_24h: 0,
        market_cap_change_percentage_24h: 0,
        circulating_supply: 0,
        total_supply: 0,
        max_supply: 0,
        ath: 0,
        ath_change_percentage: 0,
        ath_date: '',
        atl: 0,
        atl_change_percentage: 0,
        atl_date: '',
        last_updated: '',
        vwap24Hr,
        explorer
      };
    });
    return coins;
  };