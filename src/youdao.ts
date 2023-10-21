"use strict";

import * as vscode from "vscode";
import * as crypto from "crypto";
import * as Qs from "qs";
import axios from "axios";

class TextFilter {
  public static COMPILE: RegExp = /[A-Z]{1}[a-z]+/g;
  public static COMPILE_CHAR: RegExp = /[-_\n\r\t*]/g;
  public static COMPILE_SPAN: RegExp = /[\ ]+/g;

  public static filter(q: string): string {
    q = q.replace(TextFilter.COMPILE, (e) => {
      return " " + e;
    });
    q = q.replace(TextFilter.COMPILE_CHAR, " ");
    q = q.replace(TextFilter.COMPILE_SPAN, " ");
    return q;
  }
}

export class Youdao {
  public static API_URL = "http://openapi.youdao.com/api";
  appKey: string = "";
  appSecret: string = "";

  constructor() {
    let settings = vscode.workspace.getConfiguration();
    this.appSecret = settings.get("intelitrans.youdao.appSecret", "");
    this.appKey = settings.get("intelitrans.youdao.appKey", "");
    // eslint-disable-next-line curly
    if (!this.appSecret || !this.appKey) vscode.window.showErrorMessage("需要配置有道翻译 appKey 和 appSecret !");
  }

  public static ErrorCode: { [key: string]: string } = {
    "101": "缺少必填的参数",
    "102": "不支持的语言类型",
    "103": "翻译文本过长",
    "104": "不支持的API类型",
    "105": "不支持的签名类型",
    "106": "不支持的响应类型",
    "107": "不支持的传输加密类型",
    "108": "appKey无效",
    "109": "batchLog格式不正确",
    "110": "无相关服务的有效实例",
    "111": "开发者账号无效",
    "113": "q不能为空",
    "201": "解密失败，可能为DES,BASE64,URLDecode的错误",
    "202": "签名检验失败",
    "203": "访问IP地址不在可访问IP列表",
    "205": "请求的接口与应用的平台类型不一致",
    "301": "辞典查询失败",
    "302": "翻译查询失败",
    "303": "服务端的其它异常",
    "401": "账户已经欠费",
    "411": "访问频率受限,请稍后访问",
    "412": "长请求过于频繁，请稍后访问",
  };

  public static Lang: { [key: string]: string } = {
    "zh-CHS": "中文",
    ja: "日文",
    EN: "英文",
    ko: "韩文",
    fr: "法文",
    ru: "俄文",
    pt: "葡萄牙文",
    es: "西班牙文",
    vi: "越南文",
  };

  public static ReqData = {
    q: "Hello World!",
    from: Youdao.Lang.EN,
    to: Youdao.Lang["zh-CHS"],
    appKey: "",
    salt: "",
    sign: "",
  };

  md5(content: string): string {
    let md5 = crypto.createHash("md5");
    md5.update(content);
    let req = md5.digest("hex");
    return req;
  }
  sign(a: { [key: string]: string }, s: string) {
    let signStr = a.appKey + a.q + a.salt + s;
    a.sign = this.md5(signStr).toUpperCase();
  }

  guid(): string {
    let a = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0;
      let v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return a;
  }

  async fy(q: string) {
    Youdao.ReqData.q = q; //TextFilter.filter(q);
    Youdao.ReqData.salt = this.guid();
    Youdao.ReqData.appKey = this.appKey;
    this.sign(Youdao.ReqData, this.appSecret);
    try {
      let res = await axios.get(Youdao.API_URL, {
        params: Youdao.ReqData,
        paramsSerializer: function (params: any) {
          return Qs.stringify(params);
        },
      });
      let { data, status, statusText, headers } = res;
      if (data.errorCode !== "0") {
        let msg = Youdao.ErrorCode[data.errorCode];
        data.errorMsg = msg !== undefined ? msg : "";
        vscode.window.showErrorMessage(data.errorMsg);
      } else {
        let showMsg: string = "";
        showMsg += "原    文: " + Youdao.ReqData.q;
        let translateResults = data.translation;
        showMsg += "\n翻译结果: " + translateResults;
        showMsg += "\n词    义: ";
        for (let v in data.web) {
          showMsg += "\n    " + data.web[v].key + ": " + data.web[v].value;
        }
        let translateResult = translateResults[0];
        // 转义markdown里的 code inline `foo`
        translateResult = translateResult.replace(/' (.*?) '/g, "`$1`");
        translateResult = translateResult.replace(/“(.*?)”/g, "`$1`");
        return { translateResult, showMsg };
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`错误: ${error.message}`);
    }
  }
}
