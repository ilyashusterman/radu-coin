import React from "react";
import "./Dashboard.css";
import OpportunityTrades from "./trade/OpportunityTrades";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <OpportunityTrades averageTradeDollars={100} />
      {/* Add the OpportunityTrades component */}
    </div>
  );
};

export default Dashboard;
