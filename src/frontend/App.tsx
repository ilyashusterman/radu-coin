import * as React from "react";
import { messageHandler } from "@estruyf/vscode/dist/client";
import "./styles.css";
import CoinStats from "./coins/CoinStats";

export interface IAppProps {}

export const App: React.FunctionComponent<
  IAppProps
> = ({}: React.PropsWithChildren<IAppProps>) => {
  const [message, setMessage] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  
  const requestWithErrorData = () => {
    messageHandler
      .request<string>("GET_DATA_ERROR")
      .then((msg) => {
        setMessage(msg);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <div className="app">
      <CoinStats />
      <div className="app__actions">
        <button onClick={requestWithErrorData}>Get data with error</button>
      </div>

      {message && (
        <p>
          <strong>Message from the extension</strong>: {message}
        </p>
      )}

      {error && (
        <p className="app__error">
          <strong>ERROR</strong>: {error}
        </p>
      )}
    </div>
  );
};
