<template>
  <view class="MySettings">
    <view class="float changePwdModal" :wx-if="isChangePwd">
      <view class='floatContent'>
        <view class="floatTitle">修改密码</view>
        <view class="floatInputBox">
          <input class="floatInput" type="password" placeholder="请输入原来的密码" @input="handleInputChangePwd"
            data-inputtype="oldPassword" />
          <input class="floatInput" type="password" placeholder="请输入新的密码" @input="handleInputChangePwd" @blur='checkPwd'
            data-inputtype="newPassword" />
          <input class="floatInput" type="password" placeholder="请确认新的密码" @input="handleInputChangePwd" @blur='checkPwd'
            data-inputtype="newPasswordConfirm" />
        </view>
        <view class="errmsg">{{ errmsg[errtype] }}</view>
        <view class="floatFunc">
          <button type="primary" class="floatSubmit" @tap="changePwdFunc">提交</button>
          <button type="default" class="floatExit" @tap="hideFloat">取消</button>
        </view>
      </view>
    </view>

    <view class="float changeProfileModal" :wx-if="isChangeProfile">
      <view class='floatContent'>
        <view class="floatTitle">修改昵称</view>
        <view class="floatInputBox">
          <view class="floatInputContents">
            <view class="floatInputTitle">新的昵称</view>
            <input class="floatInput" type="text" :value="userInfo.username" placeholder="请输入新昵称" @blur="checkUsername"
              @input="handleInputChangeProfile" data-inputtype="newUsername" />
          </view>
        </view>
        <view class="errmsg">{{ errmsg[errtype] }}</view>
        <view class="floatFunc">
          <button type="primary" class="floatSubmit" @tap="changeProfileFunc">提交</button>
          <button class="floatExit" @tap="hideFloat">取消</button>
        </view>
      </view>
    </view>

    <view class="float changeProfileModal" :wx-if="isChangeAvatar">
      <view class='floatContent'>
        <view class="floatTitle">修改头像</view>
        <view class="floatInputBox">
          <image class="avatar" :src="changeProfile.newAvatar" @tap="uploadImg" background-size="cover" mode="widthFix"
            :wx-if="(isLogin)">
          </image>
          <view class="changeAvatarNotice">点击更换头像</view>
        </view>
        <view class="errmsg">{{ errmsg[errtype] }}</view>
        <view class="floatFunc">
          <button type="primary" class="floatSubmit" @tap="changeAvatarFunc">提交</button>
          <button class="floatExit" @tap="hideFloat">取消</button>
        </view>
      </view>
    </view>

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
          <view class="optionName">修改密码</view>
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
import { toInteger } from 'lodash';
const app = getApp();
const studyApi = require('../../utils/studyApi');
const userApi = require('../../utils/userApi.js');
const utils = require('../../utils/utils');

