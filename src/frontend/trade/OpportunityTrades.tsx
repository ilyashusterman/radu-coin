import React, { useState } from "react";
import "./OpportunityTrades.css";

const mockOpportunityTrades = [
  {
    id: 1,
    coin: "Bitcoin",
    action: "Buy",
    price: 40000,
    cleanProfit: 50,
    strategy: "Time to Buy",
    description: "Potential price dip",
    isActive: false,
    deltaTime: "in 1 hour", // Adding deltaTime
  },
  {
    id: 2,
    coin: "Ethereum",
    action: "Sell",
    price: 3000,
    cleanProfit: 25,
    strategy: "Time to Sell",
    description: "Potential price increase",
    isActive: true,
    deltaTime: "in 30 minutes", // Adding deltaTime
  },
  // Add more mock data as needed
];

interface OpportunityTrade {
  id: number;
  coin: string;
  action: string;
  price: number;
  cleanProfit: number;
  strategy: string;
  description: string;
  isActive: boolean;
  deltaTime: string; // Add deltaTime to the OpportunityTrade interface
}

interface OpportunityTradesProps {
  averageTradeDollars: number; // Add averageTradeDollars prop
}

const OpportunityTrades: React.FC<OpportunityTradesProps> = ({
  averageTradeDollars = 100,
}) => {
  const [opportunities, setOpportunities] = useState<OpportunityTrade[]>(
    mockOpportunityTrades
  );

  const toggleActivation = (id: number) => {
    const updatedOpportunities = opportunities.map((opp) =>
      opp.id === id ? { ...opp, isActive: !opp.isActive } : opp
    );
    setOpportunities(updatedOpportunities);
  };

  return (
    <div className="opportunity-trades-container">
      <h2>Opportunity Trades (UX mock data)</h2>
      <div className="opportunity-list">
        {opportunities.map((trade) => (
          <div
            className={`opportunity-item ${trade.isActive ? "active" : ""}`}
            key={trade.id}
          >
            <p className="coin-name">{trade.coin}</p>
            <p className={`action ${trade.action.toLowerCase()}`}>
              {trade.action}
            </p>
            <p className="coin-price">${trade.price.toFixed(2)}</p>
            <p className="clean-profit">{trade.cleanProfit}% Clean Profit</p>
            <p className="strategy">{trade.strategy}</p>
            <p className="description">{trade.description}</p>
            <p className="delta-time">{trade.deltaTime}</p>{" "}
            <p className="additional-info">
              If you put ${averageTradeDollars}, you could make $
              {(
                trade.price *
                (averageTradeDollars / 100) *
                trade.cleanProfit
              ).toFixed(2)}
            </p>
            <button
              className={`activate-button ${trade.isActive ? "active" : ""}`}
              onClick={() => toggleActivation(trade.id)}
            >
              {trade.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunityTrades;
