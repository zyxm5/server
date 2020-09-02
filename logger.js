const log4js = require('log4js');
const path = require('path');

const getCommonAppender = (seq) => {
    return {
        type: 'dateFile',
        filename: path.resolve(__dirname, 'logs', seq, 'logging.log'),
        maxLogSize: 1024 * 1024,
        keepFileExt: true,
    }
}
const getCommonCategory = (seq) => {
    return {
        appenders: [seq],
        level: 'all'
    }
}
log4js.configure({
    appenders: {
        sql: getCommonAppender('sql'),
        api: getCommonAppender('api'),
        default: {
            type: 'stdout'
        }
    },
    categories: {
        sql: getCommonCategory('sql'),
        api: getCommonCategory('api'),
        default: getCommonCategory('default')
    }
});

process.on('exit', () => {
    log4js.shutdown();
})
exports.sqlLogger = log4js.getLogger('sql');
exports.apiLogger = log4js.getLogger('api');
exports.logger = log4js.getLogger();