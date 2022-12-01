async function registerApi(d) {
    uni.showLoading({
        title: '注册中',
        mask: true
    })
    console.log("进入注册交互");
    // console.log(d);
    const { data: res } = await wx.p.request({
        method: 'POST',
        url: 'https://vi.wzf666.top/user/register',
        data: {
            email: d.email,
            password: d.password
        }
    })
    console.log(res);
    if (res) {
        setTimeout(function () {
            uni.hideLoading()
        }, 1500)
    }
    return statusCodeExplain(res)
};

async function loginApi(d) {
    uni.showLoading({
        title: '登录中',
        mask: true
    })
    console.log("进入登录交互")
    console.log(d.password);
    const { data: res } = await wx.p.request({
        method: 'POST',
        url: 'https://vi.wzf666.top/user/login',
        data: {
            email: d.email,
            password: d.password
        }
    })
    // console.log(res);
    if (res) {
        setTimeout(function () {
            uni.hideLoading()
        }, 1500)
    }
    return statusCodeExplain(res)
}

async function wxLoginApi(c) {
    var result = {};
    var re_r = {};
    uni.showLoading({
        title: '快速登录中',
        mask: true
    })

    const { data: res } = await wx.p.request({
        method: 'POST',
        url: 'https://vi.wzf666.top/user/login',
        data: {
            code: c
        }
    })

    if (res) {
        setTimeout(function () {
            uni.hideLoading()
        }, 1500)
    }
    return statusCodeExplain(res)
}





async function logoutApi(t) {
    uni.showLoading({
        title: '退出登录中',
        mask: true
    })
    console.log("进入登录交互")
    const { data: res } = await wx.p.request({
        method: 'DELETE',
        url: 'http://vi.wzf666.top/user/logout',
        header: {
            token: t
        }
    })
    if (res) {
        setTimeout(function () {
            uni.hideLoading()
        }, 1500)
    }
    return statusCodeExplain(res)
}

async function getProfilesApi(t) {
    uni.hideTabBar();
    uni.showLoading({
        title: '资料加载中',
        mask: true
    })
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'http://vi.wzf666.top/user/information',
        header: {
            token: t
        }
    })
    if (res) {
        setTimeout(function () {
            uni.hideLoading();
            uni.showTabBar();
        }, 2200)
        console.log(res)
    }
    return res;
}

function statusCodeExplain(result) {
    try {
        switch (result.code) {
            default: return "非法操作";
            case 0:
            case 400:
                if (result.hasOwnProperty('data')) {
                    console.log("结果是个对象");
                    return {
                        msg: result.msg,
                        data: result.data
                    }
                }
                else {
                    console.log("结果是个String");
                    return result.msg;
                }
            case 402:
                return "输入不合法";
            case 403:
                return "权限不足";
            case 500:
                return "非法操作或内部错误";
            case 401:
                return "未登录或登录状态已失效";
        }
    }
    catch {
        return "非法操作";
    }
}

module.exports = {
    register: registerApi,
    login: loginApi,
    logout: logoutApi,
    getProfiles: getProfilesApi,
    wxLogin: wxLoginApi,
}