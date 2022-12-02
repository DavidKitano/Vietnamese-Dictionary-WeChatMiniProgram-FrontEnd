<template>
  <div class="settings">
    <scroll-view class="optionList">
      <view class="option">
        <view class="optionName">同步微信头像</view>
        <view class="optionAct">
          <button @tap="wxAvatarSync">同步</button>
        </view>
      </view>
      <view class="option">
        <view class="optionName">同步微信昵称</view>
        <view class="optionAct">
          <button @tap="wxNicknameSync">同步</button>
        </view>
      </view>
      <view class="split"></view>
      <!-- 每组单词数量 -->
      <picker class="picker" header-text="每组单词数量" mode="selector" range="{{groupSizeRange}}"
        value="{{picker.group_size}}" data-type='group_size' @change="customPickerChange">
        <view class="option" hover-class="wasTaped">
          <view class="optionName">每组单词数量</view>
          <view class="optionValue">{{ customTypeValue.group_size }}</view>
        </view>
      </picker>
      <view class="split"></view>

      <view class="option" hover-class="optionTapped" data-type="username" @tap="changeName">
        <image src="../../static/images/svgs/card_fill.svg"></image>
        <view class="optionName">更改昵称</view>
      </view>
      <view class="option" hover-class="optionTapped" data-type="pwd" @tap="changePassword">
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
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: "settings",
  components: {},
  props: {},
  data() {
    return {
      groupSizeRange: [10, 15, 20, 25, 30, 35, 40, '自定义'],
      modeNameRange: ['看词选义', '看词识义', '看义识词'],
      firstType: "",
      secondType: "",
      thirdType: "",
      groupSize: "",
      timingDuration: "",
      isWxUser: "",
    }
  },
  computed: {},
  methods: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() { },
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
} 
</script>

<style lang="less" scoped>
@import './u_settings.less';
@import '../../components/MySettings/MySettings.less';
</style>