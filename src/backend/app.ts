// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { join } from "path";
import * as vscode from "vscode";
import { ExtensionContext, ExtensionMode, Uri, Webview } from "vscode";
import {
  ExtensionRequest,
  ExtensionResponse,
  ExtensionRouteHandler,
  addRouteHandlers,
  createApplicationInstance,
} from "./infrastructure/extention";

export function activate(context: vscode.ExtensionContext) {
  const coinsApp: ExtensionRouteHandler = new ExtensionRouteHandler(
    "PlovCoin Main",
    "PlovCoin.Main"
  );
  coinsApp.addRoute(
    "getData",
    (req: ExtensionRequest, res: ExtensionResponse) => {
      const data = { close: [1, 2] };
      console.log(req);
      res.send(data);
    }
  );
  coinsApp.addRoute(
    "GET_DATA",
    (req: ExtensionRequest, res: ExtensionResponse) => {
      res.send("Hello from the extension!");
    }
  );
  coinsApp.addRoute(
    "GET_DATA_ERROR",
    (req: ExtensionRequest, res: ExtensionResponse) => {
      res.send("Oops, something went wrong!");
    }
  );
  coinsApp.addRoute(
    "POST_DATA",
    (req: ExtensionRequest, res: ExtensionResponse) => {
      vscode.window.showInformationMessage(
        `Received data from the webview: ${req.payload.msg}`
      );
    }
  );
  let disposable = vscode.commands.registerCommand(
    coinsApp.appSchema.command,
    () => {
      const panel = createApplicationInstance(coinsApp.appSchema);
      const routes = coinsApp.routes;
      addRouteHandlers(panel, routes, context.subscriptions);
      panel.webview.html = getWebviewContent(context, panel.webview);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

const getWebviewContent = (context: ExtensionContext, webview: Webview) => {
  const jsFile = "webview.js";
  const localServerUrl = "http://localhost:9000";

  let scriptUrl = null;
  let cssUrl = null;

  const isProduction = context.extensionMode === ExtensionMode.Production;
  if (isProduction) {
    scriptUrl = webview
      .asWebviewUri(Uri.file(join(context.extensionPath, "dist", jsFile)))
      .toString();
  } else {
    scriptUrl = `${localServerUrl}/${jsFile}`;
  }

  return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		${isProduction ? `<link href="${cssUrl}" rel="stylesheet">` : ""}
	</head>
	<body>
		<div id="root"></div>

		<script src="${scriptUrl}" />
	</body>
	</html>`;
};