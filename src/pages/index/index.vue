<template>
  <scroll-view class="container">
    <view :wx-if="newComer">
      <Welcome></Welcome>
    </view>
    <view class="realContent">
      <view class="header">
        <view class="headerInfo">
          <view :wx-if="isLogin">欢迎回来，{{ userInfo.username }}</view>
          <view :wx-if="!isLogin">您好，请登录！</view>
        </view>
        <view class="searchBtn" data-type="search">
          <image @tap="toSearch" hover-class="wasTapped" src="../../static/images/svgs/search.svg" mode="scaleToFill">
          </image>
        </view>
      </view>


      <!-- 自动切换，间隔15s，动画0.5s，循环播放，非纵向，淡入淡出，监听滑动同时改变数据内容 -->
      <view class="contentContainer">
        <view class="contentTitle">今日例句</view>
        <swiper class="swiperContainer" autoplay="true" interval="15000" duration="500" circular="true"
          easing-function="easeInOutCubic" current="0" indicator-dots="true" @change="changeSentence">
          <swiper-item :wx:for="dailySentences" wx:for-item="ds" wx:for-index="dsIndex" wx:key="dsIndex">
            <view class="dailySentencesContent" :data-index="dailySentences[presentDailySentence].index"
              @tap="playVoice">
              <view class="chSentence">{{ dailySentences[presentDailySentence].chSentence }}</view>
              <view class="voice">
                <image src="../../static/images/svgs/voice.svg" mode="scaleToFill"></image>
              </view>
              <view class="viSentence">
                {{ dailySentences[presentDailySentence].viSentence }}
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 如果还未登录 -->
      <view class="contentContainer">
        <view class="loginBtn" hover-class="loginBtnTapped" @tap="login" :wx-if="(!isLogin)">登&nbsp;&nbsp;&nbsp;录
        </view>
        <view :wx-if="isLogin" class="contentTitle">学习状态总览</view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import "./index.js";
import Welcome from "@/components/Welcome/Welcome.vue";

const studyApi = require("../../utils/studyApi");
const app = getApp();

export default {
  data() {
    return {
      newComer: true,
      isLogin: false,
      userInfo: {},
      dailySentences: [{
        "index": 0,
        "chSentence": "加载中...",
        "viSentence": "Loading..."
      }],
      presentDailySentence: 0
    };
  },
  props: {
  },
  components: {
    Welcome,
  },
  methods: {
    getDailySentencesList: async function (e) {
      const res = await studyApi.getDailySentences();
      let list = [];
      if (res.msg == "操作成功") {
        let i = 0
        for (i; i < 5; i++) {
          list.push({
            index: i,
            chSentence: res.data[i].chSentence,
            viSentence: res.data[i].viSentence,
          })

        }
      }
      console.log("例句列表", list)
      return list;
    },
    changeSentence: function (e) {
      // console.log(e.target, "滑动");
      this.presentDailySentence = e.target.current;
    },
    toSearch: function (e) {
      console.log("点击了搜索事件", e)
    },
    login: function (e) {
      console.log("点击了登录，目前登录状态为" + this.isLogin);
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
    flushStatus: async function (e) {
      this.dailySentences = await this.getDailySentencesList();
      let isLogin = app.globalData.isLogin;
      this.isLogin = isLogin;
      this.userInfo = app.globalData.userInfo;
    },
    newComerCheck: function (e) {
      let openId = uni.getStorageSync("openId");
      let flag = uni.getStorageSync("newComerFlag");
      if (flag) {
        console.log("检测到非新用户", flag);
        // uni.showTabBar();
        this.newComer = false;
        return false;
      } else {
        console.log("检测到新用户或清理过缓存");
        // console.log(openId + " " + flag);
        this.newComer = false;
        uni.setStorageSync("newComerFlag", "notNew" + openId);
        try {
          uni.hideTabBar();
        } catch {
          console.log("无tabbar可关，或出现错误");
        }
        return true;
      }
    },

  },
  onLoad() {
    // // 预加载登录页
    // this.$preload('../my/my.vue');
    console.log("加载主页")
    this.newComer = this.newComerCheck();
    this.flushStatus();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {
    // this.flushStatus();
  },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {
    // this.flushStatus();
  },
  // 页面周期函数--监听页面隐藏
  onHide() {
    // this.flushStatus();
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
