const utils = require('./utils.js');
const userApi = require('./userApi.js');

import { toInteger } from "lodash";

module.exports = {
    getDailySentences: getDailySentencesApi,
    getWordsLearnNeeded: getWordsLearnNeededApi,
    getWordDetails: getWordDetailsApi,
    favoriteWord: favoriteWordApi,
    deFavoriteWord: deFavoriteWordApi,
    getFavoriteCollection: getFavoriteCollectionApi,
    chooseBooks: chooseBooksApi,
    getWordsFromOneBook: getWordsFromOneBookApi,
    getOneBook: getOneBookApi,
    getBooks: getBooksApi,
    getSearchContent: getSearchContentApi,
}

// TO-DO 除了延时、蒙版以外还可以应用的防抖操作
// 词书模块
// 学习模块

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
 * @param {String} t token
 * @returns 标准化结果
 */
async function getWordsLearnNeededApi(t) {
    console.log("传入参数", t)
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/learn/home/plan',
        header: {
            token: t
        }
    })
    // console.log("用户待学和需复习单词数量获取结果", res);
    return utils.statusCodeExplain(res);
}


/** 单词模块 */
/**
 * 获取单词详情
 * 
 * @param {Number} _id: 单词id
 * @param {String} t: token
 * @returns 标准化的结果 
 */
async function getWordDetailsApi(_id, t) {
    // 用onLoad: function(options){}获得参数，必要时可以通过this.setData({query:options})将参数全局化
    // console.log("检查传入参数", _id, t);
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/learn/word/' + _id,
        header: {
            token: t
        }
    })
    // console.log("单词获取的具体信息", res);
    return utils.statusCodeExplain(res);
}

/**
 * 收藏单词
 * 
 * @param {Number} _id: 单词id
 * @param {String} t: token
 * @returns 标准化的结果 
 */
async function favoriteWordApi(_id, t) {
    // console.log("检查传入参数", _id, t);
    const { data: res } = await wx.p.request({
        method: 'POST',
        url: 'https://vi.wzf666.top/learn/word/collection',
        header: {
            token: t,
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
            wordId: _id
        }
    })
    // console.log("收藏单词结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 取消收藏单词
 * 
 * @param {Number} _id: 单词id
 * @param {String} t: token
 * @returns 标准化的结果 
 */
async function deFavoriteWordApi(_id, t) {
    const { data: res } = await wx.p.request({
        method: 'DELETE',
        url: 'https://vi.wzf666.top/learn/word/collection',
        header: {
            token: t,
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
            wordId: _id
        }
    })
    // console.log("取消收藏单词结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 获取收藏夹单词列表
 * 
 * @param {String} t token
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
    // console.log("收藏夹单词列表获取结果", res);
    return utils.statusCodeExplain(res);
}




/** 学习(记录)模块 */





/** 词书模块 */
/**
 * 查找单词
 * 
 * @param {String} keyword 查询关键词
 * @param {Number} currentPage 当前页
 * @param {Number} pageSize 页大小
 * @param {Number} type 类型 0 为全词库检索 1为选择的词书中检索
 * @param {String} t token
 * @param {Number} bookId 词书id（在使用type 1时候需要传入），非必须
 * @return 标准化的结果
 */
async function getSearchContentApi(keyword, currentPage, pageSize, type, t, bookId) {
    // console.log("搜索单词传入参数检查", keyword, currentPage, pageSize, type);
    if (keyword == "") {
        return;
    }
    type = toInteger(type);
    if (type > 1 || type < 0 || typeof type != "number") {
        type = 0;
    }
    if (type == 0) {
        const { data: res } = await wx.p.request({
            method: 'GET',
            url: 'https://vi.wzf666.top/learn/book/word/search',
            header: {
                token: t
            },
            data: {
                keyWord: keyword,
                currentPage: currentPage,
                pageSize: pageSize,
                type: 0
            }
        })
        // console.log("搜索单词结果", res);
        return utils.statusCodeExplain(res);
    }
    else {
        const { data: res } = await wx.p.request({
            method: 'GET',
            url: 'https://vi.wzf666.top/learn/book/word/search',
            header: {
                token: t
            },
            data: {
                keyWord: keyword,
                currentPage: currentPage,
                pageSize: pageSize,
                type: 1,
                bookId: bookId

            }
        })
        // console.log("搜索单词结果", res);
        return utils.statusCodeExplain(res);
    }
}

/**
 * 获取所有词书Api
 * 
 * @param {string} t token 
 * @returns 标准化的结果
 */
async function getBooksApi(t) {
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/learn/book/',
        header: {
            token: t
        }
    })
    // console.log("获取所有词书结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 获取某本特定词书详情的Api
 * 
 * @param {number} _id 词书id
 * @param {string} t token
 * @returns 标准化后的结果
 */
async function getOneBookApi(_id, t) {
    // console.log("检查传入id", _id);
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/learn/book/' + _id,
        header: {
            token: t
        }
    })
    // console.log("获取特定词书结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 从某本特定词书中获取单词Api
 * 
 * @param {number} _id 词书id
 * @param {number} cp 当前页面
 * @param {number} ps 页面大小，一页几条
 * @param {string} t token
 * @returns 标准化后的结果
 */
async function getWordsFromOneBookApi(_id, cp, ps, t) {
    cp = toInteger(cp);
    ps = toInteger(ps);
    if (typeof cp != "number" || typeof ps != "number") {
        res.msg = "输入错误";
        return res;
    }
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/learn/book/word/' + _id,
        header: {
            token: t
        },
        data: {
            currentPage: cp,
            pageSize: ps
        }
    })
    // console.log("获取特定词书的单词结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 选择词书Api
 * 
 * @param {number} _id 词书id
 * @param {string} t token
 * @returns 标准化后的结果
 */
async function chooseBooksApi(_id, t) {
    const { data: res } = await wx.p.request({
        method: 'PUT',
        url: 'https://vi.wzf666.top/learn/book/',
        header: {
            token: t
        },
        data: {
            id: _id
        }
    })
    // console.log("选择词书结果", res);
    return utils.statusCodeExplain(res);
}


/** 统计模块 */