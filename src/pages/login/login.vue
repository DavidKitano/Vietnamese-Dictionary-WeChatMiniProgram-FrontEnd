<template>
  <view class="container">
    <div class="login">
      <view class="wrapper" :wx-if="(tab == 1)">
        <view class="title">登录</view>
        <input type="text" class="inputField email" placeholder="请输入邮箱" data-inputtype="email" @input="handleInput"
          confirm-type='next' @blur='checkEmail' />
        <input type="text" class="inputField pwd" password="true" placeholder="请输入密码" data-inputtype="password"
          @input="handleInput" confirm-type='done' />
        <view class="btnWrapper registerBtnWrapper">
          <view class="changeBtn registerBtn" @tap='changeType'>注册</view>
        </view>
        <view class="errmsg">{{ errmsg[errtype] }}</view>
        <button class="submit" type="primary" @tap="login" hover-class="wasTapped">确定</button>
      </view>

      <view class="wrapper" wx:else>
        <view class="title">注册</view>
        <input type="text" class="inputField email" placeholder="请输入邮箱" data-inputtype="email" @input="handleInput"
          confirm-type='next' @blur='checkEmail' />
        <input type="text" class="inputField middlePwd" password="true" placeholder="请输入密码" data-inputtype="password"
          @input="handleInput" confirm-type='next' @blur='checkPwd' />
        <input type="text" class="inputField pwd" password="true" placeholder="确认密码" data-inputtype="confirm_password"
          @input="handleInput" confirm-type='done' @blur='checkPwd' />
        <view class="btnWrapper">
          <view class="changeBtn loginBtn" @tap='changeType'>登录</view>
        </view>
        <view class="errmsg">{{ errmsg[errtype] }}</view>
        <button class="submit" type="primary" @tap="register" hover-class="wasTapped">确定</button>
      </view>

      <view class="wxLoginWrapper">
        <view class="loginBtn" hover-class="wasTapped" @tap='wxLogin'>
          <image class="logo" src='../../static/images/logo.png' mode='aspectFit'></image>
        </view>
        <view class="wxLoginTip">微信登录无需注册哦~</view>
      </view>

    </div>
  </view>
</template>

<script>
import { toInteger } from 'lodash';

const userApi = require('../../utils/userApi.js');
const app = getApp();

