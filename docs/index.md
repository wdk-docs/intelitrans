## 如何替换选择文本

```ts
import * as vscode from "vscode";
let editor = vscode.window.activeTextEditor;
let selection = editor.selection;
let content = editor.document.getText(selection);
let translateResult = await this.fy(content);
// 当前编辑区编辑功能替换翻译内容
editor.edit((edit: any) => edit.replace(selection, translateResult[0]));
```

## 如何调试变量

`F5` 启动编译后，在需要打印变量的地方打断点，在`调试控制台`里就可以看到变量的值

## 如何打包

## 如何编译