export default {
  name: "MySettings",
  props: {},
  data() {
    return {
      isLogin: false,
      isChangeAvatar: false,
      isChangeProfile: false,
      isChangePwd: false,
      userInfo: {
      },
      changePwd: {
        newPassword: "",
        oldPassword: "",
        newPasswordConfirm: ""
      },
      changeProfile: {
        newUsername: "",
        newAvatar: ""
      },
      errmsg: [
        "",
        "非法错误",
        "请填写信息",
        "请输入正确的昵称，长度大于等于4并小于等于50",
        "请输入正确的密码，长度大于6并小于50",
        "两次密码不一致，请重新输入"
      ],
      errtype: 0,
    }
  },
  computed: {},
  methods: {
    // 刷新状态
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
    // 错误值
    setErrType: function (num) {
      // 对错误进行定义
      try {
        this.errtype = toInteger(num);
      }
      catch {
        this.errtype = 1;
      }
    },
    // 检查非空
    checkEmptyField: function (e) {
      if (this.isChangePwd == true) {
        console.log("开始检查密码是否为空的情况");
        let obj = this.changePwd;
        // console.log("检查对象", obj);
        if (String(obj.oldPassword).trim() != "" && obj.oldPassword != null && typeof obj.oldPassword !== undefined) {
          if (String(obj.newPassword).trim() != "" && obj.newPassword != null && typeof obj.newPassword !== undefined) {
            if (String(obj.newPasswordConfirm).trim() != "" && obj.newPasswordConfirm != null && typeof obj.newPasswordConfirm !== undefined) {
              this.setErrType(0);
              return true;
            }
          }
        }
      }
      if (this.isChangeProfile == true) {
        console.log("开始检查昵称是否为空的情况");
        // TODO 更改信息的非空判断
        let obj = this.changeProfile;
        console.log(obj);
        if (obj.newUsername != null && typeof obj.newUsername !== undefined && String(obj.newUsername).trim() != "") {
          this.setErrType(0);
          return true;
        }
      }
      this.setErrType(2)
      return false
    },
    // 检查密码格式
    checkPwd: function (e) {
      // 检查密码以及再次输入密码
      let pw = this.changePwd.newPassword;
      if (String(pw).trim() != "" && pw != null && typeof pw !== undefined) {
        let length = pw.length;
        if (length > 6 && length < 50) {
          if (this.tab !== 1) {
            let pw_c = this.changePwd.newPasswordConfirm;
            if (String(pw_c).trim() != "" && pw_c != null && typeof pw_c !== undefined) {
              if (String(pw_c) === String(pw)) {
                this.setErrType(0);
                return true;
              }
              else {
                this.setErrType(5);
                return false;
              }
            }
            else {
              return false;
            }
          }
          else {
            this.setErrType(0);
            return true;
          }
        }
        this.setErrType(4);
      }
      return false
    },
    // 检查新用户名格式
    checkUsername: function (e) {
      let length = this.changeProfile.newUsername.length;
      if (length < 4 || length > 50) {
        this.setErrType(3);
        return false;
      }
      this.setErrType(0);
      return true;
    },
    // 监听密码输入框变动
    handleInputChangePwd: function (e) {
      // 监听输入框
      let inputtype = e.target.dataset.inputtype;
      let value = e.detail.value;
      this.changePwd[inputtype] = value;
      // console.log("更改密码输入情况", this.changePwd)
    },
    // 监听昵称输入框变动
    handleInputChangeProfile: function (e) {
      let value = e.detail.value;
      this.changeProfile.newUsername = value;
    },
    // 登出确认模态框
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
    // 登出
    logout: async function (e) {
      console.log('登出');
      let res = null;
      if (this.isLogin && (app.globalData.token == uni.getStorageSync('token'))) {
        res = await userApi.logout(uni.getStorageSync('token'));
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
            url: '../../pages/login/login.vue'
          })
        }
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
    // 建设中提示框
    underConstruction: function (e) {
      utils.underConstruction(e);
    },
    // 错误提示框
    error: function (e) {
      utils.errorFound(e);
    },
    // 清除所有缓存
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
    // 退出模态框
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
    // 退出实质
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
    // 打开模态框
    changeAvatar: function (e) {
      // this.underConstruction(e);
      this.isChangeAvatar = true;
      this.isChangeProfile = false;
      this.isChangePwd = false;
      this.changePwd = {
        newPassword: "",
        oldPassword: "",
        newPasswordConfirm: ""
      };
    },
    // 打开模态框
    changeName: function (e) {
      // this.underConstruction(e);
      this.isChangeProfile = true;
      this.isChangePwd = false;
      this.isChangeAvatar = false;
      this.changePwd = {
        newPassword: "",
        oldPassword: "",
        newPasswordConfirm: ""
      };
    },
    // 打开模态框
    changePassword: function (e) {
      // this.underConstruction(e);
      // console.log("点击修改密码事件", e)
      this.isChangePwd = true;
      this.isChangeProfile = false;
      this.isChangeAvatar = false;
      // console.log(this.isChangePwd)
    },
    // 关闭模态框
    hideFloat: function (e) {
      this.isChangeAvatar = false;
      this.isChangePwd = false;
      this.isChangeProfile = false;
      this.changeProfile.newAvatar = this.userInfo.avatar_pic;
    },
    // 实质上修改密码
    changePwdFunc: async function (e) {
      if (!(this.checkEmptyField())) {
        // 优先级
        return;
      }
      if (!(this.checkPwd())) {
        return;
      }
      let res = await userApi.changePwd(this.changePwd, uni.getStorageSync('token'));
      // console.log("修改密码结果", res);
      if (res == "操作成功") {
        setTimeout(function () {
          uni.showToast({
            title: "修改成功",
            icon: "success",
            duration: 1500,
            mask: true
          })
        }, 1500)
        this.logout();
      }
      else {
        uni.showToast({
          title: res,
          icon: "error",
          duration: 1500,
          mask: true
        })
      }
      return;
    },
    // 实质上修改昵称
    changeProfileFunc: async function (e) {
      let _this = this;
      if (!(this.checkEmptyField())) {
        // 优先级
        return;
      }
      if (!(this.checkUsername())) {
        return;
      }
      let res = await userApi.changeUsername(this.changeProfile, uni.getStorageSync('token'));
      if (res == "操作成功") {
        app.globalData.userInfo.username = this.changeProfile.newUsername;
        this.userInfo.username = this.changeProfile.newUsername;
        uni.showToast({
          title: "修改成功",
          icon: "success",
          duration: 1500,
          mask: true
        });
        setTimeout(function () {
          _this.changeProfile.newUsername = "";
          _this.hideFloat();
          uni.reLaunch({
            url: '../../pages/my/my'
          })
        }, 1500)
      }
      else {
        uni.showToast({
          title: res,
          icon: "error",
          duration: 1500,
          mask: true
        })
      }
      return;
    },
    // 实质上修改头像
    changeAvatarFunc: async function (e) {
      let _this = this;
      let res = await userApi.changeAvatar(this.changeProfile, uni.getStorageSync('token'));
      if (res == "操作成功") {
        app.globalData.userInfo.avatar_pic = this.changeProfile.newAvatar;
        this.userInfo.avatar_pic = this.changeProfile.newAvatar;
        uni.showToast({
          title: "修改成功",
          icon: "success",
          duration: 1500,
          mask: true
        });
        setTimeout(function () {
          _this.changeProfile.newAvatar = _this.userInfo.avatar_pic;
          _this.hideFloat();
          uni.reLaunch({
            url: '../../pages/my/my'
          })
        }, 1500)
      }
      else {
        uni.showToast({
          title: res,
          icon: "none",
          duration: 1500,
          mask: true
        })

      }
    },
    // 上传图片方法
    uploadImg: async function () {
      let _this = this;
      uni.chooseMedia({
        count: 1,
        mediaType: "image",
        sourceType: ['album', 'camera'],
        sizeType: "compressed",
        success(res) {
          // console.log(res.tempFiles[0].tempFilePath);
          // console.log(res.tempFiles[0].size);
          if (res.tempFiles[0].size >= 5242880) {
            uni.showToast({
              title: '请上传小于5M的文件',
              icon: 'none',
              mask: true
            })
          }
          else {
            _this.changeProfile.newAvatar = res.tempFiles[0].tempFilePath;
            console.log(_this.changeProfile.newAvatar);
          }
        },
        error(err) {
          uni.showToast({
            title: '上传失败',
            icon: 'error',
            mask: true
          })
          return;
        }
      })
    },
    // 前往详细设置
    goSettings: function (e) {
      uni.navigateTo({
        url: '../../pages/u_settings/u_settings'
      });
    }
  },
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {
    this.flushStatus();
    this.changeProfile.newAvatar = this.userInfo.avatar_pic;
    this.isChangePwd = false;
    this.isChangeProfile = false;
    this.isChangeAvatar = false;
    // console.log("调用了MySettings组件")
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
@import "./modals.less";
</style>