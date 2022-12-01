<template>
  <div class="my">
    <MyInfos></MyInfos>
    <MySettings></MySettings>
    <hr>
  </div>
</template>

<script>
import MyInfos from "@/components/MyInfos/MyInfos.vue";
import MySettings from "@/components/MySettings/MySettings.vue";
const app = getApp();
const userApi = require('../../utils/userApi.js');

// if (app.globalData.tryingLogin) {
//   let _this = this
//   this.control.loginTimer = setInterval(function () {
//     if (!app.globalData.tryingLogin) {
//       _this.onShow()
//       clearInterval(_this.control.loginTimer)
//     }
//   }, 200)
// }
export default {

  name: "my",
  components: {
    MyInfos, MySettings
  },
  props: {},
  data() {
    return {
    }
  },
  computed: {},
  methods: {
    flushStatus: function (e) {
      let isLogin = app.globalData.isLogin
      this.isLogin = isLogin
    },
    reload() {
      // 页面重载
      const pages = getCurrentPages()
      const curPage = pages[pages.length - 1]
      curPage.onLoad(curPage.options)
      // 执行刷新
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    uni.setNavigationBarTitle({
      title: '越南单词本 - 我的',
    })

  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() { },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() { },
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
};
</script>

<style scoped>

</style>