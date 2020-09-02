const { errResp }  = require('../util/respHelper');
const { logger } = require('../../logger');
const multer = require('multer');

// 处理错误的中间件
module.exports = function (err, req, res, next) {
    if (err) {
        if(err instanceof multer.MulterError){
            logger.error(err);
            return;
        }
        const errObj = err instanceof Error ? err.message : err;
        // 将错误日志打印在控制台
        logger.error(err);
        //发生了错误
        res.status(500).send(errResp(undefined, errObj));
    } else {
        next();
    }
}