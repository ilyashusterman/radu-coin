import React, { useState } from "react";
import "./Settings.css";

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState("");

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSaveApiKey = () => {
    // You can save the apiKey using your preferred state management or storage mechanism
    console.log("API Key saved:", apiKey);
    // Reset the input field
    setApiKey("");
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <p>Enter your Binance Public API Key:</p>
      <input
        type="text"
        value={apiKey}
        onChange={handleApiKeyChange}
        className="api-key-input"
      />
      <button onClick={handleSaveApiKey} className="save-button">
        Save API Key
      </button>
    </div>
  );
};

export default Settings;