export default {
  name: "login",
  components: {},
  props: {},
  data() {
    return {
      user: {
      },
      isLogin: false,
      tab: 1,
      errmsg: [
        "",
        "非法错误",
        "请填写信息",
        "请输入可用的，正确格式的邮箱地址",
        "请输入正确的密码，长度大于6并小于50",
        "两次密码不一致，请重新输入"
      ],
      errtype: 0,
    }
  },
  computed: {},
  methods: {
    flushStatus: function (e) {
      let isLogin = app.globalData.isLogin
      this.isLogin = isLogin
    },
    register: async function (e) {
      if (!(this.checkEmptyField())) {
        // 优先级
        return;
      }
      if (!(this.checkEmail())) {
        return;
      }
      if (!(this.checkPwd())) {
        return;
      }
      console.log('通过前端注册校验');
      let email = this.user.email;
      let password = this.user.password;
      let res = await userApi.register({ email, password });
      if (String(res).trim() === "操作成功") {
        res = res + "，请尽快前往邮箱验证";
        this.changeType();
      }
      if (String(res).trim() === "邮箱已存在请使用其他邮箱注册") {
        res = "该邮箱已被注册，请前去激活或请使用其他邮箱注册";
      }
      uni.showToast({
        title: res, icon: "none", duration: 1600, mask: true
      })
    },
    login: async function (e) {
      if (!(this.checkEmptyField())) {
        //优先级
        return;
      }
      if (!(this.checkEmail())) {
        return;
      }
      console.log("通过前端登录校验");
      let email = this.user.email;
      let password = this.user.password;
      let res = await userApi.login({ email, password });
      // console.log(res);
      if (typeof res == "object") {
        // console.log("拿到了结果对象");
        this.token = res.data.token;
        uni.setStorageSync('token', res.data.token);
        res = res.msg;
      }
      if (String(res).trim() == "操作成功") {
        res = "登录成功，3秒后即将跳转";
        app.globalData.isLogin = true;
        // app.globalData.userInfo.isWxUser = false;
        this.isLogin = true;
        // if (uni.getStorageSync('token')) {
        //   app.globalData.token = uni.getStorageSync('token');
        // }

        // setTimeout(function () {
        //   uni.showToast({
        //     title: res, icon: "none", duration: 3000, mask: true
        //   })
        // }, 3000)
        // app.onShow();
        // app.globalData.ifFirstTimeLaunch = true;
        // uni.reLaunch({
        //   url: '../index/index'
        // })
        if (uni.getStorageSync('token')) {
          app.globalData.token = uni.getStorageSync('token');
        }
        uni.showToast({
          title: res, icon: "none", duration: 3500, mask: true
        })
        setTimeout(function () {
          app.onShow();
          app.globalData.ifFirstTimeLaunch = true;
          uni.reLaunch({
            url: '../index/index'
          })
        }, 3000)
      }
      uni.showToast({
        title: res, icon: "none", duration: 3500, mask: true
      })
    },
    getWxUserInfo: function () {
      return new Promise((resolve, reject) => {
        uni.getUserProfile({
          desc: '信息用于快捷登录及个人信息',
          success: (res) => {
            console.log(res)
            resolve(res)
          },
          fail: (err) => {
            console.log('获取微信用户信息失败')
            reject(err)
          }
        })
      })
    },
    wxLogin: async function (e) {
      var _this = this;
      console.log('微信登录')
      uni.login({
        success(r) {
          if (r.code) {
            uni.showModal({
              title: '提示',
              content: '允许我们读取您的微信头像、昵称等用于完善信息？',
              success(modal_r) {
                if (modal_r.confirm) {
                  console.log('用户点击确定')

                  let fin_res;
                  let res = userApi.wxLogin(r.code);
                  res.then(function (value) {
                    fin_res = value;
                    // if (!fin_res.userInfo) { return }
                    // let username = fin_res.userInfo.nickName
                    // let avatar_pic = fin_res.userInfo.avatarUrl
                    // let res1 = await userApi.wxLogin({ username, avatar_pic })
                    // console.log(res1)
                    // this.afterLogin(res1)
                    if (typeof fin_res == "object") {
                      console.log("拿到了结果对象");
                      _this.token = fin_res.data.token;
                      uni.setStorageSync('token', fin_res.data.token);
                      fin_res = fin_res.msg;
                    }

                    if (String(fin_res).trim() == "操作成功") {
                      fin_res = "登录成功，3秒后即将跳转";
                      app.globalData.isLogin = true;
                      // 用微信的头像和昵称
                      // _this.getWxUserInfo().then(function (infoTmp) {
                      //   let newUserInfo = infoTmp.userInfo;
                      //   // console.log(newUserInfo);
                      //   app.globalData.userInfo.avatar_pic = newUserInfo.avatarUrl;
                      //   app.globalData.userInfo.username = newUserInfo.nickName;

                      // });
                      _this.isLogin = true;
                      if (uni.getStorageSync('token')) {
                        app.globalData.token = uni.getStorageSync('token');
                      }
                      uni.showToast({
                        title: fin_res, icon: "none", duration: 4000, mask: true
                      })
                      setTimeout(function () {
                        app.onShow();
                        app.globalData.ifFirstTimeLaunch = true;
                        uni.reLaunch({
                          url: '../index/index'
                        })
                      }, 3000)
                    }
                    uni.showToast({
                      title: fin_res, icon: "none", duration: 3500, mask: true
                    })
                  })
                } else {
                  console.log('登录失败！' + r.errMsg)
                }
              }
            })
          } else if (modal_r.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    changeType: function (e) {
      // 小tab
      this.setErrType(0);
      this.user = {};
      if (this.tab == 1) {
        this.tab++;
      }
      else {
        this.tab = 1;
      }
    },
    setErrType: function (num) {
      // 对错误进行定义
      try {
        this.errtype = toInteger(num);
      }
      catch {
        this.errtype = 1;
      }
    },
    checkEmptyField: function (e) {
      // 检查非空
      let u = this.user;
      if (String(u.email).trim() != "" && u.email != null && typeof u.email !== undefined) {
        if (String(u.password).trim() != "" && u.password != null && typeof u.password !== undefined) {
          if (this.tab !== 1) {
            if (String(u.confirm_password).trim() != "" && u.confirm_password != null && typeof u.confirm_password !== undefined) {
              this.setErrType(0);
              return true;
            }
          } else {
            this.setErrType(0);
            return true;
          }
        }
      }
      this.setErrType(2)
      return false
    },
    checkPwd: function (e) {
      // 检查密码以及再次输入密码
      let pw = this.user.password;
      if (String(pw).trim() != "" && pw != null && typeof pw !== undefined) {
        let length = pw.length;
        if (length > 6 && length < 50) {
          if (this.tab !== 1) {
            let pw_c = this.user.confirm_password;
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
    checkEmail: function (e) {
      // 检查邮箱格式
      let regex_email = new RegExp(/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/);
      let tmp = null;
      try {
        tmp = String(this.user.email);
      }
      catch {
        tmp = "错误";
      }
      if (tmp.trim() != "" && tmp != null && typeof tmp !== undefined) {
        let result = regex_email.test(tmp);
        if (result) {
          this.setErrType(0);
          return true;
        }
        else {
          this.setErrType(3);
          return false;
        }
      }
      return false;
    },
    handleInput: function (e) {
      // 监听输入框
      let inputtype = e.target.dataset.inputtype
      let value = e.detail.value
      this.user[inputtype] = value
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.flushStatus();
    if (this.isLogin) {
      console.log("非法访问");
      app.onShow();
      app.globalData.ifFirstTimeLaunch = true;
      uni.reLaunch({
        url: '../index/index'
      });
    }
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
  },
  // 页面周期函数--监听页面卸载
  onUnload() { },
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
@import "./login.less";
</style>