<template>
  <scroll-view scroll-y class="search">
    <view class="searchContainer">
      <view class="searchHeader">
        <input type="text" :value="searchWords" :always-embed="true" placeholder="请输入想查询的单词"
          placeholder-class="placeHolder" @input="handleInput" />
        <image src="../../static/images/svgs/search-puppy-62C6AC.svg" mode="scaleToFill" @tap="search" />
      </view>
    </view>
    <view class="searchContainer">
      <view :wx-if="!isHasContent">
        <noContent></noContent>
      </view>
      <view :wx-if="isHasContent">
        <view class="tooMuchContainer" :wx-if="(searchContent.total > 100)">
          <tooManyContent>{{ searchContent.total }}</tooManyContent>
        </view>
        <view v-for="dl in searchContent.dataList" wx:key="id">
          <view class="dailySentencesContent" data-index="id">
            <wordBox @tap="goToWord(dl.id)">
              <view slot="vi">{{ dl.vi }}</view>
              <view slot="ch">{{ dl.translationCh }}</view>
              <view slot="en">{{ dl.translationEn }}</view>
              <view slot="wordTag">{{ dl.tag }}</view>
            </wordBox>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>
<script>
import noContent from "@/components/noContent/noContent.vue";
import tooManyContent from "@/components/tooManyContent/tooManyContent.vue";
import wordBox from "@/components/word-box/word-box.vue";

const app = getApp();
const userApi = require('../../utils/userApi.js');
const studyApi = require('../../utils/studyApi.js');
const utils = require('../../utils/utils');

export default {
  name: "search",
  components: { noContent, tooManyContent, wordBox },
  props: {},
  data() {
    return {
      isLogin: false,
      currentPage: 1,
      searchWords: "",
      isHasContent: false,
      searchContent: {
        "dataList": [
          {
            id: 1,
            isDeleted: 0,
            pronunciation: undefined,
            tag: undefined,
            translationCh: undefined,
            translationEn: undefined,
            vi: undefined
          }
        ],
        "pageCount": 0,
        "total": 0
      }
    }
  },
  computed: {},
  methods: {
    search: async function (e) {
      console.log(this.searchWords);
      if (this.isLogin) {
        if (this.searchWords == "") {
          uni.showToast({
            title: '请输入关键词',
            icon: 'none',
            duration: 1500,
            mask: true
          })
        }
        else {
          const res = await studyApi.getSearchContent(this.searchWords, 1, 10, 0, app.globalData.token);
          if (res.data.total == 0) {
            this.isHasContent = false;
            return;
          }
          this.isHasContent = true;
          this.searchContent = res.data;
          console.log(this.searchContent)
        }
      }
      else {
        uni.showToast({
          title: '非法操作，请清除缓存并重启小程序重试',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    },
    goToWord: function (id, $event) {
      console.log("查看单词", id)
      uni.navigateTo({
        url: '../../pages/word/word?id=' + id
      })
    },
    handleInput: function (e) {
      // 监听输入框
      let value = e.detail.value;
      this.searchWords = value;
      // console.log(this.searchWords);
    },
    flushStatus: function (e) {
      let isLogin = app.globalData.isLogin;
      this.isLogin = isLogin;
      this.isHasContent = false;
      this.currentPage = 1;
      this.searchWords = "";
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.flushStatus();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {
  },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {
  },
  // 页面周期函数--监听页面隐藏
  onHide() {
  },
  // 页面周期函数--监听页面卸载
  onUnload() {
    this.flushStatus();
  },
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
@import './search.less';
</style>