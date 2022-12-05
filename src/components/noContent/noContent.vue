<template>
  <div class="noContent">
    <image class="noContentImg" src="../../static/images/svgs/dog_missing_62C6AC.svg" mode="scaleToFill" />
    <view class="noContentSign">
      <view>不管是谁</view>
      <view>都没有找到结果喔</view>
      <view>···</view>
    </view>
    <image class="noContentImg" src="../../static/images/svgs/cat_missing_62C6AC.svg" mode="scaleToFill" />
  </div>
</template>

<script>
export default {
  name: "noContent",
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
@import './noContent.less';
</style>