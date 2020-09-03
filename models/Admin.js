const sequelize = require('./db');
const { DataTypes } = require('sequelize');
module.exports = sequelize.define('Admin', {
    // 在这里定义模型属性
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        // allowNull 默认为 true
        allowNull: false
    }
}, {
    // 这是其他模型参数
    paranoid: true //从此以后，该表的数据不会真正的删除，而是增加一列deletedAt，记录删除的时间
});