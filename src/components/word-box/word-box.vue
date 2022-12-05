<template>
  <view class="word-box" hover-class="wasTapped" hover-stay-time="50">
    <view class="ch">
      <slot name="ch"></slot>
    </view>
    <view class="vi">
      <slot name="vi"></slot>
    </view>
    <view class="en">
      <slot name="en"></slot>
    </view>
    <view class="wordTag">
      <slot name="wordTag"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "word-box",
  props: {},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  watch: {},
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
  },

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
@import './word-box.less';
</style>