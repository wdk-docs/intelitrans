"use strict";
// http://api.fanyi.baidu.com/doc/21
import * as vscode from "vscode";
import * as crypto from "crypto";
import * as Qs from "qs";
import axios from "axios";
// Add a request interceptor
// axios.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     console.log(config);
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor
// axios.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     console.log(response);
//     return response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

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

export class Baidu {
  public static API_URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";
  appid: string = "";
  appSecret: string = "";
  // domain: string = "it";

  constructor() {
    let settings = vscode.workspace.getConfiguration();
    this.appSecret = settings.get("intelitrans.baidu.appSecret", "");
    this.appid = settings.get("intelitrans.baidu.appid", "");
    // this.domain = settings.get("intelitrans.baidu.domain", "");
    // eslint-disable-next-line curly
    if (!this.appSecret || !this.appid) vscode.window.showErrorMessage("需要配置有道翻译 appid 和 appSecret !");
  }

  public static errorCode: { [key: string]: string } = {
    "52000": "成功",
    "52001": "请求超时	重试",
    "52002": "系统错误	重试",
    "52003": "未授权用户	请检查您的appid是否正确，或者服务是否开通",
    "54000": "必填参数为空	请检查是否少传参数",
    "54001": "签名错误	请检查您的签名生成方法",
    "54003": "访问频率受限	请降低您的调用频率，或进行身份认证后切换为高级版/尊享版",
    "54004": "账户余额不足	请前往管理控制台为账户充值",
    "54005": "长query请求频繁	请降低长query的发送频率，3s后再试",
    "58000": "客户端IP非法	检查个人资料里填写的IP地址是否正确，可前往开发者信息-基本信息修改",
    "58001": "译文语言方向不支持	检查译文语言是否在语言列表里",
    "58002": "服务当前已关闭	请前往管理控制台开启服务",
    "90107": "认证未通过或未生效	请前往我的认证查看认证进度",
  };

  public static Lang: { [key: string]: string } = {
    zh: "中文",
    ja: "日文",
    en: "英文",
    ko: "韩文",
    fr: "法文",
    ru: "俄文",
    pt: "葡萄牙文",
    es: "西班牙文",
    vi: "越南文",
  };
  // domain 翻译领域类型 领域支持范围
  public static domainScope: { [key: string]: string } = {
    it: "信息技术领域",
    finance: "金融财经领域",
    machinery: "机械制造领域",
    senimed: "生物医药领域",
    novel: "网络文学领域",
    academic: "学术论文领域",
    aerospace: "航空航天领域",
    wiki: "人文社科领域",
    news: "新闻资讯领域",
    law: "法律法规领域",
    contract: "合同领域",
  };
  // 语种列表 源语言语种不确定时可设置为 auto，目标语言语种不可设置为 auto。但对于非常用语种，语种自动检测可能存在误差。
  public static languages = {
    auto: "自动检测",
    zh: "中文",
    en: "英文",
  };
  public static reqData = {
    q: "Hello World!",
    from: "en",
    to: "zh",
    // domain: "it",
    appid: "",
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
    let signStr = a.appid + a.q + a.salt + s; //+ a.domain
    a.sign = this.md5(signStr);
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
    Baidu.reqData.q = q; //TextFilter.filter(q);
    Baidu.reqData.salt = this.guid();
    Baidu.reqData.appid = this.appid;
    // Baidu.reqData.domain = this.domain;
    this.sign(Baidu.reqData, this.appSecret);
    try {
      let res = await axios.get(Baidu.API_URL, {
        params: Baidu.reqData,
        paramsSerializer: function (params: any) {
          return Qs.stringify(params);
        },
      });

      let { data, status, statusText, headers } = res;
      if (data.error_code) {
        let msg = Baidu.errorCode[data.error_code];
        return vscode.window.showErrorMessage(msg + ":" + data.error_msg);
      }
      let showMsg: string = "";
      showMsg += "原    文: " + Baidu.reqData.q;
      let translateResults = data.trans_result;
      showMsg += "\n翻译结果: ";
      for (let r of translateResults) {
        showMsg += r.dst;
      }
      let translateResult = translateResults[0] && translateResults[0].dst;
      // 转义markdown里的 code inline `foo`
      translateResult = translateResult.replace(/' (.*?) '/g, "`$1`");
      translateResult = translateResult.replace(/“(.*?)”/g, "`$1`");
      return { translateResult, showMsg };
    } catch (error: any) {
      vscode.window.showErrorMessage(`错误: ${error.message}`);
    }
  }
}
