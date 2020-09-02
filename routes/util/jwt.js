const { logger } = require('../../logger');
const jwt = require('jsonwebtoken');

// jwt密钥
const secret = 'kc7v5ao7';
// token名称
const tokenKey = 'token';
/**
 * 颁发jwt
 */
exports.publish = function (res, maxAge = 1000, info = {}) {
    const token = jwt.sign(info, secret, {
        expiresIn: maxAge
    })
    // 适配浏览器使用cookie
    res.cookie(tokenKey, token, {
        maxAge: maxAge * 1000,
        path: '/'
    })
    // 适配其他终端使用header
    res.header('authorization', token);
}
/**
 * 验证jwt
 */
exports.verify = function (req) {
    // 从req中取出token
    // 先尝试从cookie中获取
    // 若没有则从header中获取
    let { token } = req.cookies;
    if(!token){
        token = req.headers.authorization;
    }
    if(!token){
        return false;
    }
    // 处理token中带有bearer的情况
    token = token.split(' ').pop();
    try{
        const result = jwt.verify(token, secret);
        req.userId = result.userId;
        return true;
    }catch(err){
        logger.error(err);
        return false;
    }
}