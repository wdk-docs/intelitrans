# 欢迎来到VS Code扩展

## 文件夹里有什么

- 此文件夹包含扩展所需的所有文件。
- `package.json` - 这是声明扩展名和命令的清单文件。
  - 示例插件注册一个命令并定义它的标题和命令名。有了这些信息，VS Code可以在命令面板中显示命令。它还不需要加载插件。
- `src/extension.ts` - 这是主文件，您将在其中提供命令的实现。
  - 该文件导出一个函数`activate`，它在您的扩展第一次被激活时被调用(在本例中通过执行命令)。在`activate`函数中，我们调用`registerCommand`。
  - 我们将包含命令实现的函数作为第二个参数传递给`registerCommand`。

## 设置

- 安装推荐的扩展 (amodio.tsl-problem-matcher 和 dbaeumer.vscode-eslint)

## 站起来，马上跑

- 按`F5`打开一个新的窗口与您的扩展加载。
- 运行你的命令从命令面板按下(`Ctrl+Shift+P`或`Cmd+Shift+P`在Mac上)，并键入`Hello World`。
- 在`src/extension.ts`中设置断点。这是调试您的扩展。
- 在调试控制台中找到来自扩展的输出。

## 做出改变

- 在修改了`src/extension.ts`中的代码后，你可以从调试工具栏中重新启动扩展。
- 你也可以重新加载(`Ctrl+R`或`Cmd+R`在Mac上)VS Code窗口与您的扩展来加载您的更改。

## 探索API

- 您可以在打开文件时打开我们的API的完整集合 `node_modules/@types/vscode/index.d.ts`.

## 运行测试

- 打开调试视图(Mac上为`Ctrl+Shift+D`或`Cmd+Shift+D`)，并从启动配置下拉选择`扩展测试`。
- 按`F5`在加载扩展的新窗口中运行测试。
- 在调试控制台中查看测试结果的输出。
- 修改`src/test/suite/extension.test`。或者在`test/suite`文件夹中创建新的测试文件。
  - 所提供的测试运行器将只考虑与名称模式`\*\*.test.ts`匹配的文件。
  - 您可以在`test`文件夹中创建文件夹，以任何您想要的方式构建测试。

## 走得更远

- 通过[捆绑扩展](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)减少扩展大小并改善启动时间.
- [发布你的扩展](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)在VS Code扩展市场。
- 通过设置[持续集成](https://code.visualstudio.com/api/working-with-extensions/continuous-integration)自动化构建。
