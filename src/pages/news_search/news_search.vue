<template>
  <view class="news">
    <view class="searchContainer" :wx-if="isLogin">
      <view class="searchHeader">
        <input type="text" :value="searchWords" :focus="true" :always-embed="true" placeholder="请输入想查询的新闻"
          placeholder-class="placeHolder" @input="handleInput" @confirm="search" />
        <image src="../../static/images/svgs/search-puppy-62C6AC.svg" mode="scaleToFill" @tap="search"></image>
      </view>
    </view>
    <view class="searchContainer" :wx-if="isLogin">
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
        <view v-for="nl in searchContent.dataList" wx:key="id">
          <view class="newsContent" data-index="id">
            <newsBox @tap="goToNews(nl.id)">
              <rich-text :nodes="nl.title" slot="title"></rich-text>
              <rich-text :nodes="nl.summary" slot="summary"></rich-text>
              <view slot="category1">{{ nl.category1 }}</view>
              <view :wx-if="nl.category2" slot="category2">{{ nl.category2 }}</view>
              <view slot="pubTime">{{ nl.pubTime }}</view>
              <view slot="resources">
                <image hspace="5" vspace="5" :src="nl.resources[0]" mode="scaleToFill" class="resourceImg" />
              </view>
              <view slot="websiteName">{{ nl.websiteName }}</view>
            </newsBox>
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
import newsBox from "@/components/news-box/news-box.vue";

const app = getApp();
const userApi = require('../../utils/userApi.js');
const newsApi = require('../../utils/newsApi.js');
const utils = require('../../utils/utils');

export default {
  name: "search",
  components: { noContent, foundContent, tooManyContent, newsBox },
  props: {},
  data() {
    return {
      isLoading: false, // 节流阀
      isLogin: false,
      currentPage: 1,
      searchWords: "",
      isHasContent: false,
      searchContent: {
        "dataList": [
          {
            body: "",
            category1: "",
            category2: "",
            id: undefined,
            pubTime: undefined,
            resources: [
            ],
            summary: "",
            title: "",
            websiteName: ""
          }
        ],
        "pageCount": 0,
        "total": 0
      }
    }
  },
  computed: {},
  methods: {
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
          const res = await newsApi.getSearchNewsResult(this.searchWords, 1, 10, uni.getStorageSync('token'));
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
          for (var tmp = 0; tmp < this.searchContent.dataList.length; tmp++) {
            this.highlightKeywords(tmp);
          }
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
    // 去新闻详情页
    goToNews: function (id, $event) {
      console.log("查看新闻", id)
      uni.navigateTo({
        url: '../../pages/news_detail/news_detail?id=' + id
      })
    },
    // 刷新新页面(加载新页面实际)
    flushLoadNewPage: async function (e) {
      const res = await newsApi.getSearchNewsResult(this.searchWords, this.currentPage + 1, 10, uni.getStorageSync('token'));
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
        // console.log(result.length)
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
      this.currentPage = 0;
      this.searchWords = "";
    },
    // 高亮关键词
    highlightKeywords: function (n, $event) {
      if (this.searchContent.dataList[n].title.indexOf("<em>") != -1) {
        this.searchContent.dataList[n].title = this.searchContent.dataList[n].title.replace(/<em>/g, "<b style='background-color: gold;'>").replace(/<\/em>/g, "</b>")
        return;
      }
      if (this.searchContent.dataList[n].summary.indexOf("<em>") != -1) {
        this.searchContent.dataList[n].summary = "摘要中：" + this.searchContent.dataList[n].summary.replace(/<em>/g, "<b style='background-color: gold;'>").replace(/<\/em>/g, "</b>");
        return;
      }
      if (this.searchContent.dataList[n].body.indexOf("<em>") != -1) {
        let idx = this.searchContent.dataList[n].body.indexOf("<em>");
        let res = "正文中：" + this.searchContent.dataList[n].body.substring(idx - 10, idx + 120).replace(/<em>/g, "<b style='background-color: gold;'>").replace(/<\/em>/g, "</b>");
        this.searchContent.dataList[n].summary = res;
      }
    }
  },
  watch: {},

  // 上拉触底监听
  onReachBottom(e) {
    this.loadNewPage();
  },

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
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
} 
</script>

<style lang="less" scoped>
@import "../../pages/search/search.less";
@import "../../pages/news_search/news_search.less";
</style>