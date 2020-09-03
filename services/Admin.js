const model = require('../models/Admin');
const validate = require('validate.js');
const md5 = require('md5');
const {
    Op
} = require('sequelize');

validate.validators.notExist = async (username) => {
    const res = await exports.isExist(username);
    if (res) {
        return 'is already exist';
    } else {
        return;
    }
}

exports.isExist = async function (username) {
    return !!await model.findOne({
        where: {
            username
        }
    })
}
const rules = {
    username: {
        presence: {
            allowEmpty: false
        },
        type: 'string',
        // format: /^\w{5,18}$/,
    },
    password: {
        presence: {
            allowEmpty: false
        },
        type: 'string',
        // 至少包含一个数字字母或者特殊符号
        // format: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*?_.]).{5,18}$/,
    }
}

exports.login = async (username, password) => {
    const res = await model.findOne({
        where: {
            username,
            password: md5(password)
        }
    })
    if(res){
        return deletePwd(res);
    }
    return null;
}

exports.add = async adminObj => {
    // 校验规则中添加username唯一性校验
    rules.username.notExist = true;
    await validate.async(adminObj, rules);
    adminObj.password = md5(adminObj.password);
    const res = await model.create(adminObj);
    return deletePwd(res);
}

exports.delete = async id => {
    const res = await model.destroy({
        where: {
            id
        }
    })
    return !!res;
}

exports.update = async (id, adminObj) => {
    // 判断username是否改变
    // 否：不处理
    // 是：判断修改后的username是否已存在
    const me = await model.findByPk(id);
    const {
        username
    } = adminObj;
    if (me.username !== username) {
        const another = await model.findOne({
            where: {
                username
            }
        })
        if (another) {
            throw new Error(`${username}已存在`);
        }
    }
    adminObj.password = md5(adminObj.password);
    await validate.async(adminObj, rules);
    const res = await model.update(adminObj, {
        where: {
            id
        }
    });
    return deletePwd(res);
}

exports.pageQuery = async (curPage = 1, pageSize = 10, username = '') => {
    const res = await model.findAndCountAll({
        attributes: {
            exclude: ['password', 'deletedAt']
        },
        where: {
            username: {
                [Op.like]: `%${username}%`
            }
        },
        limit: +pageSize,
        offset: +pageSize * (curPage - 1)
    })
    return {
        datas: JSON.parse(JSON.stringify(res.rows)),
        total: res.count
    };
}

exports.getModelById = async function (id) {
    const result = await model.findByPk(id);
    if (result) {
        return deletePwd(result);
    }
    return null;
}

/**
 * 去掉返回结果中的password字段
 * @param {*} model 
 */
function deletePwd(model) {
    const result = JSON.parse(JSON.stringify(model));
    delete result.password;
    delete result.deletedAt;
    return result;
}