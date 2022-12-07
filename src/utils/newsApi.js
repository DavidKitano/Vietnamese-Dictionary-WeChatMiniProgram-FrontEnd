const utils = require('./utils.js');
const userApi = require('./userApi.js');
const studyApi = require('./studyApi.js');

module.exports = {
    addFavoriteNews: addFavoriteNewsApi,
    removeFavoriteNews: deFavoriteNewsApi,
    getNewsList: getNewsListApi,
    getNews: getNewsApi,
    getSearchNewsResult: getSearchNewsResultApi,
    getFavoriteNews: getFavoriteNewsApi
}

// TODO 后端修bug中

/**
 * 获取新闻列表
 * 
 * @param {*} t token
 * @param {*} _page 页数
 * @param {*} _size 一页加载多少个
 * @returns 标准化的结果
 */
async function getNewsListApi(_page, _size, t) {
    console.log("传入参数", _page, _size);
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/news?page=' + _page + '&size=' + _size,
        header: {
            token: t
        }
    })
    console.log("新闻列表获取的结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 获取新闻详情
 * 
 * @param {*} _id 新闻id
 * @param {*} t token
 * @returns 标准化的结果
 */
async function getNewsApi(_id, t) {
    console.log("传入参数-新闻详情获取", _id);
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/news/' + _id,
        header: {
            token: t
        }
    })
    console.log("新闻详情获取的结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 收藏新闻
 * 
 * @param {*} t token
 * @param {*} _id 新闻id
 * @returns 标准化的结果
 */
async function addFavoriteNewsApi(_id, t) {
    console.log("收藏新闻传入参数", _id);
    const { data: res } = await wx.p.request({
        method: 'POST',
        url: 'https://vi.wzf666.top/news/collection',
        header: {
            token: t,
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
            newsId: _id
        }
    })
    console.log("收藏新闻的结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 取消收藏新闻
 * 
 * @param {*} t token
 * @param {*} _id 新闻id
 * @returns 标准化的结果
 */
async function deFavoriteNewsApi(_id, t) {
    console.log("取消收藏新闻传入参数", _id);
    const { data: res } = await wx.p.request({
        method: 'DELETE',
        url: 'https://vi.wzf666.top/news/collection',
        header: {
            token: t,
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
            newsId: _id
        }
    })
    console.log("取消收藏新闻的结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 搜索新闻结果Api
 * 
 * @param {*} _text 关键词文本，title，summary，body三个参数都有可能出现标签，标签里就是输入的关键词，可以if看下哪个参数有就呈现，比如在body，则summary就不用呈现
 * @param {*} _page 页码
 * @param {*} _size 一页多少条
 * @param {*} t token
 * @returns 标准化后的结果
 */
async function getSearchNewsResultApi(_text, _page, _size, t) {
    console.log("传入参数", _text, _page, _size);
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/news',
        body: {
            text: _text,
            size: _size,
            page: _page
        },
        header: {
            token: t,
            'content-type': 'application/x-www-form-urlencoded'
        }
    })
    console.log("新闻搜索获取的结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 获取收藏夹的新闻
 * 
 * @param {*} _page 页码
 * @param {*} _size 一页多少条
 * @param {*} t token
 * @returns 标准化结果
 */
async function getFavoriteNewsApi(_page, _size, t) {
    console.log("传入参数", _page, _size);
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/news/collection',
        header: {
            token: t,
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
            page: _page,
            size: _size
        }
    })
    console.log("收藏新闻获取的结果", res);
    return utils.statusCodeExplain(res);
}