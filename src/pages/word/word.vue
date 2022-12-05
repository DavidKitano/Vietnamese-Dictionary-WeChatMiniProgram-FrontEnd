<template>
  <div class="word">{{ wordInfo }}</div>
</template>

<script>
import { is } from '@babel/types';

const app = getApp();
const userApi = require('../../utils/userApi.js');
const studyApi = require('../../utils/studyApi.js');
const utils = require('../../utils/utils');

export default {
  name: "word",
  components: {},
  props: {},
  data() {
    return {
      isLogin: false,
      wordId: undefined,
      wordInfo: {
      }
    }
  },
  computed: {},
  methods: {
    flushStatus: function (e) {
      let isLogin = app.globalData.isLogin;
      this.isLogin = isLogin;
      this.getWords();
    },
    getWords: async function () {
      const res = await studyApi.getWordDetails(this.wordId, app.globalData.token);
      if (res.msg == "操作成功") {
        this.wordInfo = res.data;
      }
      else {
        if (typeof res == "object") {
          uni.showToast({
            icon: "none",
            duration: 1500,
            title: res.msg
          })
        }
        else {
          uni.showToast({
            icon: "none",
            duration: 1500,
            title: res
          })
        }
      }
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(options) {
    console.log(options);
    this.wordId = options.id
    this.flushStatus();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() { },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {
    this.flushStatus();
  },
  // 页面周期函数--监听页面隐藏
  onHide() { },
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
@import './word.less';
</style>