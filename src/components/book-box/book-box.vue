<template>
  <template :wx-if="(boxType == 0)">
    <view class="book-box">
      <view class="contentImg">
        <image :lazy-load="true" :src="imgSrc" mode="aspectFit" />
      </view>
      <view class="contentText">
        <view class="contentTextTitle">
          <slot name="title"></slot>
        </view>
        <view class="contentTextContent">
          <slot name="introduction"></slot>
        </view>
        <view class="contentTextContent">
          <slot name="wordNumber"></slot>
        </view>
      </view>
    </view>
  </template>
  <template :wx-if="(boxType == 1)">
    <view class="book-box">
      <view class="contentImg">
        <image class="theImage" :lazy-load="true" :src="imgSrc" mode="aspectFit" />
      </view>
      <view class="contentText">
        <view class="contentTextTitle">
          <slot name="title"></slot>
        </view>
        <view class="contentTextContent">
          <slot name="introduction"></slot>
        </view>
        <view class="contentTextContent">
          <slot name="wordNumber"></slot>
        </view>
        <view class="contentTextContent">
          <view class="switchFunc">
            <button class="switchBtn" :disabled="(bookId == chosenBookId)" hover-class="wasTapped" @click="switchBook">
              切换
            </button>
          </view>
        </view>
      </view>
    </view>
  </template>

</template>

<script>
const app = getApp();
const studyApi = require('../../utils/studyApi.js');

export default {
  name: "book-box",
  props: {
    imgSrc: String,
    boxType: Number,
    bookId: Number,
    chosenBookId: Number
  },
  data() {
    return {
      isLogin: false,
    }
  },
  computed: {},
  methods: {
    // 切换词书
    switchBook: function (e) {
      let _this = this;
      try {
        uni.showModal({
          title: '确认',
          content: '确认要切换词书吗？切换后将自动重启小程序',
          success: async function (resConfirm) {
            if (resConfirm.confirm) {
              if (_this.isLogin) {
                const res = await studyApi.chooseBooks(_this.bookId, uni.getStorageSync('token'));
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
                if (res == "操作成功") {
                  app.onHide();
                  uni.reLaunch({
                    url: '../../pages/index/index'
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
            }
            else if (resConfirm.cancel) {
            }
          }
        })
      }
      catch {
        console.log("切换词书时唤出确认框失败");
      }
    }
  },
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {
    this.isLogin = app.globalData.isLogin;
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
  beforeDestroy() { },
}

</script>

<style lang="less" scoped>
@import './book-box.less';
</style>