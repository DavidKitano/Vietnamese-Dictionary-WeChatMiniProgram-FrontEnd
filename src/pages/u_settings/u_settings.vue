<template>
  <scroll-view class="settings">
    <view class="settingsTitle">
      <image src="../../static/images/svgs/settings-blue.svg" mode="scaleToFill" />
      <view class="settingsTitleName">设置</view>
    </view>
    <view class="optionList">
      <view :wx-if="isWxUser" class="optionDisabled">
        <view class="optionName">
          <view>同步微信头像</view>
          <view @tap="newPolicyWarning">
            <image class="optionDisabledImg" src="../../static/images/svgs/notice.svg" mode="scaleToFill" />
          </view>
        </view>
        <view class="optionValue">
          <!-- <button @tap="wxAvatarSync">同步</button> -->
          <button disabled="true">同步</button>
        </view>
      </view>
      <view :wx-if="isWxUser" class="optionDisabled">
        <view class="optionName">
          <view>同步微信昵称</view>
          <view @tap="newPolicyWarning">
            <image class="optionDisabledImg" src="../../static/images/svgs/notice.svg" mode="scaleToFill" />
          </view>
        </view>
        <view class="optionValue">
          <!-- <button @tap="wxNicknameSync">同步</button> -->
          <button disabled="true">同步</button>
        </view>
      </view>
      <view :wx-if="isWxUser" class="split"></view>
      <!-- 每组单词数量 -->

      <picker header-text="每组单词数量" mode="selector" :range="groupSizeRange" :value="groupSizeIndex"
        data-type='group_size' @change="bindPickerChange">
        <view class="option" hover-stay-time="50" hover-class="optionTapped">
          <view class="optionName">每组单词数量</view>
          <view class="optionValue">{{ groupSizeRange[groupSizeIndex] }}&nbsp;&nbsp;···</view>
        </view>
      </picker>


      <view class="split"></view>

      <picker header-text="第一次学习方式" mode="selector" :range="modeNameRange" :value="picker.firstType"
        data-type='first_type' @change="bindPickerChange">
        <view class="option" hover-stay-time="50" hover-class="optionTapped">
          <view class="optionName">第一次学习方式</view>
          <view class="optionValue">{{ modeNameRange[picker.firstType] }}&nbsp;&nbsp;···</view>
        </view>
      </picker>


      <picker header-text="第二次学习方式" mode="selector" :range="modeNameRange" :value="picker.secondType"
        data-type='second_type' @change="bindPickerChange">
        <view class="option" hover-stay-time="50" hover-class="optionTapped">
          <view class="optionName">第二次学习方式</view>
          <view class="optionValue">{{ modeNameRange[picker.secondType] }}&nbsp;&nbsp;···</view>
        </view>
      </picker>

      <picker header-text="第三次学习方式" mode="selector" :range="modeNameRange" :value="picker.thirdType"
        data-type='third_type' @change="bindPickerChange">
        <view class="option" hover-stay-time="50" hover-class="optionTapped">
          <view class="optionName">第三次学习方式</view>
          <view class="optionValue">{{ modeNameRange[picker.thirdType] }}&nbsp;&nbsp;···</view>
        </view>
      </picker>

      <view class="split"></view>

      <picker header-text="看义识词持续时间" mode="selector" :range="timingDurationRange" :value="timingDurationIndex"
        data-type='timing_duration' @change="bindPickerChange">
        <view class="option" hover-stay-time="50" hover-class="optionTapped">
          <view class="optionName">看义识词持续时间</view>
          <view class="optionValue">{{ timingDurationRange[timingDurationIndex] }}&nbsp;&nbsp;···</view>
        </view>
      </picker>

      <view class="split"></view>

      <view :wx-if="isWxUser" class="option" @tap="default_ize($event)">
        <view class="optionName">还原默认</view>
        <view class="optionValue">···</view>
      </view>

      <view class="split"></view>

      <view :wx-if="isWxUser" class="option" @tap="underConstruction($event)">
        <view class="optionName">绑定邮箱</view>
        <view class="optionValue">···</view>
      </view>

      <view class="split"></view>

      <view :wx-if="isWxUser" class="option" @tap="underConstruction($event)">
        <view class="optionName">反馈 & 建议</view>
        <view class="optionValue">···</view>
      </view>
      <view :wx-if="isWxUser" class="option" @tap="underConstruction($event)">
        <view class="optionName">关于我们</view>
        <view class="optionValue">···</view>
      </view>


      <!-- under construction -->
      <!-- <page-container :show="isCustomize" :duration="500" :overlay="true" position="bottom" :round="true"
        @afterleave="pageleave" @enter="onEnter">
        <view class="customizeWrapper">
          <input type="text" class="customValue" :value="inputValue" :always-embed="true" :placeholder="placeholder"
            placeholder-class="placeHolder" :focus="focus" @input="handleInput" confirm-type="done"
            @confirm="onConfirmInput" />
          <view class="btn" hover-stay-time="50" hover-class="optionTapped" @tap="confirmCustomize">确认</view>
        </view>
      </page-container> -->
    </view>
  </scroll-view>
