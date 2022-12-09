<template>
  <view class="favorite">
    <view class="container" :wx-if="(!isLogin)">
      <view class="loginBtn" hover-stay-time="100" hover-class="loginBtnTapped" @tap="login">
        登&nbsp;&nbsp;&nbsp;录
      </view>
    </view>
    <view class="container">
      <view class="contentTitle">我的收藏</view>
      <view class="split"></view>
      <view class="contentTab">
        <view class="contentTabContent" :wx-if="(pageType == 0)">
          <image src="../../static/images/tab-learn-007BFF.png" mode="scaleToFill" />
          <view class="contentTabTitleActivated">单词</view>
        </view>
        <view class="contentTabContent" @tap="switchTab" :wx-if="(pageType == 1)">
          <image src="../../static/images/tab-learn-A6D6FA.png" mode="scaleToFill" />
          <view class="contentTabTitle">单词</view>
        </view>
        <view class="split2"></view>
        <view class="contentTabContent" :wx-if="(pageType == 1)">
          <image src="../../static/images/tab-news-007BFF.png" mode="scaleToFill" />
          <view class="contentTabTitleActivated">新闻</view>
        </view>
        <view class="contentTabContent" @tap="switchTab" :wx-if="(pageType == 0)">
          <image src="../../static/images/tab-news-A6D6FA.png" mode="scaleToFill" />
          <view class="contentTabTitle">新闻</view>
        </view>
      </view>
      <view class="split"></view>
      <!-- 单词收藏 -->
      <template :wx-if="(pageType == 0)">
        <view :wx-if="!isHasContentWord">
          <noContent></noContent>
        </view>
        <view v-for="dl in wordList" wx:key="id">
          <view class="wordContent" data-index="id">
            <wordBox @tap="goToWord(dl.id)">
              <view slot="vi">{{ dl.vi }}</view>
              <view slot="ch">{{ dl.translationCh }}</view>
              <view slot="en">{{ dl.translationEn }}</view>
              <view slot="wordTag">{{ dl.tag }}</view>
            </wordBox>
          </view>
        </view>
      </template>

      <!-- 新闻收藏 -->
      <template :wx-if="(pageType == 1)">
        <view :wx-if="!isHasContentNews">
          <noContent></noContent>
        </view>
        <view v-for="nl in favNews.dataList" wx:key="id">
          <view class="newsContent" data-index="id">
            <newsBox @tap="goToNews(nl.id)">
              <rich-text :nodes="nl.title" slot="title"></rich-text>
              <rich-text :nodes="nl.summary" slot="summary"></rich-text>
              <view slot="category1">{{ nl.category1 }}</view>
              <view :wx-if="nl.category2" slot="category2">{{ nl.category2 }}</view>
              <view slot="pubTime">{{ nl.pubTime }}</view>
              <view slot="resources">
                <image hspace="5" vspace="5" :src="nl.resources[0]" mode="scaleToFill" class="resourceImg" />
              </view>
              <view slot="websiteName">{{ nl.websiteName }}</view>
            </newsBox>
          </view>
        </view>
      </template>

    </view>
  </view>
</template>

<script>
import noContent from "@/components/noContent/noContent.vue";
import newsBox from "@/components/news-box/news-box.vue";
import wordBox from "@/components/word-box/word-box.vue";
import { toInteger } from "lodash";

const app = getApp();
const newsApi = require('../../utils/newsApi.js');
const studyApi = require('../../utils/studyApi.js');
const utils = require('../../utils/utils');


