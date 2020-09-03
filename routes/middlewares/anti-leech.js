const url = require('url');
const {whiteList} = require('../config');
/**
 * 防盗链中间件
 */
module.exports = (req, res, next) => {
    // 通过判断请求头中的host和referer是否相同来实现
    let {
        host,
        referer
    } = req.headers;
    if (referer) {
        referer = url.parse(referer).host;
        if(!whiteList.includes(referer)){
            // 重写请求地址
            req.url = '/img/anti-leech.gif';
        }
    }
    next();
}