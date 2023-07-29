"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log('Congratulations, your extension "logparser" is now active!');
    // Log Parse command
    let cmd = vscode.commands.registerCommand('logparser.helloWorld', () => { parseLogs(); });
    context.subscriptions.push(cmd);
    // Log Parse window
    const provider = new LogParserPatternViewProvider();
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(LogParserPatternViewProvider.viewType, provider));
}
exports.activate = activate;
function parseLogs() {
    let te = vscode.window.activeTextEditor;
    if (te == undefined) {
        return;
    }
    te.edit(builder => {
        const doc = te.document;
        //builder.replace(new vscode.Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end), "Hello world!");
        let end = doc.lineCount - 1;
        for (let i = 0; i < doc.lineCount; i++) {
            builder.replace(doc.lineAt(i).range, String(i));
        }
    });
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
class LogParserPatternViewProvider {
    resolveWebviewView(webviewView, context, _token) {
        webviewView.webview.html = this._getHtml();
        this.view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true
        };
        // Register Parse command on button press
        webviewView.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'parse':
                    {
                        vscode.window.showErrorMessage("Received parse command");
                        break;
                    }
            }
        });
    }
    _getHtml() {
        // TODO Text input for regexp
        return `<!DOCTYPE html>
			<html lang="en">
			<body>
				<button class="parse-button" id="button">Parse</button>
                <script>
                    (function() {
                        const vscode = acquireVsCodeApi();
                        const button = document.getElementById("button")
                        button.addEventListener('click', () => {
                            vscode.postMessage({command: 'parse'})
                        });
                    }())
                </script>
			</body>
			</html>`;
    }
}
LogParserPatternViewProvider.viewType = 'logparser-pattern';
//# sourceMappingURL=extension.js.map