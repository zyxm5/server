const handlerHelper = require('../util/handlerHelper');

/**
 * 分页查询api
 * @param { Object } service 对应service层
 * @param { Function } handler 处理函数
 * @param { String } path 
 * @param { Boolean } needToken 是否需要进行token认证
 */
exports.pageQueryApi = function (service, handler = handlerHelper(async req => {
    const query = req.query;
    const curPage = query.curPage || 1;
    const pageSize = query.pageSize || 50;
    return await service.pageQuery(curPage, pageSize, loginId);
}),  path = '', needToken = true) {
    return {
        method: 'GET',
        path,
        handler,
        needToken
    }
}

/**
 * 查询单个api
 * @param { Object } service 对应service层
 * @param { String } path 
 * @param { Function } handler 处理函数
 * @param { Boolean } needToken 是否需要进行token认证
 */
exports.getOneApi = function (service, path = '/:id', handler = handlerHelper(async req => {
    return await service.getModelById(req.params.id);
}), needToken = true) {
    return {
        method: 'GET',
        path,
        handler,
        needToken
    }
}

/**
 * 新增api
 * @param { Object } service 对应service层
 * @param { String } path 
 * @param { Function } handler 处理函数
 * @param { Boolean } needToken 是否需要进行token认证
 */
exports.addApi = function (service, path = '/', handler = handlerHelper(async req => {
    return await service.add(req.body);
}), needToken = true) {
    return {
        method: 'POST',
        path,
        handler,
        needToken
    }
}

/**
 * 更新api
 * @param { Object } service 对应service层
 * @param { String } path 
 * @param { Function } handler 处理函数
 * @param { Boolean } needToken 是否需要进行token认证
 */
exports.updateApi = function (service, path = '/:id', handler = handlerHelper(async req => {
    return await service.update(req.params.id, req.body);
}), needToken = true) {
    return {
        method: 'PUT',
        path,
        handler,
        needToken
    }
}

/**
 * 删除api
 * @param { Object } service 对应service层
 * @param { String } path 
 * @param { Function } handler 处理函数
 * @param { Boolean } needToken 是否需要进行token认证
 */
exports.deleteApi = function (service, path = '/:id', handler = handlerHelper(async req => {
    return await service.delete(req.params.id);
}), needToken = true) {
    return {
        method: 'DELETE',
        path,
        handler,
        needToken
    }
}
