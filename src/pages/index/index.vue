<template>
  <view class="container">
    <view :wx:if="(newComer)">
      <Welcome></Welcome>
    </view>
    <view class="content">
      首页
    </view>
  </view>
</template>

<script>
import "./index.js";
import Welcome from "@/components/Welcome/Welcome.vue";

const app = getApp();

export default {
  data() {
    return {
      newComer: true,
    };
  },
  props: {
  },
  components: {
    Welcome,
  },
  methods: {
    flushStatus: function (e) {
      let isLogin = app.globalData.isLogin
      this.isLogin = isLogin
    },
    newComerCheck: function (e) {
      let openId = uni.getStorageSync("openId");
      let flag = uni.getStorageSync("newComerFlag");
      if (flag) {
        console.log("检测到非新用户", flag);
        // uni.showTabBar();
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
    this.newComer = this.newComerCheck();
    this.flushStatus();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {
    this.flushStatus();
  },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {
    this.flushStatus();
  },
  // 页面周期函数--监听页面隐藏
  onHide() {
    this.flushStatus();
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
