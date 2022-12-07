/**
 * 开发中提示框
 * 
 * @param {*} e 源
 */
function underConstructionFunc(e) {
    console.log(e);
    uni.showToast({
        title: '开发中',
        icon: "error",
        duration: 1500,
        mask: true
    })
}

/**
 * 内部错误提示框
 * 
 * @param {*} e 源
 */
function errorFunc(e) {
    console.log(e);
    uni.showToast({
        title: '内部错误，请重试',
        icon: "error",
        duration: 1500,
        mask: true
    })
}

/**
 * 检查两个Object(对象)类型变量是否全等
 * 
 * @param {*} a Object(对象) 1
 * @param {*} b Object(对象) 2
 * @returns 结果，布尔值
 */
function isObjectValueEqualFunc(a, b) {
    console.log("传参检查", a, b);
    let aType = typeof a;
    let bType = typeof b;
    if (aType !== bType) {
        return false;
    }
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

/**
 * 返回状态/结果标准化
 * 
 * @param {*} result 获取到的普通结果
 * @returns 标准化后的结果
 */
function statusCodeExplainFunc(result) {
    try {
        switch (result.code) {
            default: return "非法操作";
            case 0:
            case 400:
                if (result.hasOwnProperty('data')) {
                    // console.log("结果是个对象", result.data);
                    return {
                        msg: result.msg,
                        data: result.data
                    }
                }
                else {
                    // console.log("结果是个String");
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

/**
 * 上传图片API
 * 
 * @param {*} p 图片路径
 * @param {*} t token
 * @return 标准化后的结果 
 */
async function uploadImgApi(p, t) {
    console.log("进入上传图片交互，参数", p);
    const { data: res } = await wx.p.uploadFile({
        // method: 'POST',
        name: 'files',
        filePath: p,
        url: 'http://vi.wzf666.top/common/upload',
        header: {
            token: t,
            'content-type': 'multipart/form-data'
        },
        formData: {
            files: p
        }
    })
    if (typeof res == "string") {
        var real_res = {};
        real_res = JSON.parse(res);
    }
    console.log("图片上传结果", real_res);
    return (statusCodeExplainFunc(real_res));
}

module.exports = {
    statusCodeExplain: statusCodeExplainFunc,
    isObjectValueEqual: isObjectValueEqualFunc,
    underConstruction: underConstructionFunc,
    errorFound: errorFunc,
    uploadImg: uploadImgApi
}