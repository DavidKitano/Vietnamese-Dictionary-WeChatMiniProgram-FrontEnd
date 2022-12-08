<template>
  <view :wx-if="newComer">
    <Welcome></Welcome>
  </view>
  <scroll-view class="container">
    <view class="realContent">
      <view class="header">
        <view class="headerInfo">
          <view class="headerInfoTitle" :wx-if="isLogin">
            <view>欢迎回来，</view>
            <view>{{ userInfo.username }}</view>
          </view>
          <view :wx-if="!isLogin">您好，请登录！</view>
        </view>
        <view class="searchBtn" data-type="search">
          <image @tap="toSearch" hover-stay-time="50" hover-class="wasTapped" src="../../static/images/svgs/search.svg"
            mode="scaleToFill">
          </image>
        </view>
      </view>


      <!-- 自动切换，间隔15s，动画0.5s，循环播放，非纵向，淡入淡出，监听滑动同时改变数据内容 -->
      <view class="contentContainer">
        <view class="contentTitle">今日例句</view>
        <view class="split"></view>
        <swiper class="swiperContainer" autoplay="true" interval="15000" duration="500" circular="true"
          easing-function="easeInOutCubic" current="0" indicator-dots="true" @change="changeSentence">
          <swiper-item :wx:for="dailySentences" wx:for-item="ds" wx:for-index="dsIndex" wx:key="dsIndex">
            <view class="dailySentencesContent" :data-index="dailySentences[presentDailySentence].index">
              <view class="chSentence">{{ dailySentences[presentDailySentence].chSentence }}</view>
              <view class="voice">
                <image @tap="playVoice" src="../../static/images/svgs/voice.svg" mode="scaleToFill"></image>
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
        <template :wx-if="isLogin">
          <view :wx-if="isLogin" class="contentTitle">学习状态总览</view>
          <view class="split"></view>
          <qiunDataCharts class="charts" type="ring" :opts="optsLearn" :chartData="chartDataLearn" :canvas2d="true"
            canvasId="mIaUcjZIsRXkrfOyLHOaUoeLdaWGgCGy" />
          <!-- 真机调试不支持canvas 2d，调试时换成非2d -->
          <!-- <qiunDataCharts class="charts" type="ring" :opts="optsLearn" :chartData="chartDataLearn" /> -->
          <view :wx-if="isLogin" class="contentTitle">复习状态总览</view>
          <view class="split"></view>
          <qiunDataCharts class="charts" type="ring" :opts="optsReview" :chartData="chartDataReview" :canvas2d="true"
            canvasId="mIaUcjZIsRXkrfOyLHOaUoeLdaWGgCG14" />
          <!-- <qiunDataCharts class="charts" type="ring" :opts="optsReview" :chartData="chartDataReview" /> -->
        </template>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import Welcome from "@/components/Welcome/Welcome.vue";
import qiunDataCharts from "@/components/qiun-data-charts/qiun-data-charts";
const studyApi = require("../../utils/studyApi");
const app = getApp();
let innerAudioContext = null;

export default {
  data() {
    return {
      newComer: true,
      isLogin: false,
      userInfo: {},
      learningStatus: {},
      dailySentences: [{
        index: 0,
        chSentence: "加载中...",
        viSentence: "Loading...",
        audio: undefined
      }],
      presentDailySentence: 0,

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
  props: {
  },
  components: {
    Welcome, qiunDataCharts
  },
  methods: {
    // 获取每日例句
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
            audio: "https://vi.wzf666.top" + res.data[i].audio
          })

        }
      }
      // console.log("例句列表", list)
      return list;
    },
    // 换句子
    changeSentence: function (e) {
      // console.log(e.target, "滑动");
      this.presentDailySentence = e.target.current;
      innerAudioContext.stop();
    },
    // 点击播放声音
    playVoice: function (e) {
      // console.log("点击了声音播放事件", e);
      console.log(innerAudioContext.paused)
      let sentenceAudio = this.dailySentences[this.presentDailySentence].audio;

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
    // 去单词搜索页
    toSearch: function (e) {
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
          url: '../../pages/search/search?type=0',
        })
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
    // 刷新状态
    flushStatus: async function (e) {
      this.dailySentences = await this.getDailySentencesList();
      let isLogin = app.globalData.isLogin;
      this.isLogin = isLogin;
      this.userInfo = app.globalData.userInfo;
      this.learningStatus = app.globalData.learningStatus;
      console.log("首页学习状态", app.globalData.learningStatus);
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
    },
    // 检查是否是第一次进入的用户（或清过缓存的用户）
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
    innerAudioContext = uni.createInnerAudioContext({
      useWebAudioImplement: false
    });
    innerAudioContext.onPlay(() => {//监听播放事件
    })
    innerAudioContext.onStop(() => {//监听停止事件
    })
    innerAudioContext.onPause(() => {//监听暂停事件
    })
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
    innerAudioContext.stop();
  },
  onUnload() {
    innerAudioContext.destroy();
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
