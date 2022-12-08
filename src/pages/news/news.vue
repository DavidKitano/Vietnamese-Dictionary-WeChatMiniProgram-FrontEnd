<template>
  <view class="news">
    <view class="contentContainer" :wx-if="(!isLogin)">
      <view class="loginBtn" hover-class="loginBtnTapped" @tap="login">登&nbsp;&nbsp;&nbsp;录
      </view>
    </view>
    <view class="contentContainer" :wx-if="(isLogin)">
      <view class="header">
        <view class="headerInfoTitle">
          新闻一览
        </view>
        <view class="searchBtn" data-type="search">
          <image @tap="goToSearchNews" hover-stay-time="50" hover-class="wasTapped"
            src="../../static/images/svgs/search.svg" mode="scaleToFill">
          </image>
        </view>
      </view>
    </view>
    <view class="contentContainer" :wx-if="((isLogin) && !isHasContent)">
      <noContent></noContent>
    </view>
    <view class="contentContainer" :wx-if="((isLogin) && isHasContent)">
      <view v-for="nl in newsList" wx:key="id">
        <view class="newsContent" data-index="id">
          <newsBox @tap="goToNews(nl.id)">
            <view slot="title">{{ nl.title }}</view>
            <view slot="summary">{{ nl.summary }}</view>
            <view slot="category1">{{ nl.category1 }}</view>
            <view :wx-if="nl.category2" slot="category2">{{ nl.category2 }}</view>
            <view slot="pubTime">{{ nl.pubTime }}</view>
            <view slot="resources">
              <image alt="摘要图" hspace="5" vspace="5" :src="nl.resources[0]" mode="scaleToFill" class="resourceImg" />
            </view>
            <view slot="websiteName">{{ nl.websiteName }}</view>
          </newsBox>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
const userApi = require('../../utils/userApi.js');
const studyApi = require('../../utils/studyApi.js');
const newsApi = require('../../utils/newsApi.js');
const utils = require('../../utils/utils');

import noContent from "@/components/noContent/noContent.vue";
import newsBox from "@/components/news-box/news-box.vue";


export default {
  name: "news",
  components: { noContent, newsBox },
  props: {},
  data() {
    return {
      isLoading: false, // 节流阀
      isLogin: false,
      currentPage: 1,
      isHasContent: false,
      newsList: [
        {
          category1: "",
          category2: "",
          id: undefined,
          pubTime: undefined,
          resources: [
          ],
          summary: "",
          title: "",
          websiteName: ""
        },
      ],
      userInfo: {},
    }
  },
  computed: {},
  methods: {
    // 刷新状态
    flushStatus: async function (e) {
      let isLogin = app.globalData.isLogin;
      this.isLogin = isLogin;
      this.userInfo = app.globalData.userInfo;
      console.log("页面加载")
    },
    // 去登录页
    login: function (e) {
      // console.log("点击了登录，目前登录状态为" + this.isLogin);
      if (this.isLogin == false) {
        console.log("即将跳转到登录页");
        uni.navigateTo({
          url: '../../pages/login/login',
        })
      }
      else {
        uni.showToast({
          title: '非法操作，请清除缓存并重启小程序重试',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    },
    // 去新闻详情页
    goToNews: function (id, $event) {
      console.log("查看新闻", id)
      uni.navigateTo({
        url: '../../pages/news_detail/news_detail?id=' + id
      })
    },
    // 去新闻搜索页
    goToSearchNews: function (e) {
      // console.log("点击了搜索事件", e)
      if (!this.isLogin) {
        uni.showToast({
          title: "您还未登录",
          icon: "error",
          mask: true,
          duration: 1500
        })
      }
      else {
        uni.navigateTo({
          url: '../../pages/news_search/news_search',
        })
      }
    },
    // 获取新闻
    getNews: async function (page, size, t, $event) {
      let res = await newsApi.getNewsList(page, size, t);
      // console.log("获取新闻标准化后结果", res)
      if (res.msg == "操作成功") {
        if (res.data.length == 0) {
          this.isHasContent = false;
          return;
        }
        else {
          this.newsList = res.data;
          this.isHasContent = true;
          // console.log("获取后的新闻列表", this.newsList);
        }
      }
    },
    // 刷新新页面(加载新页面实际)
    flushLoadNewPage: async function (e) {
      const res = await newsApi.getNewsList(this.currentPage + 1, 10, uni.getStorageSync('token'));
      return res;
    },
    // 加载新页面
    loadNewPage: async function (e) {
      if (this.isLoading) {
        return;
      }
      let _this = this;
      if (this.isHasContent) {
        this.isLoading = true;
        let res = await this.flushLoadNewPage();
        if (res == "未登录或登录状态已失效") {
          _this.token = undefined;
          app.globalData.token = undefined;
          _this.isLogin = false;
          app.globalData.isLogin = false;
          setTimeout(function () {
            uni.showToast({
              title: '登录已失效',
              icon: 'error',
              mask: true
            })
          }, 1000)
          uni.reLaunch({
            url: '../login/login'
          })
        }
        // console.log(res);
        let result = res.data;
        console.log("触底刷新结果", result);
        // let result = res
        console.log("触底刷新结果长度", result.length);
        if (result.length == 0) {
          uni.showLoading({
            mask: true
          });
          setTimeout(function () {
            uni.hideLoading({
              noConflict: true
            });

            uni.showToast({
              mask: true,
              title: "没有其它结果啦~",
              icon: "success"
            });
          }, 1000)
          uni.hideToast();
          this.isLoading = false;
        }
        else {
          uni.showLoading({
            mask: true
          });
          setTimeout(function () {
            uni.hideLoading();
          }, 1000)
          this.currentPage++;
          console.log("上拉触底第" + this.currentPage + "页");
          this.isLoading = false;
          this.newsList = this.newsList.concat(result)
        }
      }
      else {
        uni.showLoading();
        this.isLoading = false;
        uni.hideLoading();
        return;
      }
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.getNews(this.currentPage, 10, uni.getStorageSync('token'));
    this.flushStatus();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() { },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() { },
  // 页面周期函数--监听页面隐藏
  onHide() {
    this.flushStatus();
  },
  // 页面周期函数--监听页面卸载
  onUnload() { },
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  onReachBottom(e) {
    if (this.isLogin) {
      this.loadNewPage();
    }
  },
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
} 
</script>

<style lang="less" scoped>
@import "../../pages/search/search.less";
@import "../../pages/news/news.less";
</style>