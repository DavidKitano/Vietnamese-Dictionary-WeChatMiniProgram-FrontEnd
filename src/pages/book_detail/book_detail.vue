<template>
  <view class="book_detail container">
    <view class="contentContainer">
      <view class="loginBtn" hover-stay-time="100" hover-class="loginBtnTapped" @tap="login" :wx-if="(!isLogin)">
        登&nbsp;&nbsp;&nbsp;录
      </view>
      <template :wx-if="isLogin">
        <view class="contentTitle">
          词书详情
        </view>
        <view class="split"></view>
        <view class="contentForBookDetail">
          <button type="primary" @tap="goToSearch">搜索</button>
        </view>
        <view class="split"></view>
        <view class="contentForBook">
          <bookBox :imgSrc="chosenBook.cover" :boxType="0">
            <view slot="title">{{ chosenBook.name }}</view>
            <view slot="introduction">{{ chosenBook.introduction }}</view>
            <view slot="wordNumber">{{ "收录词数:" + chosenBook.wordNumber }}</view>
          </bookBox>
        </view>
      </template>
    </view>

    <view class="contentContainer">
      <view class="loginBtn" hover-stay-time="100" hover-class="loginBtnTapped" @tap="login" :wx-if="(!isLogin)">
        登&nbsp;&nbsp;&nbsp;录
      </view>
      <template :wx-if="isLogin">
        <view class="contentTitle">
          收录单词
        </view>
        <view class="split"></view>
        <view :wx-if="!isHasContent">
          <noContent></noContent>
        </view>
        <template :wx-if="isHasContent">
          <view v-for="dl in wordList.dataList" wx:key="id">
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
      </template>
    </view>
  </view>
</template>

<script>
import noContent from "@/components/noContent/noContent.vue";
import wordBox from "@/components/word-box/word-box.vue";
import bookBox from "@/components/book-box/book-box.vue";
import { toInteger } from "lodash";

const app = getApp();
const studyApi = require('../../utils/studyApi.js');
export default {
  name: "book_detail",
  components: { wordBox, bookBox, noContent },
  props: {},
  data() {
    return {
      isLoading: false,
      isLogin: false,
      ifHasContent: false,
      currentPage: 1,
      chosenBook: {},
      wordList: {}
    }
  },
  computed: {},
  methods: {
    // 获取词书信息
    getBooksLeaningNow: async function (e) {
      if (this.isLogin) {
        const res = await studyApi.getOneBook(this.bookId, uni.getStorageSync('token'));
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
          this.chosenBook = res.data.book;
          this.chosenBook.cover = "https://vi.wzf666.top" + this.chosenBook.cover;
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
    // 获取词书单词
    getWords: async function (e) {
      if (this.isLogin) {
        const res = await studyApi.getWordsFromOneBook(this.bookId, this.currentPage, 10, uni.getStorageSync('token'));
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
          return;
        }
        if (toInteger(res.data.total) == 0) {
          this.isHasContent = false;
          return;
        }
        if (res.msg == "操作成功") {
          this.isHasContent = true;
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
    // 刷新新页面(加载新页面实际)
    flushLoadNewPage: async function (e) {
      const res = await studyApi.getWordsFromOneBook(this.bookId, this.currentPage + 1, 10, uni.getStorageSync('token'));
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
        let result = res.data.dataList;
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
          this.wordList.dataList = this.wordList.dataList.concat(result)
        }
      }
      else {
        uni.showLoading();
        this.isLoading = false;
        uni.hideLoading();
        return;
      }
    },
    // 去搜索页
    goToSearch: function (e) {
      if (this.isLogin) {
        uni.navigateTo({
          url: '../search/search?type=' + 1 + '&bookId=' + this.bookId
        })
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
    // 去单词详情页
    goToWord: function (id, $event) {
      console.log("查看单词", id)
      uni.navigateTo({
        url: '../../pages/word/word?id=' + id
      })
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad: async function (options) {
    this.isLoading = false;
    this.bookId = options.id;
    this.currentPage = 1;
    this.isHasContent = false;
    this.isLogin = app.globalData.isLogin;
    if (this.isLogin) {
      await Promise.all([this.getBooksLeaningNow(), this.getWords()]);
    }
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
  onReachBottom() {
    this.loadNewPage();
  },
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
} 
</script>

<style lang="less" scoped>
@import './book_detail.less';

// 复用了首页和overview页的一些样式
@import '../index/index.less';
@import '../overview/overview.less';
</style>