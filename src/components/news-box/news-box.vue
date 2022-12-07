<template>
  <div class="news-box">
    <view class="title">
      <slot name="title"></slot>
    </view>
    <view class="split"></view>
    <view class="newsContent">
      <view class="resources">
        <slot name="resources"></slot>
      </view>
      <view class="summary">
        <slot name="summary"></slot>
      </view>
    </view>
    <view class="split"></view>
    <view class="categories">
      <view class="categoriesTitle">分类&nbsp;|&nbsp;</view>
      <slot name="category1"></slot>
      <slot name="category2"></slot>
    </view>
    <view class="pubTime">
      <view class="pubTimeTitle">发布时间&nbsp;|&nbsp;</view>
      <slot name="pubTime"></slot>
    </view>
    <view class="websiteName">
      <view class="websiteNameTitle">来源&nbsp;|&nbsp;</view>
      <slot name="websiteName"></slot>
    </view>
  </div>
</template>

<script>
export default {
  name: "news-box",
  props: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
  },
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
@import '../../components/news-box/news-box.less';
</style>