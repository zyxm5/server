const sequelize = require('./db');
const { DataTypes } = require('sequelize');
module.exports = sequelize.define('Food', {
    // 在这里定义模型属性
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    protein: {
        type: DataTypes.DECIMAL,
        // allowNull 默认为 true
        allowNull: false
    },
    fat: {
        type: DataTypes.DECIMAL,
        // allowNull 默认为 true
        allowNull: false
    },
    carbohydrate: {
        type: DataTypes.DECIMAL,
        // allowNull 默认为 true
        allowNull: false
    },
    energy: {
        type: DataTypes.DECIMAL,
        // allowNull 默认为 true
        allowNull: false
    },
}, {
    // 这是其他模型参数
    paranoid: true //从此以后，该表的数据不会真正的删除，而是增加一列deletedAt，记录删除的时间
});