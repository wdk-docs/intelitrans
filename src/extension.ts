// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Translate } from "./translate";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let out: vscode.OutputChannel;
  let disposable = vscode.commands.registerCommand("extension.intelitrans", () => {
    if (!out) {
      out = vscode.window.createOutputChannel("智译");
      out.show();
    }
    new Translate(out).translate();
  });
  // 插入替换指令
  context.subscriptions.push(disposable);

  //   let disposable2 = vscode.commands.registerCommand("extension.translateReplace", () => {
  //     let editor: any = vscode.window.activeTextEditor;
  //     let selection = editor.selection;
  //     editor.edit((edit: any) => edit.replace(selection, translateResult));
  //   });

  //   context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
