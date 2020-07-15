import * as vscode from 'vscode';
import ContentProvider from './ContentProvider';
import { join } from 'path';
import Manager from './Manager';

export function activate(context: vscode.ExtensionContext) {
  const contentProvider = new ContentProvider();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  let disposable = vscode.commands.registerCommand('semantic.showPanel', () => {
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Two);
    } else {
      currentPanel = vscode.window.createWebviewPanel('semantic', 'Semantic-live', vscode.ViewColumn.Two, {
        enableScripts: true,
        retainContextWhenHidden: true,
      });
    }

    currentPanel.webview.html = contentProvider.getContent(context);

    const root = join(context.extensionPath, 'icons');
    currentPanel.iconPath = {
      dark: vscode.Uri.file(join(root, 'icon-light.png')),
      light: vscode.Uri.file(join(root, 'icon-dark.png')),
    };

    const manager = new Manager(currentPanel);

    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined;
      },
      null,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
