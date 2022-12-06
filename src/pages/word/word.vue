<template>
  <scroll-view class="word">
    <view class="wordHeader">
      <view class="wordTitle" :wx-if="(wordInfo.vi.length < 100)">
        {{ wordInfo.vi }}
      </view>
      <view class="wordTitleLong" :wx-if="(wordInfo.vi.length < 120) && (wordInfo.vi.length > 100)">
        {{ wordInfo.vi }}
      </view>
      <view class="wordTitleTooLong" :wx-if="(wordInfo.vi.length > 120)">
        {{ wordInfo.vi }}
      </view>
    </view>
    <view class="wordDetailContainer">
      <view class="wordFunctionBox">
        <image :wx-if="!wordInfo.isFavorite" @tap="addFavorite" src="../../static/images/svgs/star-black.svg"
          mode="scaleToFill" />
        <image :wx-if="wordInfo.isFavorite" @tap="removeFavorite" src="../../static/images/svgs/star-red.svg"
          mode="scaleToFill" />
        <image @tap="playVoice" src="../../static/images/svgs/voice.svg" mode="scaleToFill"></image>
      </view>
      <view class="split"></view>
      <view class="wordBox">
        <view class="wordCh" :wx-if="(wordInfo.translationCh.length < 15)">
          {{ wordInfo.translationCh }}
        </view>
        <view class="wordChLong" :wx-if="(wordInfo.translationCh.length < 25) && (wordInfo.translationCh.length > 15)">
          {{ wordInfo.translationCh }}
        </view>
        <view class="wordChTooLong" :wx-if="(wordInfo.translationCh.length > 25)">
          {{ wordInfo.translationCh }}
        </view>
        <view class="wordEn">
          {{ wordInfo.translationEn }}
        </view>
      </view>
      <view class="split"></view>
      <view class="exampleSentenceBox">
        <view class="title">中越例句</view>
        <view class="chSentence">{{ wordInfo.chSentence }}</view>
        <view class="viSentence">{{ wordInfo.viSentence }}</view>
        <view class="warningSentence" :wx-if="!((wordInfo.chSentence) || (wordInfo.viSentence))">
          暂无例句哦~
        </view>
      </view>
      <view class="split"></view>
      <view class="wordTagBox">
        <view class="title">出自</view>
        <view class="wordTag">{{ wordInfo.tag }}</view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
const app = getApp();
const userApi = require('../../utils/userApi.js');
const studyApi = require('../../utils/studyApi.js');
const utils = require('../../utils/utils');

let innerAudioContext = null;
export default {
  name: "word",
  components: {},
  props: {},
  data() {
    return {
      isLogin: false,
      wordId: undefined,
      wordInfo: {
        isFavorite: false,
        id: undefined,
        vi: "Loading...",
        chSentence: "加载中...",
        viSentence: "Loading...",
        pronunciation: undefined,
        translationCh: "加载中...",
        translationEn: "Loading...",
        tag: "加载中..."
      }
    }
  },
  computed: {},
  methods: {
    flushStatus: function (e) {
      let isLogin = app.globalData.isLogin;
      this.isLogin = isLogin;
      this.getWords();
    },
    getWords: async function () {
      const res = await studyApi.getWordDetails(this.wordId, uni.getStorageSync("token"));
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
        if (res.data.chSentence) {
          res.data.chSentence = res.data.chSentence.replace(/&amp;/g, "&");
        }
        if (res.data.viSentence) {
          res.data.viSentence = res.data.viSentence.replace(/&amp;/g, "&");
        }
        if (res.data.pronunciation) {
          res.data.pronunciation = "https://vi.wzf666.top" + res.data.pronunciation;
        }
        this.wordInfo = res.data;
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
    },
    playVoice: function (e) {
      // console.log("点击了声音播放事件", e);
      console.log(innerAudioContext.paused)
      let sentenceAudio = this.wordInfo.pronunciation;

      if (innerAudioContext.paused) {
        innerAudioContext.onError(function (res) {
        })
        if ((sentenceAudio == '') || (sentenceAudio == undefined)) {
          return;
        } else {
          innerAudioContext.src = sentenceAudio //设置音频地址
          innerAudioContext.play();
        }
      } else {
        innerAudioContext.stop();
      }
    },
    addFavorite: async function (e) {
      const res = await studyApi.favoriteWord(this.wordId, uni.getStorageSync("token"));
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
        this.wordInfo.isFavorite = true;
        setTimeout(function () {
          uni.showLoading({
            mask: true
          })
        }, 1000)
        uni.hideLoading({
          onConflict: true
        })
      }
    },
    removeFavorite: async function (e) {
      const res = await studyApi.deFavoriteWord(this.wordId, uni.getStorageSync("token"));
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
        this.wordInfo.isFavorite = false;
        setTimeout(function () {
          uni.showLoading({
            mask: true
          })
        }, 1000)
        uni.hideLoading({
          onConflict: true
        })
      }
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(options) {
    // console.log(options);
    this.wordId = options.id;
    this.flushStatus();
    innerAudioContext = uni.createInnerAudioContext({
      useWebAudioImplement: false
    });
    innerAudioContext.onPlay(() => {//监听播放事件
    })
    innerAudioContext.onStop(() => {//监听停止事件
    })
    innerAudioContext.onPause(() => {//监听暂停事件
    })
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() { },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {

  },
  // 页面周期函数--监听页面隐藏
  onHide() {
    innerAudioContext.stop();
  },
  // 页面周期函数--监听页面卸载
  onUnload() {
    innerAudioContext.destroy();
  },
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
@import './word.less';
</style>