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

> 使用npm重新安装包，package.json里pnpm改为npm，否则报错

```sh
vsce package
```

## 发布

```sh
vsce publish
```

## token 过期更新

```
You're using an expired Personal Access Token, please get a new PAT.
More info: https://aka.ms/vscodepat
```

按照指引新建token并复制

```
vsce login [publisher]

Publisher '[publisher]' is already known
Do you want to overwrite its PAT? [y/N] y
https://marketplace.visualstudio.com/manage/publishers/
Personal Access Token for publisher '[publisher]': ****************************************************

The Personal Access Token verification succeeded for the publisher '[publisher]'.
```
