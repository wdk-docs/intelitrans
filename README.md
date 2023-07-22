# 智译

vscode 翻译插件，第一版使用有道翻译

## 翻译

划词后，Mac 按 `command+'`, Windows 按 `Ctrl+'` 翻译并替换

> 提示: 在vscode菜单第一项点击 `首选项` -> `键盘快捷方式` -> 搜索框搜索 `@ext:wohugb.intelitrans`, 可以自定义快捷键

## 需求

需要到插件设置里，设置有道的 appSecret 和 appKey

## 设置

在扩展页面点击管理 齿轮 `⚙`,或者在菜单第一项点击 `首选项` -> `设置` -> 搜索框搜索 `@ext:wohugb.intelitrans`,然后设置以下选项

- `translate.youdao.appSecret`: 有道翻译应用 ID
- `translate.youdao.appKey`: 有道翻译应用密钥

以上选项值在 `有道智云·AI开放平台` 创建并获取: https://ai.youdao.com/console

## 关于输出

在划词替换同时也在输出栏里，输出翻译详情，包括请求信息和翻译结果，可以根据这些提示对翻译结果进行修正

## TODO

- 优化跟markdown语言的兼容性
- 或联系有道云翻译看能不能优化对markdown语言的支持

## 已知的问题

## 发布说明

### 1.0.1

完成初步设计

## 参考

- 有道翻译 [JavaHello/vscode-translate](https://github.com/JavaHello/vscode-**translate**)
- 划词替换 [jianzhichun/vscode-translate](https://github.com/jianzhichun/vscode-translate)
- 有道开发平台
  - 控制台：用于获取应用 ID 和密钥 https://ai.youdao.com/console
  - 文档：https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html
