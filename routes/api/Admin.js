const service = require('../../services/Admin');
const handlerHelper = require('../util/handlerHelper');
const apiHelper = require('../util/apiHelper');
const jwt = require('../util/jwt');
const { tokenKey } = require('../config');

const baseUrl = '/api/admin';
const apis = [
    // 登录
    {
        method: 'POST',
        path: '/login',
        handler: handlerHelper(async (req, res) => {
            const {
                username,
                password
            } = req.body;
            const result = await service.login(username, password);
            if (result) {
                // res.header('set-cookie', `token=${result.id};max-age=3600`)
                // 1.使用cookie的方式进行身份验证
                let value = result.id;
                // value = cryptor.encrypt(value.toString());
                // 适配浏览器使用cookie
                // res.cookie('token', value, {
                //     maxAge: 3600 * 1000,
                //     path: '/',
                //     domain: '127.0.0.1',
                // })
                // // 适配其他终端使用header
                // res.header('authorization', value);
                // 2.使用session的方式进行身份验证
                // req.session.loginUser = result;
                // 3.使用jwt的方式进行身份验证
                jwt.publish(res, undefined, {
                    userId: value
                })
            }
            return result;
        }),
        needToken: false
    },
    // 分页查询
    apiHelper.pageQueryApi(service, handlerHelper(async req => {
        const query = req.query;
        const curPage = query.curPage || 1;
        const pageSize = query.pageSize || 50;
        const username = query.username || '';
        return await service.pageQuery(curPage, pageSize, username);
    })),
    {
        method: 'GET',
        path: '/whoami',
        handler: handlerHelper(async req => {
            return await service.getModelById(req.userId);
        }),
        needToken: true
    },
    // 退出登录，用于处理通过cookie传递token的情况
    {
        method: 'GET',
        path: '/loginout',
        handler: handlerHelper(async (req,res) => {
            res.cookie(tokenKey, '', {
                maxAge: -1
            })
        }),
        needToken: true
    },
    // 查询单个
    apiHelper.getOneApi(service),
    // 新增
    apiHelper.addApi(service, undefined, undefined, false),
    // 更新
    apiHelper.updateApi(service),
    // 删除
    apiHelper.deleteApi(service)
];
apis.forEach(api => {
    api.path = baseUrl + api.path;
})

module.exports = apis;