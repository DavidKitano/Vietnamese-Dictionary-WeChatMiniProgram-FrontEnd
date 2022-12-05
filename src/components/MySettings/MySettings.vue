<template>
  <view class="MySettings">
    <view class="optionList">
      <view class="optionListLogin" :wx-if="isLogin">
        <view class="option" hover-stay-time="150" hover-class="optionTapped" @tap="changeAvatar">
          <image src="../../static/images/svgs/profile.svg"></image>
          <view class="optionName">更改头像</view>
        </view>
        <view class="option" hover-stay-time="150" hover-class="optionTapped" data-type="username" @tap="changeName">
          <image src="../../static/images/svgs/card_fill.svg"></image>
          <view class="optionName">更改昵称</view>
        </view>
        <view class="option" hover-stay-time="150" hover-class="optionTapped" data-type="pwd"
          :wx-if="!userInfo.isWxUser" @tap="changePassword">
          <image src="../../static/images/svgs/subtitle_block_light-dark.svg"></image>
          <view class="optionName">修改密码{{ userInfo.isWxUser }}</view>
        </view>
        <view class="split"></view>
        <view class="option" hover-stay-time="150" hover-class="optionTapped" @tap="goSettings">
          <image src="../../static/images/svgs/more.svg"></image>
          <view class="optionName">更多详细设定</view>
        </view>
        <view class="split"></view>
      </view>

      <view class="option" hover-stay-time="150" hover-class="optionTapped" @tap="clearAllCache">
        <image src="../../static/images/svgs/trashbin.svg"></image>
        <view class="optionName">清除缓存</view>
      </view>
      <view class="option" hover-stay-time="150" hover-class="optionTapped" @tap="exitManuallyConfirm">
        <image src="../../static/images/svgs/exit.svg"></image>
        <view class="optionName">正常关闭小程序</view>
      </view>
      <view class="logoutBtn" hover-stay-time="150" hover-class="optionTapped" @tap="logoutConfirm" :wx-if="isLogin">
        退出登录
      </view>
    </view>
  </view>
</template>
<script>
const app = getApp();
const userApi = require('../../utils/userApi.js');
const utils = require('../../utils/utils');

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
      // console.log("登录状态", isLogin)
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
      // console.log("用户信息", this.userInfo)
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
            app.globalData.ifFirstTimeLaunch = true;
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
    underConstruction: function (e) {
      utils.underConstruction(e);
    },
    error: function (e) {
      utils.errorFound(e);
    },
    clearAllCache: function (e) {
      let _this = this;
      try {
        let cache = uni.getStorageInfoSync();
        let warning = '缓存占用' + cache.currentSize + 'KB';
        // console.log(cache);
        if (cache.currentSize <= cache.limitSize) {
          warning = warning + "，在限制范围内";
        } else if (cache.currentSize > cache.limitSize) {
          warning = warning + "，超过程序限制";
        } else {
          warning = "内部错误";
          this.error();
        }
        uni.showModal({
          title: warning,
          content: '确认要清除所有缓存吗？该操作会退出登录，清除缓存内容并重新加载小程序',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定清除缓存')
              try {
                uni.showLoading();
                uni.clearStorageSync();
                app.globalData.isFirstTimeLaunch = false;
                app.globalData.token = undefined;
                app.globalData.isLogin = false;
                app.globalData.userInfo = { settings: {} };
                uni.hideLoading();
                uni.showToast({
                  title: "清除成功",
                  icon: "none",
                  duration: 2100,
                  mask: true
                })
                setTimeout(function () {
                  app.globalData.ifFirstTimeLaunch = true;
                  uni.reLaunch({
                    url: '../index/index'
                  })
                }, 2000)
              } catch (e) {
                _this.error();
              }
            } else if (res.cancel) {
              console.log('用户点击取消清除缓存')
            }
          }
        })
      } catch {
        uni.showToast({
          title: "操作失败，请重试", icon: "none", duration: 3000, mask: true
        });
      }
    },
    exitManuallyConfirm: function (e) {
      let _this = this;
      let warning = ""
      if (this.isLogin) {
        warning = "本次退出不会直接注销登录，";
      }
      uni.showModal({
        title: '提示',

        content: '您可以通过下滑微信重新进入，' + warning + '确认要关闭小程序吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            _this.exitManually();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
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
      uni.navigateTo({
        url: '../../pages/u_settings/u_settings'
      });
    }


  },
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {
    // console.log("调用了MySettings组件")
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