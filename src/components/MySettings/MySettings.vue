<template>
  <view class="MySettings">
    <view class="optionList">
      <view class="option" hover-class="optionTapped" @tap="changeAvatar">
        <image src="../../static/images/svgs/profile.svg"></image>
        <view class="optionName">更改头像</view>
      </view>
      <view class="option" hover-class="optionTapped" data-type="username" @tap="changeName">
        <image src="../../static/images/svgs/card_fill.svg"></image>
        <view class="optionName">更改昵称</view>
      </view>
      <view class="option" hover-class="optionTapped" data-type="pwd" :wx:if="!userInfo.wx_user" @tap="changePassword">
        <image src="../../static/images/svgs/subtitle_block_light-dark.svg"></image>
        <view class="optionName">修改密码</view>
      </view>
      <view class="split"></view>
      <view class="option" hover-class="optionTapped" @tap="goSettings">
        <image src="../../static/images/svgs/more.svg"></image>
        <view class="optionName">更多详细设定</view>
      </view>
      <view class="split"></view>
      <view class="option" hover-class="optionTapped" @tap="exitManually">
        <image src="../../static/images/svgs/exit.svg"></image>
        <view class="optionName">正常关闭小程序</view>
      </view>
      <view class="logoutBtn" hover-class="optionTapped" @tap="logoutConfirm" :wx:if="isLogin">退出登录</view>
    </view>
  </view>
</template>
<script>

const app = getApp();
const userApi = require('../../utils/userApi.js');

export default {
  name: "MySettings",
  props: {},
  data() {
    return {
      isLogin: false,
      userInfo: {

      }
    }
  },
  computed: {},
  methods: {
    flushStatus: function (e) {
      let isLogin = app.globalData.isLogin
      let userInfo = {}
      if (isLogin) {
        userInfo = {
          avatar_pic: app.globalData.userInfo.avatar_pic,
          username: app.globalData.userInfo.username,
          user_id: app.globalData.userInfo.user_id,
          wx_user: app.globalData.userInfo.wx_user,
        }
      }
      this.isLogin = isLogin
      this.userInfo = userInfo
    },
    logoutConfirm: function (e) {
      let _this = this;
      uni.showModal({
        title: '提示',
        content: '确认要退出吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            _this.logout();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    logout: async function (e) {
      console.log('点击了登出');
      let res = null;
      if (this.isLogin && (app.globalData.token == uni.getStorageSync('token'))) {
        res = await userApi.logout(uni.getStorageSync('token'));
        if (res == "操作成功") {
          uni.removeStorageSync('token');
          app.globalData.token = undefined;
          app.globalData.isLogin = false;
          uni.showToast({
            title: res,
            icon: "error",
            duration: 1500,
            mask: true
          })
          setTimeout(function () {
            app.onShow();
            uni.reLaunch({
              url: '../my/my'
            })
          }, 1500)
          // this.onShow();
        }
      } else {
        uni.showToast({
          title: "非法操作",
          icon: "error",
          duration: 1500,
          mask: true
        });
        uni.removeStorageSync('token');
        app.globalData.token = undefined;
        app.globalData.isLogin = false;
      }
    },
    exitManually: function (e) {
      uni.exitMiniProgram({
        success: function () {
          console.log("正常退出");
        },
        fail: function () {
          console.log("手动退出异常");
          uni.showToast({
            title: "操作失败，请尝试右上角退出", icon: "none", duration: 3000, mask: true
          });
        }
      })
    },
    underConstruction: function (e) {
      console.log(e);
      uni.showToast({
        title: '开发中',
        icon: "error",
        duration: 1500,
        mask: true
      })
    },

    changeAvatar: function (e) {
      this.underConstruction(e);
    },

    changeName: function (e) {
      this.underConstruction(e);
    },

    changePassword: function (e) {
      this.underConstruction(e);
    },

    goSettings: function (e) {
      this.underConstruction(e);
    }


  },
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {
    console.log("调用了MySettings组件")
    this.flushStatus();
  },
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
@import "./MySettings.less";
</style>