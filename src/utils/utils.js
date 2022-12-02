function underConstructionFunc(e) {
    console.log(e);
    uni.showToast({
        title: '开发中',
        icon: "error",
        duration: 1500,
        mask: true
    })
}

function errorFunc(e) {
    console.log(e);
    uni.showToast({
        title: '内部错误，请重试',
        icon: "error",
        duration: 1500,
        mask: true
    })
}

function isObjectValueEqualFunc(a, b) {
    // console.log("传参检查", a, b);
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

function statusCodeExplainFunc(result) {
    try {
        switch (result.code) {
            default: return "非法操作";
            case 0:
            case 400:
                if (result.hasOwnProperty('data')) {
                    // console.log("结果是个对象");
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

module.exports = {
    statusCodeExplain: statusCodeExplainFunc,
    isObjectValueEqual: isObjectValueEqualFunc,
    underConstruction: underConstructionFunc,
    errorFound: errorFunc
}