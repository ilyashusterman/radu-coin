import * as React from "react";
import { useState, useEffect } from "react";
import { messageHandler } from "@estruyf/vscode/dist/client";

import "./AppBar.css";
import Settings from "./Settings";

const AppBar: React.FC = () => {
  const [moedas, setMoedas] = useState([]);
  const [search, setSearch] = useState("");
  const [preferredCoins, setPreferredCoins] = useState([]); // Array to store preferred coins
  const [showSettings, setShowSettings] = useState(false); // State to control showing settings

  const MAX_PREFERRED_COINS = 5; // Maximum number of preferred coins

  const setCoins = (data: any) => {
    setMoedas(data);
    setPreferredCoins(data.slice(0, MAX_PREFERRED_COINS));
  };

  const getCoins = async () => {
    const data: any = await messageHandler.request("getCoinsPrices", {});
    setCoins(data);
    return data;
  };

  const keyPressRef: any = React.useRef({});

  const handleKeyPress = async (event: any) => {
    const currentKeyPress = keyPressRef.current;

    if (currentKeyPress === "r" && event.key === "r") {
      console.log("Doing refresh");
      await getCoins();
    } else if (event.key === "r") {
      keyPressRef.current = event.key;
      setTimeout(() => {
        if (keyPressRef.current === "r") {
          console.log("Doing refresh");
          getCoins();
        }
        keyPressRef.current = null;
      }, 500);
    } else {
      keyPressRef.current = null;
    }
  };

  useEffect(() => {
    getCoins()
      .then((data) => {
        console.log("Added coins", data);
      })
      .catch((err) => console.log(err));
    // add event on key press double r to refresh of coins
    document.addEventListener("keypress", handleKeyPress);
  }, []);

  useEffect(() => {
    const displayMoedas = moedas.filter((moeda: any) => {
      if (search == "") {
        return true;
      }
      const name = moeda.name.toLowerCase();
      if (name.includes(search.toLowerCase())) {
        return true;
      }
      return false;
    });
    setPreferredCoins(displayMoedas.slice(0, MAX_PREFERRED_COINS));
  }, [search, moedas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <div className="moeda-app">
      <div className="preferred-coins">
        <div className="moeda-app-bar">
          <button
            className="settings-button"
            onClick={() => setShowSettings(!showSettings)} // Toggle show settings
          >
            Settings
          </button>
          <input
            className="moeda-input"
            type="text"
            onChange={handleChange}
            placeholder="Search for a coin"
          />
        </div>
        {preferredCoins.map((moeda: any) => (
          <div className="preferred-coin-box" key={moeda.id}>
            <img className="coin-image" src={moeda.image} alt={moeda.name} />
            <div className="coin-details">
              <p className="coin-symbol">{moeda.symbol}</p>
              <p className="coin-price">${moeda.current_price.toFixed(2)}</p>
              <p
                className={`coin-price-change ${
                  moeda.price_change_percentage_24h > 0
                    ? "positive"
                    : "negative"
                }`}
              >
                {moeda.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
      {showSettings && <Settings />}{" "}
    </div>
  );
};

export default AppBar;
