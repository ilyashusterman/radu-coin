import * as React from "react";
import { messageHandler } from "@estruyf/vscode/dist/client";
import "./styles.css";
import AppBar from "./menu/AppBar";
import Dashboard from "./Dashboard";

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
      <AppBar />
      <Dashboard />
    </div>
  );
};
