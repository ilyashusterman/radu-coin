import * as React from "react";
import "./Moeda.css";

interface MoedaProps {
  name: string;
  price: number;
  symbol: string;
  marketcap: number;
  volume: number;
  image: string;
  priceChange: number;
}

const Moeda: React.FC<MoedaProps> = ({
  name="",
  price=0,
  symbol= "",
  marketcap=0,
  volume=0,
  image="",
  priceChange=0
}) => {
  return (
    <div className="moeda-container">
      <div className="moeda-row">
        <div className="moeda">
          <img src={image} alt="crypto" />
          <h2>{name}</h2>
          <p className="moeda-symbol">{symbol}</p>
        </div>
        <div className="moeda-data">
          <p className="moeda-price">${price}</p>
          <p className="moeda-volume">${volume.toLocaleString()}</p>

          {priceChange < 0 ? (
            <p className="moeda-percent red">{priceChange.toFixed(2)}%</p>
          ) : (
            <p className="moeda-percent green">{priceChange.toFixed(2)}%</p>
          )}

          <p className="moeda-marketcap">
            Mkt Cap: ${marketcap.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Moeda;