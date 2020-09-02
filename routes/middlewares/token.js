const { errResp } = require('../util/respHelper');
const { pathToRegexp } = require('path-to-regexp');
const cryptor = require('../../utils/crypt');
const allApi = require('../api/allApi');
const jwt = require('../util/jwt');

const needToken = allApi.filter(api => api.needToken);
module.exports = function(req, res, next){
    // 判断该接口是否需要进行token认证
    const apis = needToken.filter(api => {
        return api.method === req.method && pathToRegexp(api.path).test(req.path);
    })
    if(apis.length === 0){
        next();
        return;
    }
    // 1.通过cookie获取token
    // 从req中取出token
    // 先尝试从cookie中获取
    // 若没有则从header中获取
    // 若还没有则提示403
    // 若存在则进行token处理，并且放行
    // let token = req.cookies.token;
    // if(!token){
    //     token = req.headers.authorization;
    // }
    // if(!token){
    //     res.status(403).send(errResp(403,'you do not have any access to api'));
    //     return;
    // }
    // token = cryptor.decrypt(token);
    // // 将userId放到req中供后面的中间件使用
    // req.userId = token;
    // next();

    // 2.通过session获取token
    // console.log(req.session);
    // const { loginUser } = req.session;
    // if(!loginUser){
    //     res.status(403).send(errResp(403,'you do not have any access to api'));
    //     return;
    // }
    // req.userId = loginUser.id;

    // 3.通过jwt获取token
    const token = jwt.verify(req);
    if(!token){
        res.status(403).send(errResp(403,'you do not have any access to api'));
        return;
    }
    next();
}