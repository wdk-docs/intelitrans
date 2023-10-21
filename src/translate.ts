/* eslint-disable curly */
"use strict";

import * as vscode from "vscode";
import { Youdao } from "./youdao";
import { Baidu } from "./baidu";

export class Translate {
  out: vscode.OutputChannel;
  appKey: string = "";
  appSecret: string = "";

  constructor(out: vscode.OutputChannel) {
    this.out = out;
  }

  async translate() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) return;
    let selection = editor.selection;
    let content = editor.document.getText(selection);
    let settings = vscode.workspace.getConfiguration();
    if (!content) return vscode.window.showErrorMessage("请选择内容");
    let platform = settings.get("intelitrans.api_platform", "");
    let data: any;
    switch (platform) {
      case "youdao":
        let youdao = new Youdao();
        data = await youdao.fy(content);
        break;
      case "baidu":
        let baidu = new Baidu();
        data = await baidu.fy(content);
        break;
    }
    if (data) {
      let { translateResult, showMsg } = data;
      editor.edit((edit: any) => edit.replace(selection, translateResult));
      this.out.clear();
      this.out.appendLine(showMsg);
    }
  }
}