export default {
  name: "favorite",
  components: { noContent, newsBox, wordBox },
  props: {},
  data() {
    return {
      // 0 - 单词, 1 - 新闻, 默认单词
      pageType: undefined,
      isLogin: false,

      // 单词收藏部分
      isLoadingWord: false, // 节流阀
      currentPageWord: 1,
      isHasContentWord: false,
      wordList: [],

      // 新闻收藏部分
      isLoadingNews: false, // 节流阀
      currentPageNews: 1,
      isHasContentNews: false,
      favNews: {
        dataList: [],
        pageCount: 1,
        total: 1
      }
    }
  },
  computed: {},
  methods: {
    // 后台没有传单词的触底加载，而是一次性给完了，就暂时没做，要做的话就和触底加载新闻差不多

    // 刷新状态
    flushStatus: function (e) {
      this.isLogin = app.globalData.isLogin;
      if (!this.isLogin) {
        if (uni.getStorageSync('token')) {
          this.isLogin = true;
        }
        else {
          this.isLogin = false;
        }
      }
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
    // Tab切换
    switchTab: function (e) {
      this.pageType++;
      if (this.pageType > 1) {
        this.pageType = 0;
      }
      console.log("点击tab", this.pageType);
    },
    // 去新闻详情页
    goToNews: function (id, $event) {
      console.log("查看新闻", id)
      uni.navigateTo({
        url: '../../pages/news_detail/news_detail?id=' + id
      })
    },
    // 去单词详情页
    goToWord: function (id, $event) {
      console.log("查看单词", id)
      uni.navigateTo({
        url: '../../pages/word/word?id=' + id
      })
    },
    // 获取收藏单词
    getFavWord: async function (e) {
      if (this.isLogin) {
        const res = await studyApi.getFavoriteCollection(uni.getStorageSync('token'));
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
        if (res.msg == "操作成功") {
          if (res.data.length == 0) {
            this.isHasContentWord = false;
          }
          else {
            this.isHasContentWord = true;
          }
          this.wordList = res.data;
        }
        else {
          uni.showToast({
            title: res,
            icon: "none",
            mask: true,
            duration: 1500
          })
        }
      }
      else {
        uni.showToast({
          title: "您还未登录",
          icon: "error",
          mask: true,
          duration: 1500
        })
      }
    },
    // 获取收藏新闻
    getFavNews: async function (e) {
      if (this.isLogin) {
        const res = await newsApi.getFavoriteNews(this.currentPageNews, 10, uni.getStorageSync('token'));
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
        if (res.msg == "操作成功") {
          if (res.data.dataList.length == 0) {
            this.isHasContentNews = false;
          }
          else {
            this.isHasContentNews = true;
          }
          this.favNews = res.data;
        }
        else {
          uni.showToast({
            title: res,
            icon: "none",
            mask: true,
            duration: 1500
          })
        }
      }
      else {
        uni.showToast({
          title: "您还未登录",
          icon: "error",
          mask: true,
          duration: 1500
        })
      }
    },
    // 上拉触底加载新闻
    loadNewPage: async function (e) {
      if (this.pageType == 1) {
        if (this.isLoadingNews) {
          return;
        }
        let _this = this;
        if (this.isHasContentNews) {
          this.isLoadingNews = true;
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
          let result = res.data.dataList;
          // let result = res
          // console.log(result.length)
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
            this.isLoadingNews = false;
          }
          else {
            uni.showLoading({
              mask: true
            });
            setTimeout(function () {
              uni.hideLoading();
            }, 1000)
            this.currentPageNews++;
            console.log("上拉触底第" + this.currentPageNews + "页");
            this.isLoadingNews = false;
            this.favNews.dataList = this.favNews.dataList.concat(result)
          }
        }
        else {
          uni.showLoading();
          this.isLoadingNews = false;
          uni.hideLoading();
          return;
        }
      }
    },
    // 上拉触底加载新闻实际
    flushLoadNewPage: async function (e) {
      const res = await newsApi.getFavoriteNews(this.currentPageNews + 1, 10, uni.getStorageSync('token'));
      return res;
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad: async function (options) {
    this.flushStatus();
    console.log("页面传入参数", options.type);
    options.type = toInteger(options.type);

    if (options.type < 0 || options.type > 1 || typeof options.type != "number") {
      this.pageType = 0;
    }
    else {
      this.pageType = options.type
    }
    await Promise.all([this.getFavWord(), this.getFavNews()]);
    console.log("tab参数", this.pageType);
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
  // 上拉触底监听
  onReachBottom(e) {
    this.loadNewPage();
  },
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
} 
</script>

<style lang="less" scoped>
@import './favorite.less';
</style>