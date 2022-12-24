# 越南语词典 - 微信小程序(纯前端/打包前)

> @author David Kitano
>
> @date 2022/11/29
>
> ----
>
> 本仓库内代码为**未经过Vite**打包转换等操作的源代码
>
> 运行请注意使用 `npm run dev:mp-weixin`
>

<br>

## TO-DO LIST

> * 防抖
> * 学习页的功能
> * 更规范的封装和复用

## 基本介绍

> 参考&nbsp;[*学不会单词 (UnlearnableWord) by Mint-green*](https://github.com/Mint-green/UnlearnableWord)&nbsp;的样式和部分功能创作的一款越南语学习微信小程序<del>，换句话说也有点<strong>不背单词</strong>APP的意思了</del>
>
* 使用 *Uniapp* + *Vite* + *Vue3.0* (+ *uCharts* + 部分原生小程序代码段) 重构开发
* 部分代码定向支持微信小程序客户端（如 部分代码段使用了微信原生小程序、使用专门为微信小程序封装的Promise化等）
* 功能大改，后端从云函数转为request后端域名API （后台项目跳转：[*后台项目*](https://github.com/wzf0125/vi-backend/tree/main)]）
* 音声调用来自谷歌翻译API

## 素材来源

* 数据来源来自就读学校中某项目，用于学习使用，不公开
* 部分原创，使用请标注
* 部分来自网络表情包
* 矢量图标来自&nbsp;[*iconfont - 阿里巴巴矢量图标库*](https://www.iconfont.cn/)

## 模块及结构

(编写中)

## 杂谈

本来导入了Vant，结果Vant好难用，而且好像也没办法正常使用

然后想试试ElementPlus，结果给Vite写配置又不是很会导致El-xx元素一直无法正常使用（现在还有一些配置的痕迹）

在使用矢量图的时候想到了[FontAwesome](https://fontawesome.com/start)（~~不是百度搜出来的那个老旧盗版(?)~~），引用之后发现不太合适，小程序本质上也不能引用外部网页链接的JavaScript

最后还在想让`wx.login()`尽量Promise化（官方文档不支持，尝试用其它方法），结果浪费了一万年，我的悲惨人生就此开始
