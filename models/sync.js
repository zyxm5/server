require('./Admin');
require('./Food');
require('./Category');
const sequelize = require('./db');

sequelize.sync({
    alter: true
}).then(() => {
    console.log('所有模型均已成功同步.');
})