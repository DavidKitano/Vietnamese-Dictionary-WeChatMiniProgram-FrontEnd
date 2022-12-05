const utils = require('./utils.js');
const userApi = require('./userApi.js');

module.exports = {
    getDailySentences: getDailySentencesApi,
    getWordsLearnNeeded: getWordsLearnNeededApi,
    getWordDetails: getWordDetailsApi,
    favoriteWord: favoriteWordApi,
    deFavoriteWord: deFavoriteWordApi,
    getFavoriteCollection: getFavoriteCollectionApi
}

// TO-DO 除了延时、蒙版以外还可以应用的防抖操作

/** 首页模块 */
/**
 * 获取每日例句
 * 
 * @returns 标准化的结果 
 */
async function getDailySentencesApi() {
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/learn/home/dailySentence',
    })
    // console.log("每日例句的结果获取", res);
    return utils.statusCodeExplain(res);
}

/**
 * 获取用户待学和需复习单词数量
 * 
 * @param {*} t token
 * @returns 
 */
async function getWordsLearnNeededApi(t) {
    // TO-DO 后端还没做好
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/learn/home/plan',
        header: {
            token: t
        }
    })
    console.log("用户待学和需复习单词数量获取结果", res);
    return utils.statusCodeExplain(res);
}






/** 单词模块 */
/**
 * 获取单词详情
 * 
 * @param {*} _id: 单词id
 * @param {*} t: token
 * @returns 标准化的结果 
 */
async function getWordDetailsApi(_id, t) {
    // 用onLoad: function(options){}获得参数，必要时可以通过this.setData({query:options})将参数全局化
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/learn/word/',
        header: {
            token: t
        },
        data: {
            id: _id
        }

    })
    console.log("单词获取的具体信息", res);
    return utils.statusCodeExplain(res);
}

/**
 * 收藏单词
 * 
 * @param {*} _id: 单词id
 * @param {*} t: token
 * @returns 标准化的结果 
 */
async function favoriteWordApi(_id, t) {
    const { data: res } = await wx.p.request({
        method: 'POST',
        url: 'https://vi.wzf666.top/learn/word/collection',
        header: {
            token: t
        },
        data: {
            wordId: _id
        }
    })
    console.log("收藏单词结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 取消收藏单词
 * 
 * @param {*} _id: 单词id
 * @param {*} t: token
 * @returns 标准化的结果 
 */
async function deFavoriteWordApi(_id, t) {
    const { data: res } = await wx.p.request({
        method: 'DELETE',
        url: 'https://vi.wzf666.top/learn/word/collection',
        header: {
            token: t
        },
        data: {
            wordId: _id
        }
    })
    console.log("取消收藏单词结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 获取收藏夹单词列表
 * 
 * @param {*} t token
 * @returns 结果 
 */
async function getFavoriteCollectionApi(t) {
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/learn/word/collection',
        header: {
            token: t
        }
    })
    console.log("收藏夹单词列表获取结果", res);
    return utils.statusCodeExplain(res);
}




/** 学习(记录)模块 */





/** 词书模块 */




/** 统计模块 */