</template>

<script>
const app = getApp();
const userApi = require('../../utils/userApi.js');
const utils = require('../../utils/utils.js')

export default {
  name: "settings",
  components: {},
  props: {},
  data() {
    return {
      token: undefined,
      timingDurationRange: [1000, 1500, 2000, 2500, 3000, 3500, 4000],
      timingDurationIndex: 3,
      groupSizeRange: [10, 15, 20, 25, 30, 35, 40],
      groupSizeRangeObj: [
        { id: 0, value: 10 },
        { id: 1, value: 15 },
        { id: 2, value: 20 },
        { id: 3, value: 25 },
        { id: 4, value: 30 },
        { id: 5, value: 35 },
        { id: 6, value: 40 }
      ],
      groupSizeIndex: 0,
      modeNameRange: ['看词选义', '看词识义', '看义识词'],
      picker: {
        firstType: 0,
        secondType: 1,
        thirdType: 2,
        groupSize: 10,
        timingDuration: 2000,
      },
      isWxUser: undefined,
      isLogin: undefined
    }
  },
  computed: {},
  methods: {
    underConstruction: function (e) {
      utils.underConstruction(e);
    },
    error: function (e) {
      utils.errorFound(e);
    },
    newPolicyWarning: function (e) {
      try {
        uni.showModal({
          title: "新政策通知",
          content: "由于微信官方调整业务策略，头像和昵称的获取皆无法自动完成，若有需要请手动更换头像和昵称。",
          showCancel: false,
          confirmText: "我知道啦"
        })
      } catch {
        console.log("policy警告加载失败")
      }
    },
    flushStatus: function (e) {
      // console.log("公共变量", app.globalData)
      // console.log("初始化/刷新前的私有变量", this.picker)
      let isLogin = app.globalData.isLogin;
      let isWxUser = undefined;
      let picker = {};
      if (isLogin && uni.getStorageInfoSync('token')) {
        isWxUser = app.globalData.userInfo.isWxUser;
        // 深拷贝
        picker = { ...app.globalData.userInfo.settings };
      }
      switch (picker.groupSize) {
        case 10:
          { this.groupSizeIndex = 0; break; }
        case 15:
          { this.groupSizeIndex = 1; break; }
        case 20:
          { this.groupSizeIndex = 2; break; }
        case 25:
          { this.groupSizeIndex = 3; break; }
        case 30:
          { this.groupSizeIndex = 4; break; }
        case 35:
          { this.groupSizeIndex = 5; break; }
        case 40:
          { this.groupSizeIndex = 6; break; }
        // case "自定义":
        //   { this.groupSizeIndex = 7; break; }
        default: this.groupSizeIndex = 0;
      }
      switch (picker.timingDuration) {
        case 1000:
          { this.timingDurationIndex = 0; break; }
        case 1500:
          { this.timingDurationIndex = 1; break; }
        case 2000:
          { this.timingDurationIndex = 2; break; }
        case 2500:
          { this.timingDurationIndex = 3; break; }
        case 3000:
          { this.timingDurationIndex = 4; break; }
        case 3500:
          { this.timingDurationIndex = 5; break; }
        case 4000:
          { this.timingDurationIndex = 6; break; }
        // case "自定义":
        //   { this.groupSizeIndex = 7; break; }
        default: this.timingDurationIndex = 0;
      }
      this.isLogin = isLogin
      this.token = app.globalData.token;
      this.picker = picker
      this.isWxUser = isWxUser;
      // console.log("初始化/刷新后的私有变量", this.picker)
    },
    default_ize: function (e) {
      let default_obj = {
        firstType: 0,
        secondType: 1,
        thirdType: 2,
        groupSize: 20,
        timingDuration: 2500
      }
      let default_gsIndex = 2;
      let default_tdIndex = 3;
      let _this = this;
      wx.showModal({
        title: '确认',
        content: '确认要还原成默认状态吗',
        success(res) {
          if (res.confirm) {
            _this.groupSizeIndex = default_gsIndex;
            _this.timingDurationIndex = default_tdIndex;
            _this.picker = default_obj;
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    bindPickerChange: function (e) {
      console.log("picker的值为", this.picker, "\n可选范围为", this.groupSizeRange)
      console.log('picker发送选择改变，携带值为', e.detail.value)
      console.log('该picker是', e);
      // e.target.dataset.type 区别
      if (e.target.dataset.type == 'group_size') {
        if ((e.detail.value < 7) && (e.detail.value >= 0)) {
          this.groupSizeIndex = e.detail.value;
        }
        // else if (e.detail.value == 7) {
        //   console.log("进入自定义groupSize");
        // }
        else {
          console.log("出现预料外groupSize索引数值");
          this.groupSizeIndex = 0;
        }
      } else if (e.target.dataset.type == 'first_type') {
        this.picker.firstType = e.detail.value;
      } else if (e.target.dataset.type == 'second_type') {
        this.picker.secondType = e.detail.value;
      } else if (e.target.dataset.type == 'third_type') {
        this.picker.thirdType = e.detail.value;
      } else if (e.target.dataset.type == 'timing_duration') {
        if ((e.detail.value < 7) && (e.detail.value >= 0)) {
          this.timingDurationIndex = e.detail.value;
        }
        else {
          console.log("出现预料外timingDuration索引数值");
          this.timingDurationIndex = 0;
        }
      }
      else {
        console.log("picker出现预料外的值")
      }
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.flushStatus();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() { },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {
    this.flushStatus();
  },
  // 页面周期函数--监听页面隐藏
  onHide() {
  },
  // 页面周期函数--监听页面卸载
  onUnload() {
    let newGroupSize = this.groupSizeRange[this.groupSizeIndex];
    let newFirstType = this.picker.firstType;
    let newFirstTypeName = this.modeNameRange[newFirstType];
    let newSecondType = this.picker.secondType;
    let newSecondTypeName = this.modeNameRange[newSecondType];
    let newThirdType = this.picker.thirdType;
    let newThirdTypeName = this.modeNameRange[newThirdType];
    let newTimingDuration = this.timingDurationRange[this.timingDurationIndex];
    // console.log("将保存以下数据：\ngroupSize:", newGroupSize,
    //   "\n依次123学习类型:", newFirstTypeName, "(", newFirstType, ")", newSecondTypeName, "(", newSecondType, ")", newThirdTypeName, "(", newThirdType, ")",
    //   "\n持续时间", newTimingDuration)
    let newObj = {
      firstType: newFirstType,
      secondType: newSecondType,
      thirdType: newThirdType,
      groupSize: newGroupSize,
      timingDuration: newTimingDuration
    }
    if (!utils.isObjectValueEqual(newObj, app.globalData.userInfo.settings)) {
      modTmp(this.token);
    }
    else {
      console.log("未作出任何设置改动");
    }
    async function modTmp(t) {
      let res = await userApi.modUserSettings(newObj, t);
      if (res) {
        // console.log("修改用户设置结果为", res)
        if (res == "操作成功") {
          app.onShow();
        }
      }
    }
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
@import './u_settings.less';
@import '../../components/MySettings/MySettings.less';
</style>