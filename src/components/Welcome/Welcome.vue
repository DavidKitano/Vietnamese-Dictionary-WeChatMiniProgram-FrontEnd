<template>
  <view :wx:if="(!closeWelcomeFlag)" class="welcome">
    <view data-welcomeType="welcomeLogo">
      <image class="logo" src="/static/logo.jpg"></image>
    </view>
    <view data-welcomeType="welcomeTitle">
      <text class="welcome-title">{{ welcomeTitle }}</text>
    </view>
    <view data-welcomeType="welcomeButton">
      <button @on-click="welcomeBtnTap" @tap="welcomeBtnTap" hover-class="welcome-button-tapped"
        hover-stop-propagation="false" class="welcome-button">
        {{ welcomeButton }}
      </button>
    </view>
  </view>
</template>

<script>
import "./Welcome";
// import $ from 'jquery';
// 小程序不支持jquery

export default {
  name: "welcome",
  props: {
  },
  options: {
    styleIsolation: 'isolated'
  },
  data() {
    return {
      welcomeTitle: "初次见面😄欢迎使用",
      welcomeButton: "好耶",
      closeWelcomeFlag: false
    };
  },

  // 组件周期函数--监听组件挂载完毕
  mounted() {
    try {
      uni.hideTabBar();
    } catch {
      console.log("无tabbar可关，或出现错误");
    }
    console.log("加载了welcome组件");
    var tmp = 0;
    setInterval(() => {
      tmp++;
      if (tmp == 3) {
        tmp = 1;
      }
      if (tmp == 1) {
        this.welcomeTitle = "Xin chào😄Chào mừng ";
        this.welcomeButton = "Cảm ơn";
      } else if (tmp == 2) {
        this.welcomeTitle = "初次见面😄欢迎使用";
        this.welcomeButton = "好耶";
      }
    }, 4500);
  },
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() { },
  // 组件周期函数--监听组件数据更新之后
  updated() { },
  // 组件周期函数--监听组件激活(显示)
  activated() { },
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() { },
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {
    try {
      uni.showTabBar();
    } catch {
      console.log("有tabbar显示错误")
    }
  },

  onLoad() {
  },
  methods: {
    welcomeBtnTap: function (e) {
      // var wc = $('#welcomeContent');
      // console.log("点击了好耶");
      this.closeWelcomeFlag = true;
      if (this.closeWelcomeFlag) {
        try {
          uni.showTabBar();
        } catch {
          console.log("有tabbar显示错误")
        }
      }
    },

  },
};
</script>

<style lang="less" scoped>
@import "./Welcome.less";
</style>
