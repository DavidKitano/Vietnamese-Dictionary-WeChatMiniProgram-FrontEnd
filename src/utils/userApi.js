const utils = require('./utils.js')

module.exports = {
    register: registerApi,
    login: loginApi,
    logout: logoutApi,
    getProfiles: getProfilesApi,
    wxLogin: wxLoginApi,
    modUserSettings: modUserSettingsApi,
    changePwd: changePwdApi,
    changeUsername: changeUsernameApi,
    changeAvatar: changeAvatarApi
}

// TODO 除了延时、蒙版以外还可以应用的防抖操作
// TODO API方法获取标准化（把除了获取以外的内容都搬出去）

/**
 * 用户注册API
 * 
 * @param {*} d 包含邮箱和密码的对象体
 * @returns 标准化的结果
 */
async function registerApi(d) {
    uni.showLoading({
        title: '注册中',
        mask: true
    })
    // console.log("进入注册交互");
    // console.log(d);
    const { data: res } = await wx.p.request({
        method: 'POST',
        url: 'https://vi.wzf666.top/user/register',
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
    return utils.statusCodeExplain(res)
};

/**
 * 用户登录API 
 * 
 * @param {*} d 包含邮箱和密码的对象体
 * @returns 标准化的结果
 */
async function loginApi(d) {
    uni.showLoading({
        title: '登录中',
        mask: true
    })
    // console.log("进入登录交互")
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
    return utils.statusCodeExplain(res)
}

/**
 * 微信登录API
 * 
 * @param {*} c 微信官方接口给出的唯一openId code值
 * @returns 标准化的结果
 */
async function wxLoginApi(c) {
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
    return utils.statusCodeExplain(res)
}

/**
 * 退出登录API
 * 
 * @param {*} t token
 * @returns 标准化的结果
 */
async function logoutApi(t) {
    uni.showLoading({
        title: '退出登录中',
        mask: true
    })
    // console.log("进入登出交互")
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
    return utils.statusCodeExplain(res)
}

/**
 * 获取账号个人信息及设置信息API
 * 
 * @param {*} t token
 * @returns 普通结果
 */
async function getProfilesApi(t) {
    try {
        uni.hideTabBar();
    } catch {
        console.log("无tabbar可关，或出现错误");
    }
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
            try {
                uni.hideLoading({
                    success() {
                        try {
                            uni.showTabBar();
                        } catch {
                            console.log("有tabbar显示错误")
                        }
                    },
                    fail() {
                        console.log("有隐藏加载条的错误")
                        // uni.showToast({
                        //     title: "未知错误",
                        //     mask: true,
                        //     icon: "none",
                        //     duration: 4000
                        // })
                    }
                });
            } catch {
                uni.showToast({
                    title: "未知错误",
                    mask: true,
                    icon: "none",
                    duration: 4000
                })
            }
        }, 2200)
        // console.log("获取个人信息结果", res)
    }
    return res;
}

/**
 * 修改用户设置API
 * 
 * @param {*} obj  包含完整设置内容的对象体
 * @param {*} t token
 * @returns 标准化的结果
 */
async function modUserSettingsApi(obj, t) {
    // console.log("传入参数检查", obj);
    const { data: res } = await wx.p.request({
        method: 'PUT',
        url: 'http://vi.wzf666.top/user/information',
        header: {
            token: t
        },
        data: obj
    })
    return (utils.statusCodeExplain(res));
}

/**
 * 修改密码API
 * 
 * @param {*} obj 包含新旧密码内容的对象体
 * @param {*} t token
 * @return 标准化的结果
 */
async function changePwdApi(obj, t) {
    let _obj = {
        oldPassword: obj.oldPassword,
        newPassword: obj.newPassword
    }
    if (_obj.oldPassword == "" || _obj.newPassword == "") {
        return;
    }
    const { data: res } = await wx.p.request({
        method: 'PUT',
        url: 'http://vi.wzf666.top/user/password',
        header: {
            token: t
        },
        data: _obj
    })
    return (utils.statusCodeExplain(res));
}

/**
 * 修改用户昵称API
 * 
 * @param {*} obj 含有用户名（和用户头像）的对象体，实际使用其中的newUsername字段
 * @param {*} t token
 * @returns 标准化后的结果
 */
async function changeUsernameApi(obj, t) {
    let newUsername = obj.newUsername;
    if (newUsername == "") {
        return;
    }
    const { data: res } = await wx.p.request({
        method: 'PUT',
        url: 'http://vi.wzf666.top/user/info',
        header: {
            token: t
        },
        data: {
            username: newUsername
        }
    })
    console.log("修改用户名接口返回", res);
    return (utils.statusCodeExplain(res));
}

/**
 * 修改用户头像Api，会优先调用上传图片Api
 * 
 * @param {*} obj 含有用户头像（和用户名）的对象体，实际使用其中的newAvatar字段
 * @param {*} t token
 * @returns 标准化后的结果
 */
async function changeAvatarApi(obj, t) {
    console.log("进入换头像交互");
    let uploadRes = await utils.uploadImg(obj.newAvatar, t);
    // console.log("换头像交互结果", uploadRes);
    if (uploadRes.msg == "操作成功") {
        console.log("上传成功");
        let path = uploadRes.data[0];
        const { data: res } = await wx.p.request({
            method: 'PUT',
            url: 'http://vi.wzf666.top/user/info',
            header: {
                token: t
            },
            data: {
                avatar: path
            }
        })
        console.log("换头像结果", res);
        return (utils.statusCodeExplain(res));
    }
    return uploadRes;
}