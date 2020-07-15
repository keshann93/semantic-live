import * as vscode from 'vscode';
import * as path from 'path';

type SupportedFiletypes = 'html' | 'css' | 'javascript' | 'xhtml' | '';
const EXTENSION_ID = 'keshan.semantic-live';
const CUSTOM_CSS_PATH = 'resources/custom-style.css';

const cheerio = require('cheerio');
const PREFIX_LINK = 'qp';
const ATTRS = ['src', 'href'];

export default class Manager {
  // These are protected to allow unit test access because manager is extended
  protected activeEditor: vscode.TextEditor | undefined;
  protected panel: vscode.WebviewPanel;
  protected languageId: SupportedFiletypes = '';
  private _changedLinks = new Map<string, string>();

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
      if (document.languageId === 'html' || document.languageId === 'css' || document.languageId === 'javascript') {
        this.updateLinkData(document);
        this.parseFromActiveEditor();
      }
      // if (this.isAcceptableLaguage(document.languageId as SupportedFiletypes)) {
      //   this.parseFromActiveEditor();
      // }
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
      const activeFileContent = this.generateHTML();
      this.panel.webview.postMessage({
        type: 'activeBlock',
        payload: activeFileContent,
      });
    }
  }

  public generateHTML(): string {
    if (this.activeEditor) {
      let plainText: string = this.activeEditor.document.getText();
      let html = this.fixLinks(plainText);
      // translate url in style tag
      html = this.replaceUrlToVscodeResource(html, this.activeEditor.document.fileName);
      let changedHtmlContent = this.addChangedLinkContent(html);
      let htmlWithStyle = this.addStyles(changedHtmlContent);

      return htmlWithStyle;
    }
    return '';
  }

  private updateLinkData(document: vscode.TextDocument) {
    let editorData = {
      key: document.fileName,
      value: document.getText(),
    };
    this.setChangedLinks(editorData);
  }

  private setChangedLinks(data: any) {
    // translate image url as `url(./img/bg.png)`
    data.value = this.replaceUrlToVscodeResource(data.value, data.key);
    this._changedLinks.set(data.key, data.value);
  }
  // Thanks to Thomas Haakon Townsend for coming up with this regex
  private fixLinks(html: string): string {
    if (this.activeEditor) {
      let htmlFilePath: string = this.activeEditor.document.fileName;
      // return html;
      return html.replace(
        new RegExp(`((?:${ATTRS.join('|')})=[\'\"])((?!http|\\/).*?)([\'\"])`, 'gmi'),
        (subString: string, p1: string, p2: string, p3: string): string => {
          let fsPath = vscode.Uri.file(path.join(path.dirname(htmlFilePath), p2)).fsPath;

          let changedLinkPath = this._changedLinks.get(fsPath);
          if (changedLinkPath) {
            return [`${PREFIX_LINK}-${p1}`, fsPath, p3].join('');
          } else {
            return [p1, this.getVscodeResourcePath(p2, htmlFilePath), p3].join('');
          }
        }
      );
    }
    return '';
  }

  private getVscodeResourcePath(relativePath: string, hostFilePath: string): string {
    return vscode.Uri.file(path.join(path.dirname(hostFilePath), relativePath))
      .with({ scheme: 'vscode-resource' })
      .toString();
  }

  private replaceUrlToVscodeResource(content: string, hostFilePath: string): string {
    return content.replace(/url\((.*)\)/gim, (subString, p1) => {
      return this.replaceUrlHandler(subString, p1, hostFilePath);
    });
  }

  private replaceUrlHandler(subString: string, p1: string, hostFilePath: string): string {
    if ((p1.startsWith(`'`) && p1.endsWith(`'`)) || (p1.startsWith(`"`) && p1.endsWith(`"`))) {
      p1 = p1.substring(1, p1.length - 1);
    }
    if (p1.startsWith('http')) {
      return subString;
    }
    const vscodePath = this.getVscodeResourcePath(p1, hostFilePath);
    return subString.replace(p1, vscodePath);
  }

  private addChangedLinkContent(content: string): string {
    const $ = cheerio.load(content);
    ATTRS.forEach(value => {
      let linkAttr = `${PREFIX_LINK}-${value}`;
      let $changedLink = $(`[${linkAttr}]`);
      if ($changedLink.length != 0) {
        let fsPath = $changedLink.attr(linkAttr);
        if ($changedLink[0].name === 'link') {
          $changedLink.after(`
                    <style type="text/css">
                    ${this._changedLinks.get(fsPath)}
                    </style>`);
        } else {
          $changedLink.html(this._changedLinks.get(fsPath));
        }
      }
    });

    return $.html();
  }

  private addStyles(html: string): string {
    const extension: vscode.Extension<any> | undefined = vscode.extensions.getExtension(EXTENSION_ID);
    if (extension) {
      let extensionPath: string = extension.extensionPath;
      let style_path = vscode.Uri.file(`${extensionPath}/${CUSTOM_CSS_PATH}`);
      let styles: string = `<link href="${style_path.with({ scheme: 'vscode-resource' })}" rel="stylesheet" />`;
      return styles + html;
    }
    return '';
  }
}
