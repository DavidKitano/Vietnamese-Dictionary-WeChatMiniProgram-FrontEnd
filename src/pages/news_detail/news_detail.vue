<template>
  <scroll-view class="news_detail">
    <view class="contentContainer">
      <view class="contentTitle">{{ newsInfo.title }}</view>
      <view class="split"></view>
      <image class="favImage" :wx-if="!newsInfo.isFavorite" @tap="addFavorite"
        src="../../static/images/svgs/star-black.svg" mode="scaleToFill" />
      <image class="favImage" :wx-if="newsInfo.isFavorite" @tap="removeFavorite"
        src="../../static/images/svgs/star-red.svg" mode="scaleToFill" />
      <view class="split"></view>
      <view class="contentSubProperties">
        <view>发布时间&nbsp;|&nbsp;{{ newsInfo.pubTime }}</view>
      </view>
      <view class="contentSubProperties">
        <view>标签&nbsp;|&nbsp;</view>
        <view>{{ newsInfo.category1 }}</view>
        <view :wx-if="newsInfo.category2">{{ newsInfo.category2 }}</view>
      </view>
      <view class="contentSubProperties">
        <view>来源&nbsp;|&nbsp;{{ newsInfo.requestUrl }}</view>
      </view>
      <view class="split"></view>
      <view class="contentSummary">
        <view class="columnTitle">摘要</view>
        <view>{{ newsInfo.summary }}</view>
      </view>
      <view class="split"></view>
      <view v-for="r in newsInfo.resources" wx:key="id">
        <view class="imgContent" data-index="id">
          <image alt="摘要图" :src="r" mode="scaleToFill" />
        </view>
      </view>
      <view class="contentBody">
        <view class="columnTitle">正文</view>
        <view>{{ newsInfo.body }}</view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
const app = getApp();
const userApi = require('../../utils/userApi.js');
const newsApi = require('../../utils/newsApi.js');
const utils = require('../../utils/utils');

export default {
  name: "newsDetail",
  components: {},
  props: {},
  data() {
    return {
      isLogin: false,
      newsId: undefined,
      newsInfo: {
        isFavorite: false,
        body: "加载中",
        category1: "加载中",
        category2: "加载中",
        id: undefined,
        pubTime: "加载中",
        resources: [
        ],
        responseUrl: "加载中",
        summary: "加载中",
        title: "加载中",
        websiteUrl: "加载中"
      }
    }
  },
  computed: {},
  methods: {
    // 刷新状态
    flushStatus: function (e) {
      let isLogin = app.globalData.isLogin;
      this.isLogin = isLogin;
      this.getNews();
    },
    // 获得新闻详情
    getNews: async function (e) {
      if (this.isLogin) {
        const res = await newsApi.getNews(this.newsId, uni.getStorageSync('token'));
        if (res == "未登录或登录状态已失效") {
          this.token = undefined;
          app.globalData.token = undefined;
          this.isLogin = false;
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
        if (res.msg == "操作成功") {
          this.newsInfo = res.data;
        }
        else {
          if (typeof res == "object") {
            uni.showToast({
              icon: "none",
              duration: 1500,
              title: res.msg
            })
          }
          else {
            uni.showToast({
              icon: "none",
              duration: 1500,
              title: res
            })
          }
        }
      }
      return;
    },
    // 添加新闻收藏
    addFavorite: async function (e) {
      const res = await newsApi.addFavoriteNews(this.newsId, uni.getStorageSync("token"));
      if (res == "未登录或登录状态已失效") {
        this.token = undefined;
        app.globalData.token = undefined;
        this.isLogin = false;
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
      if (res.msg == "操作成功" || res == "操作成功") {
        uni.showLoading({
          mask: true
        })
        this.newsInfo.isFavorite = true;
        setTimeout(function () {
          uni.hideLoading({
            onConflict: true
          });
        }, 500);
      } else {
        uni.showToast({
          title: res,
          icon: 'error',
          mask: true
        })
      }
    },
    // 移除收藏
    removeFavorite: async function (e) {
      const res = await newsApi.removeFavoriteNews(this.newsId, uni.getStorageSync("token"));
      if (res == "未登录或登录状态已失效") {
        this.token = undefined;
        app.globalData.token = undefined;
        this.isLogin = false;
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
      if (res.msg == "操作成功" || res == "操作成功") {
        this.newsInfo.isFavorite = false;
        uni.showLoading({
          mask: true
        })
        setTimeout(function () {
          uni.hideLoading({
            onConflict: true
          })
        }, 500)
      } else {
        uni.showToast({
          title: res,
          icon: 'error',
          mask: true
        })
      }
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(options) {
    this.newsId = options.id;
    this.flushStatus();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() { },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() { },
  // 页面周期函数--监听页面隐藏
  onHide() { },
  // 页面周期函数--监听页面卸载
  onUnload() { },
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
} 
</script>

<style lang="less" scoped>
@import '../news_detail/news_detail.less';
</style>