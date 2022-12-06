<template>
  <div class="foundContent">
    <image class="foundContentImg" src="../../static/images/svgs/dog_02_62C6AC.svg" mode="scaleToFill" />
    <view class="foundContentSign">
      <view>我们为您找到了</view>
      <view>
        <slot></slot>条结果喔
      </view>
    </view>
    <image class="foundContentImg" src="../../static/images/svgs/cat_03_62C6AC.svg" mode="scaleToFill" />
  </div>
</template>

<script>
export default {
  name: "foundContent",
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
@import './foundContent.less';
</style>