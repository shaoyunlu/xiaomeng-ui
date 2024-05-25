# 欢迎使用 XiaoMeng-UI！

## 背景
做前端好多年了，总觉得也应该造一两个轮子了。那干脆就造个UI框架吧，本人小名叫小猛，所以框架名称就是本人小名的汉语拼音。

## 简介
XiaoMeng-UI 是一个基于 Vue 3 的现代化、轻量级、易于使用的 UI 框架，适合各级别开发者。

本框架结合了 Element UI Plus 的设计风格，提供了简化且清晰的编码体验，非常适合学习和创建复杂的网页应用。

## 在线文档
[在线文档](http://114.116.50.8:3100/)

## 核心特性
- **小而美**：除了vue3，依赖库只有一个dayjs。
- **轻而壮**：轻量级框架，但是该有的都有，稳定性也很好。
- **拿去改**：代码易读，很适合做二次修改。
- **无 TS**：原谅我放荡不羁爱自由。还是喜欢JS的洒脱。

## 安装
要安装此 UI 框架，您可以使用 npm，这是最简单的安装方式。只需打开您的终端并执行以下命令：

```bash
npm install xiaomeng-ui
```

## 项目中使用
```bash
......
import register from 'xiaomeng-vue-ui'
import 'xiaomeng-vue-ui/dist/xmv-ui.css'
const app = createApp(App)
app.use(register)
......
```
