const Category = require('./Category');
const Food = require('./Food');

// Food和Category:一对一, Category和Food:一对多
Category.hasMany(Food);
Food.belongsTo(Category);