<template>
  <div class="tooManyContent">
    <image class="tooManyContentImg" src="../../static/images/svgs/poop-62C6AC.svg" mode="scaleToFill" />
    <view class="tooManyContentSign">
      <view>匹配到了<slot></slot>条结果</view>
      <view>实在太多啦</view>
      <view>再精确一下关键词吧</view>
    </view>
    <image class="tooManyContentImg" src="../../static/images/svgs/poop-62C6AC.svg" mode="scaleToFill" />
  </div>
</template>

<script>
export default {
  name: "tooManyContent",
  props: {},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() { },
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() { },
  // 组件周期函数--监听组件数据更新之后
  updated() { },
  // 组件周期函数--监听组件激活(显示)
  activated() { },
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() { },
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() { },
}
</script>

<style lang="less" scoped>
@import './tooManyContent.less';
</style>