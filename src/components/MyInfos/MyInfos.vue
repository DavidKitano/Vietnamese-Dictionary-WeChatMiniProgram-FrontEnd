<template>
  <div class="MyInfos">
    <view class="header">
      <!-- 背景图 -->
      <view class="background">
        <image class="backgroundImage" :src="(defaultPic || userInfo.avatar_pic)" mode="scaleToFill" />
      </view>

      <!-- 如果还未登录 -->
      <view class="loginBtn" hover-class="loginBtnTapped" @tap="login" :wx-if="(!isLogin)">登&nbsp;&nbsp;&nbsp;录
      </view>

      <!-- 如果已经登录 -->
      <image class="avatar" :src="userInfo.avatar_pic" @tap="previewAvatar" background-size="cover" mode="widthFix"
        :wx-if="(isLogin)">
      </image>
      <view class="username" :wx-if="(isLogin)">{{ userInfo.username }}</view>

    </view>
  </div>
</template>

<script>
const app = getApp();
export default {
  name: "MyInfos",
  props: [],
  data() {
    return {
      isLogin: false,
      userInfo: {
      },
      defaultPic: '../../static/images/icons/icon.jpg',
      changeType: -1,
      inputValue: {},
      errMsg: '',
    }
  },
  computed: {},
  methods: {
    flushStatus: function (e) {
      // console.log(app.globalData)
      let isLogin = app.globalData.isLogin
      let userInfo = {}
      if (isLogin) {
        userInfo = {
          avatar_pic: app.globalData.userInfo.avatar_pic,
          username: app.globalData.userInfo.username,
          isWxUser: app.globalData.userInfo.isWxUser,
        }
      }
      this.isLogin = isLogin
      this.userInfo = userInfo
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
    }
  },
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {
    console.log("调用了MyInfos组件")

    this.flushStatus();

  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() { },
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {
    this.flushStatus();
  },
  // 组件周期函数--监听组件数据更新之后
  updated() { },
  // 组件周期函数--监听组件激活(显示)
  activated() {
    this.flushStatus();
  },
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() { },
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() { },
};
</script>

<style lang="less" scoped>
@import "./MyInfos.less";
</style>