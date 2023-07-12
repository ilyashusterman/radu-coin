// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { MessageHandlerData } from "@estruyf/vscode";
import * as jsonfile from "jsonfile";
import * as path from "path";
import { join } from "path";
import * as vscode from "vscode";

import { Webview } from "vscode";

export interface ApplicationExtensionSchema {
  title: string;
  base: string;
  command: string;
}
export const getAppExtensionSchema = ({ title, path }: any) => {
  const baseAppPath = path.replace(/\/+$/, "").replace(" ", ".");
  return {
    title: title,
    base: baseAppPath,
    command: `${baseAppPath}.openWebView`,
  } as ApplicationExtensionSchema;
};

export const createApplicationInstance = (
  appSchema: ApplicationExtensionSchema
) => {
  return vscode.window.createWebviewPanel(
    appSchema.base,
    appSchema.title,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );
};
export interface ExtensionRequest {
  payload: any;
  path: string;
  id: string;
}
export type ExtensionRouteFunction = (
  req: ExtensionRequest,
  res: ExtensionResponse
) => any;

interface ExtensionRoute {
  path: string;
  callback: ExtensionRouteFunction;
}
export interface ExtensionResponse {
  send: (data: any) => void;
}
interface ExtensionHandlerInput {
  webview: Webview;
  command: string;
  requestId: string;
}

export type Routes = {
  [key: string]: ExtensionRouteFunction;
};

export class ExtensionRouteHandler {
  public appSchema: ApplicationExtensionSchema;
  public routes: Routes;
  constructor(title: string, path: string) {
    this.appSchema = getAppExtensionSchema({ title, path });
    this.routes = {};
    this.registerJSONAppExtension();
  }
  registerJSONAppExtension() {
    // Read the package.json file
    const packageJsonFile = join(__dirname, "..", "package.json");
    const packageJson = jsonfile.readFileSync(packageJsonFile);
    const command = `onCommand:${this.appSchema.command}`;
    if (packageJson.activationEvents.includes(command)) {
      return true;
    }
    packageJson.activationEvents = [...packageJson.activationEvents, command];
    packageJson.contributes.commands.push({
      command: this.appSchema.command,
      title: this.appSchema.title,
    });
    // Save the modified package.json
    jsonfile.writeFileSync("package.json", packageJson, { spaces: 2 });
  }
  addRoute(route: ExtensionRoute): ExtensionRouteHandler;
  addRoute(
    path: string,
    callback: ExtensionRouteFunction
  ): ExtensionRouteHandler;
  addRoute(
    routeOrPath: ExtensionRoute | string,
    callback?: ExtensionRouteFunction
  ): ExtensionRouteHandler {
    let route: ExtensionRoute;
    if (typeof routeOrPath === "string" && callback) {
      route = { path: routeOrPath, callback };
    } else {
      route = routeOrPath as ExtensionRoute;
    }

    this.routes[route.path] = route.callback;
    return this;
  }
}
export const getExtensionResponse = ({
  webview,
  command,
  requestId,
}: ExtensionHandlerInput) => {
  return {
    send(data: any): void {
      webview.postMessage({
        command,
        requestId,
        payload: data,
      } as MessageHandlerData<string>);
    },
  } as ExtensionResponse;
};

export const addRouteHandlers = (
  panel: vscode.WebviewPanel,
  appRoutes: Routes,
  subscriptions: Array<vscode.Disposable>
) => {
  panel.webview.onDidReceiveMessage(
    (message) => {
      const { command, requestId, payload } = message;
      const routeKey = Object.keys(appRoutes).find((path) => path === command);
      // if route not found post error message
      if (!routeKey) {
        panel.webview.postMessage({
          command,
          requestId,
          error: `Route ${command} not found!`,
        } as MessageHandlerData<string>);
        return;
      }

      const routeCallback: ExtensionRouteFunction = appRoutes[command];
      const response: ExtensionResponse = getExtensionResponse({
        webview: panel.webview,
        command,
        requestId,
      });
      routeCallback(
        {
          path: command,
          id: requestId,
          payload: payload,
        } as ExtensionRequest,
        response
      );
    },
    undefined,
    subscriptions
  );
};
