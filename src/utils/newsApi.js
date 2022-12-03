const utils = require('./utils.js');
const userApi = require('./userApi.js');
const studyApi = require('./studyApi.js');

module.exports = {
    addFavoriteNews: addFavoriteNewsApi,
    getNewsList: getNewsListApi,
    getNews: getNewsApi
}

// TO-DO 全部内容后端开发中

/**
 * 获取新闻列表
 * 
 * @returns 标准化的结果
 */
async function getNewsListApi() {
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/news',
    })
    console.log("新闻列表获取的结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 获取新闻详情
 * 
 * @param {*} _id 新闻id
 * @returns 标准化的结果
 */
async function getNewsApi(_id) {
    const { data: res } = await wx.p.request({
        method: 'GET',
        url: 'https://vi.wzf666.top/news',
        data: {
            id: _id
        }
    })
    console.log("新闻获取的结果", res);
    return utils.statusCodeExplain(res);
}

/**
 * 收藏新闻
 * 
 * @returns 标准化的结果
 */
async function addFavoriteNewsApi() {
    const { data: res } = await wx.p.request({
        method: 'GET', // 感觉不应该是Get！后台会改
        url: 'https://vi.wzf666.top/news/collections',
    })
    console.log("收藏新闻的结果", res);
    return utils.statusCodeExplain(res);
}

