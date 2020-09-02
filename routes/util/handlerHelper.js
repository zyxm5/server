const {
    successResp,
} = require('./respHelper');
/**
 * 将函数经过try catch封装后返回
 */
module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            const result = await handler(req, res, next);
            console.log(successResp(result));
            res.send(successResp(result));
        } catch (error) {
            next(error);
        }
    }
}