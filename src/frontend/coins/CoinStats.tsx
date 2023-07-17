import * as React from "react";
import { useState, useEffect } from "react";
import { messageHandler } from "@estruyf/vscode/dist/client";

import "./CoinStats.css";
import Moeda from "./Moeda";

const CoinStats: React.FC = () => {
  const [moedas, setMoedas] = useState([]);
  const [search, setSearch] = useState("");


const getCoins = async () => {
  const data: any = await  messageHandler
    .request("getCoinsPrices", { msg: "Hello from the webview" });
    setMoedas(data);
    return data;
};

  const keyPressRef = React.useRef('');
  const handleKeyPress = async (event: any) => {
    const currentKeyPress = keyPressRef.current;
    if (currentKeyPress === 'r' && event.key === 'r') {
      console.log('Doing refresh');
      await getCoins();
    }

    keyPressRef.current = event.key;
  };

  useEffect(() => {

    getCoins().then((data) => console.log('Added coins', data)).catch((err) => console.log(err));
      // add event on key press double r to refresh of coins

    document.addEventListener('keydown', handleKeyPress);

  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredMoedas = moedas.filter((moeda: any) =>
    moeda.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="moeda-app">
      <div className="moeda-search">
        <h1 className="moeda-text">Coin Stats</h1>
        <p className="moeda-text">press R+R to refresh</p>
        <form>
          <input
            className="moeda-input"
            type="text"
            onChange={handleChange}
            placeholder="Exemplo: Bitcoin Cash"
          />
        </form>
      </div>
      {filteredMoedas.map((moeda: any) => {
        return (
          <Moeda
            key={moeda.id}
            name={moeda.name}
            price={moeda.current_price}
            symbol={moeda.symbol}
            marketcap={moeda.total_volume}
            volume={moeda.market_cap}
            image={moeda.image}
            priceChange={moeda.price_change_percentage_24h}
          />
        );
      })}
    </div>
  );
};

export default CoinStats;