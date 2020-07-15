import * as vscode from 'vscode';

export type SupportedFiletypes = 'html' | '';
export default class Manager {
  // These are protected to allow unit test access because manager is extended
  protected activeEditor: vscode.TextEditor | undefined;
  protected panel: vscode.WebviewPanel;
  protected languageId: SupportedFiletypes = '';

  constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;

    vscode.window.onDidChangeActiveTextEditor(activeEditor => {
      const languageId = activeEditor ? activeEditor.document.languageId : undefined;

      if (languageId === 'html') {
        this.activeEditor = activeEditor;
        this.languageId = languageId;
      }
    });

    vscode.workspace.onDidChangeTextDocument(({ document }) => {
      if (this.isAcceptableLaguage(document.languageId as SupportedFiletypes)) {
        this.parseFromActiveEditor();
      }
    });

    vscode.window.onDidChangeTextEditorSelection(({ textEditor }) => {
      if (textEditor && this.isAcceptableLaguage(textEditor.document.languageId as SupportedFiletypes)) {
        this.activeEditor = textEditor;
        this.parseFromActiveEditor();
      }
    });
  }

  isAcceptableLaguage(languageId: SupportedFiletypes): boolean {
    return languageId === 'html';
  }

  parseFromActiveEditor(): void {
    if (this.activeEditor) {
      const activeFileContent = this.activeEditor.document.getText();
      this.panel.webview.postMessage({
        type: 'activeBlock',
        payload: activeFileContent,
      });
    }
  }
}
