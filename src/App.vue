<script>
const userApi = require('./utils/userApi.js');

export default {
  globalData: {
    /**
     * 
     * 可以用MobX进行管理
     * 
     */
    isFirstTimeLaunch: false,
    token: undefined,
    isLogin: false,
    userInfo: {
      settings: {
        // learn_repeat_t: 3,
        // group_size: 10,
        // learn_first_m: 'chooseTrans',
        // learn_second_m: 'recallTrans',
        // learn_third_m: 'recallWord',
        // learn_fourth_m: 'recallTrans',
        // timing: true,
        // timing_duration: 1000,
        // autoplay: false,
        // type: 1,
        // review_repeat_t: 2,
        // review_first_m: 'recallTrans',
        // review_second_m: 'chooseTrans',
        // review_second_m: 'recallWord',
        // review_third_m: 'recallTrans',
      }
    },
  },
  onLaunch: async function () {
    this.globalData.isFirstTimeLaunch = true;
    try {
      await uni.hideTabBar();
    } catch {
      console.log("有tabbar隐藏错误")
    }
    if (this.globalData.isFirstTimeLaunch) {
      console.log("App Launch");
      await this.flushStatus();
      this.globalData.isFirstTimeLaunch = false;
    }
  },
  onShow: async function () {
    if (!this.globalData.isFirstTimeLaunch) {
      console.log("App Show");
      await this.flushStatus();
    }
    setTimeout(async () => {
      console.log("wait for 2s")
      try {
        await uni.showTabBar();
      } catch {
        console.log("有tabbar显示错误")
      }
    }, 1000)



    // console.log(this.globalData)
  },
  onHide: function () {
    console.log("App Hide");
  },
  components: {},
  methods: {
    underConstruction: function (e) {
      console.log(e);
      uni.showToast({
        title: '开发中',
        icon: "error",
        duration: 1500,
        mask: true
      })
    },
    err: function (e) {
      console.log(e);
      uni.showToast({
        title: '内部错误，请重试',
        icon: "error",
        duration: 1500,
        mask: true
      })
    },
    flushStatus: async function (e) {
      this.globalData.token = uni.getStorageSync('token');
      if (this.globalData.token) {
        this.globalData.isLogin = true;
        await this.getProfiles();
        console.log("检测到已登录状态")
        // console.log(this)
      }
      else {
        this.globalData.isLogin = false;
        console.log("检测到未登录")
      }
    },
    getProfiles: async function (e) {
      let res = await userApi.getProfiles(this.globalData.token);
      if (res.code == 0 && res.msg == "操作成功") {
        console.log("从服务器获取设置和个人信息中", res)
        let profile = res.data.user;
        let settings = res.data.userConfig;

        /** 
         *
         * 由于后台当时的传参不完整导致在微信登录和普通登录初始化时得到的参数不一样，通用的写法会抛出错误
         * 故此处把所有需要初始化的公共参数都用try/catch包裹最大化防止错误
         * 
         * ※ 追记：后端已修正，可以通用统一用对象赋值初始化了 
         * 
         * **/

        try { this.globalData.userInfo.avatar_pic = "https://vi.wzf666.top" + profile.avatar; } catch { console.log("在初始化头像时出现错误") }
        try { this.globalData.userInfo.username = profile.username; } catch { console.log("在初始化用户名时出现错误") }
        // try { this.globalData.userInfo.user_id = profile.user_id; } catch { console.log("在初始化用户id时出现错误") }
        try { this.globalData.userInfo.isWxUser = profile.isWxUser; } catch { console.log("在初始化微信用户时出现错误") }
        try {
          this.globalData.userInfo.settings.firstType = settings.firstType; //第一次学习类型
        } catch { console.log("在第一次学习类型时出现错误"); }
        try {
          this.globalData.userInfo.settings.secondType = settings.secondType; //第二次学习类型
        } catch { console.log("在第二次学习类型时出现错误") }
        try {
          this.globalData.userInfo.settings.thirdType = settings.thirdType; //第三次学习类型
        } catch { console.log("在第三次学习类型时出现错误") }
        try {
          this.globalData.userInfo.settings.groupSize = settings.groupSize; //每组学习单词数量
        } catch { console.log("在每组学习单词数量时出现错误") }
        try {
          this.globalData.userInfo.settings.timingDuration = settings.timingDuration; //看词识义 看义识词持续时间
        } catch { console.log("在看义识词持续时间时出现错误"); }
        // console.log("全局变量", this.globalData)
        // console.log("获取到的信息", profile)
      }
      else {
        this.globalData.token = undefined;
        this.globalData.isLogin = false;
        uni.removeStorageSync('token');
        console.log("无法从服务器获取设置和个人信息，可能是token过期，非法操作或服务器错误，请重新登录")
        setTimeout(function () {
          uni.showToast({
            title: '登录已失效',
            icon: 'error',
            mask: true
          })
        }, 1000)
      }
    }
  }
};
</script>

<style lang="less">
body,
html,
view,
.container {
  margin: 0;
  padding: 0;
  font-family: "Microsoft YaHei", "Franklin Gothic Medium", "Arial Narrow",
    Arial, sans-serif;
}

.hidden {
  display: none;
}
</style>
