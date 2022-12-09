<template>
  <view class="overview container">
    <!-- 切换图书的模态框 -->
    <view class="bookModal" :wx:if="isSwitchingBook">
      <view class="contentContainer">
        <view class="contentContainerHeader" @tap="closeModal">
          ×
        </view>
        <view class="contentForBook">
          <view v-for="dl in bookList" wx:key="id">
            <bookBox :imgSrc="dl.cover" :boxType="1" :bookId="dl.id" :chosenBookId="chosenBookId">
              <view slot="title">{{ dl.name }}</view>
              <view slot="introduction">{{ dl.introduction }}</view>
              <view slot="wordNumber">{{ "收录词数:" + dl.wordNumber }}</view>
            </bookBox>
          </view>
        </view>
      </view>
    </view>


    <view class="contentContainer">
      <view class="loginBtn" hover-stay-time="100" hover-class="loginBtnTapped" @tap="login" :wx-if="(!isLogin)">
        登&nbsp;&nbsp;&nbsp;录
      </view>
      <template :wx-if="isLogin">
        <view class="contentTitle">
          当前学习
        </view>
        <view class="split"></view>
        <view class="contentForBook">
          <button class="longerBtn" type="primary" @tap="goToDetail">单词详情</button>
          <button type="primary" @tap="switchBook">切换</button>
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
      <template :wx-if="(isLogin && typeof chosenBookId == 'number')">
        <view :wx-if="isLogin" class="contentTitle">
          学习状态总览
        </view>
        <view class="split"></view>
        <qiunDataCharts class="charts" type="ring" :opts="optsLearn" :chartData="chartDataLearn" :canvas2d="true"
          canvasId="mIaUcjZIsRXkrfOyLHOaUoeLdaWGgCGy" />

        <view :wx-if="isLogin" class="contentTitle">复习状态总览</view>
        <view class="split"></view>
        <qiunDataCharts class="charts" type="ring" :opts="optsReview" :chartData="chartDataReview" :canvas2d="true"
          canvasId="mIaUcjZIsRXkrfOyLHOaUoeLdaWGgCG14" />
      </template>
    </view>
  </view>
</template>

<script>
import bookBox from "@/components/book-box/book-box.vue";
import qiunDataCharts from "@/components/qiun-data-charts/qiun-data-charts";
import { toInteger } from "lodash";

const app = getApp();
const userApi = require('../../utils/userApi.js');
const studyApi = require('../../utils/studyApi.js');
const utils = require('../../utils/utils');

export default {
  name: "overview",
  components: { qiunDataCharts, bookBox },
  props: {},
  data() {
    return {
      isSwitchingBook: false,
      isLogin: false,
      // 一本书
      chosenBookId: undefined,
      chosenBook: {},
      // 很多书
      bookList: {},
      // 图表数据
      chartDataLearn: {},
      chartDataReview: {},
      // 圆环图的配置
      optsLearn: {
        rotate: false,
        rotateLock: false,
        color: ["#1890FF", "#91CB74"],
        padding: [0, 0, 0, 0],
        dataLabel: true,
        legend: {
          show: true,
          position: "right",
          lineHeight: 25
        },
        title: {
          name: "学习状态",
          fontSize: 15,
          color: "#666666"
        },
        subtitle: {
          name: "",
          fontSize: 13,
          color: "pink"
        },
        extra: {
          ring: {
            centerColor: "#ffffff",
            ringWidth: 30,
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 3,
            borderColor: "#FFFFFF"
          }
        }
      },
      optsReview: {
        rotate: false,
        rotateLock: false,
        color: ["#91CB74", "#1890FF"],
        padding: [0, 0, 0, 0],
        dataLabel: true,
        legend: {
          show: true,
          position: "right",
          lineHeight: 25
        },
        title: {
          name: "复习状态",
          fontSize: 15,
          color: "#666666"
        },
        subtitle: {
          name: "",
          fontSize: 13,
          color: "pink"
        },
        extra: {
          ring: {
            centerColor: "#ffffff",
            ringWidth: 30,
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 3,
            borderColor: "#FFFFFF"
          }
        }
      },
    }
  },
  computed: {},
  methods: {
    // 刷新状态
    flushStatus: function (e) {
      this.isLogin = app.globalData.isLogin;
      if (this.isLogin) {
        this.chosenBookId = app.globalData.userInfo.settings.bookId;
        // 图表初始化
        this.learningStatus = app.globalData.learningStatus;
        this.chartDataLearn = {
          series: [{
            data: [
              { "name": "已学习", "value": this.learningStatus.learned },
              { "name": "未学习", "value": this.learningStatus.unlearn }
            ]
          }]
        };
        let learnTotal = this.learningStatus.learned + this.learningStatus.unlearn;
        let reviewTotal = this.learningStatus.reviewed + this.learningStatus.review;
        // console.log(learnTotal, reviewTotal)
        this.optsLearn.subtitle.name = String(this.learningStatus.learned) + "/" + String(learnTotal);
        this.optsReview.subtitle.name = String(this.learningStatus.reviewed) + "/" + String(reviewTotal);
        this.chartDataReview = {
          series: [{
            data: [
              { "name": "已复习", "value": this.learningStatus.reviewed },
              { "name": "未复习", "value": this.learningStatus.review }
            ]
          }]
        };
      }
      return true;
    },
    // 获取当前学习的词书
    getBooksLeaningNow: async function (e) {
      if (this.isLogin) {
        const res = await studyApi.getOneBook(this.chosenBookId, uni.getStorageSync('token'));
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
    // 获取所有词书
    getAllBooks: async function (e) {
      let _this = this;
      if (this.isLogin) {
        const res = await studyApi.getBooks(uni.getStorageSync('token'));
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
          this.bookList = res.data.bookList;
          for (var tmpBook = 0; tmpBook < this.bookList.length; tmpBook++) {
            this.bookList[tmpBook].cover = "https://vi.wzf666.top" + this.bookList[tmpBook].cover;
          }

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
    // 去搜索页
    goToSearch: function (e) {
      if (this.isLogin) {
        uni.navigateTo({
          url: '../search/search?type=' + 1 + '&bookId=' + this.chosenBookId
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
    // 去详情页
    goToDetail: function (e) {
      if (this.isLogin) {
        uni.navigateTo({
          url: '../book_detail/book_detail?id=' + this.chosenBookId
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
    // 打开切换模态框（实质切换功能在组件里）
    switchBook: async function (e) {
      await this.getAllBooks();
      this.isSwitchingBook = true;
    },
    // 关闭切换模态框
    closeModal: function (e) {
      this.isSwitchingBook = false;
    },
    // 跳转到登录
    login: function (e) {
      uni.navigateTo({
        url: '../login/login'
      })
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad: function () {
    // this.flushStatus();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady: async function () {
    if (this.flushStatus())
      await this.getBooksLeaningNow();
  },
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
// 依托首页的样式
@import '../index/index.less';
@import '../overview/overview.less';
</style>