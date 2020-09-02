const {
    Sequelize
} = require('sequelize');
const { sqlLogger } = require('../logger');
// 方法 2: 分别传递参数 (其它数据库)
const sequelize = new Sequelize('diet', 'root', '', {
    host: 'localhost',
    dialect: 'mysql', /* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
    logging: (msg) => {
        sqlLogger.debug(msg);
    }
});

module.exports = sequelize;