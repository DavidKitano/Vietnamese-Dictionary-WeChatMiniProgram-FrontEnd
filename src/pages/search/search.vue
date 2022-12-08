<!-- TODO 搜索历史 -->

<template>
  <view class="search">
    <view class="searchContainer">
      <view class="searchHeader">
        <input type="text" :value="searchWords" :focus="true" :always-embed="true" placeholder="请输入想查询的单词"
          placeholder-class="placeHolder" @input="handleInput" @confirm="search" />
        <image src="../../static/images/svgs/search-puppy-62C6AC.svg" mode="scaleToFill" @tap="search"></image>
      </view>
      <view :wx-if="(searchType == 1)" class="searchWarning">
        <view>当前搜索模式：特定词书</view>
        <view @tap="switchSearchMode" class="searchWarningSwitcher">&nbsp;切换为全局&nbsp;</view>
      </view>
    </view>
    <view class="searchContainer">
      <view :wx-if="!isHasContent">
        <noContent></noContent>
      </view>
      <view :wx-if="isHasContent" class="searchContent">
        <view class="tooMuchContainer" :wx-if="(searchContent.total > 100)">
          <tooManyContent>{{ searchContent.total }}</tooManyContent>
        </view>
        <view class="foundContainer" :wx-if="(searchContent.total <= 100 && searchContent.total > 0)">
          <foundContent>{{ searchContent.total }}</foundContent>
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
  </view>
</template>
<script>
import noContent from "@/components/noContent/noContent.vue";
import foundContent from "@/components/foundContent/foundContent.vue";
import tooManyContent from "@/components/tooManyContent/tooManyContent.vue";
import wordBox from "@/components/word-box/word-box.vue";
import { toInteger } from "lodash";

const app = getApp();
const userApi = require('../../utils/userApi.js');
const studyApi = require('../../utils/studyApi.js');
const utils = require('../../utils/utils');

export default {
  name: "search",
  components: { noContent, foundContent, tooManyContent, wordBox },
  props: {},
  data() {
    return {
      searchType: 0,
      isLoading: false, // 节流阀
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
    // 切换搜索模式
    switchSearchMode: function (e) {
      this.searchType = 0;
      console.log("当前搜索模式", this.searchType);
    },
    // 搜索
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
          this.currentPage = 1;
          const res = await studyApi.getSearchContent(this.searchWords, 1, 10, this.searchType, uni.getStorageSync('token'));
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
    // 去单词详情页
    goToWord: function (id, $event) {
      console.log("查看单词", id)
      uni.navigateTo({
        url: '../../pages/word/word?id=' + id
      })
    },
    // 刷新新页面(加载新页面实际)
    flushLoadNewPage: async function (e) {
      const res = await studyApi.getSearchContent(this.searchWords, this.currentPage + 1, 10, this.searchType, uni.getStorageSync('token'));
      return res;
    },
    // 加载新页面
    loadNewPage: async function (e) {
      if (this.isLoading) {
        return;
      }
      let _this = this;
      if (this.isHasContent) {
        this.isLoading = true;
        let res = await this.flushLoadNewPage();
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
        // console.log(res);
        let result = res.data.dataList;
        // let result = res
        console.log(result.length)
        if (result.length == 0) {
          uni.showLoading({
            mask: true
          });
          setTimeout(function () {
            uni.hideLoading({
              noConflict: true
            });

            uni.showToast({
              mask: true,
              title: "没有其它结果啦~",
              icon: "success"
            });
          }, 1000)
          uni.hideToast();
          this.isLoading = false;
        }
        else {
          uni.showLoading({
            mask: true
          });
          setTimeout(function () {
            uni.hideLoading();
          }, 1000)
          this.currentPage++;
          console.log("上拉触底第" + this.currentPage + "页");
          this.isLoading = false;
          this.searchContent.dataList = this.searchContent.dataList.concat(result)
        }
      }
      else {
        uni.showLoading();
        this.isLoading = false;
        uni.hideLoading();
        return;
      }
    },
    // 监听输入框
    handleInput: function (e) {
      let value = e.detail.value;
      this.searchWords = value;
      // console.log(this.searchWords);
    },
    // 刷新状态
    flushStatus: function (e) {
      let isLogin = app.globalData.isLogin;
      this.isLogin = isLogin;
      this.isHasContent = false;
      this.currentPage = 1;
      this.searchWords = "";
    }
  },
  watch: {},

  // 上拉触底监听
  onReachBottom(e) {
    this.loadNewPage();
  },

  // 页面周期函数--监听页面加载
  onLoad(options) {
    options.type = toInteger(options.type);
    if (options.type < 0 || options.type > 1 || typeof options.type != "number") {
      this.searchType = 0;
    }
    else {
      this.searchType = options.type;
    }
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
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
} 
</script>

<style lang="less" scoped>
@import './search.less';
</style>