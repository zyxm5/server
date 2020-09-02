const model = require('../models/Admin');
const validate = require('validate.js');
const md5 = require('md5');
const {
    Op
} = require('sequelize');

validate.validators.notExist = async (loginId) => {
    const res = await exports.isExist(loginId);
    if (res) {
        return 'is already exist';
    } else {
        return;
    }
}

exports.isExist = async function (loginId) {
    return !!await model.findOne({
        where: {
            loginId
        }
    })
}
const rules = {
    loginId: {
        presence: {
            allowEmpty: false
        },
        type: 'string',
        // format: /^\w{5,18}$/,
    },
    loginPwd: {
        presence: {
            allowEmpty: false
        },
        type: 'string',
        // 至少包含一个数字字母或者特殊符号
        // format: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*?_.]).{5,18}$/,
    }
}

exports.login = async (loginId, loginPwd) => {
    const res = await model.findOne({
        where: {
            loginId,
            loginPwd: md5(loginPwd)
        }
    })
    if(res){
        return deletePwd(res);
    }
    return null;
}

exports.add = async adminObj => {
    // 校验规则中添加loginId唯一性校验
    rules.loginId.notExist = true;
    await validate.async(adminObj, rules);
    adminObj.loginPwd = md5(adminObj.loginPwd);
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
    // 判断loginId是否改变
    // 否：不处理
    // 是：判断修改后的loginId是否已存在
    const me = await model.findByPk(id);
    const {
        loginId
    } = adminObj;
    if (me.loginId !== loginId) {
        const another = await model.findOne({
            where: {
                loginId
            }
        })
        if (another) {
            throw new Error(`${loginId}已存在`);
        }
    }
    adminObj.loginPwd = md5(adminObj.loginPwd);
    await validate.async(adminObj, rules);
    const res = await model.update(adminObj, {
        where: {
            id
        }
    });
    return deletePwd(res);
}

exports.pageQuery = async (curPage = 1, pageSize = 10, loginId = '') => {
    const res = await model.findAndCountAll({
        attributes: {
            exclude: ['loginPwd', 'deletedAt']
        },
        where: {
            loginId: {
                [Op.like]: `%${loginId}%`
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
 * 去掉返回结果中的loginPwd字段
 * @param {*} model 
 */
function deletePwd(model) {
    const result = JSON.parse(JSON.stringify(model));
    delete result.loginPwd;
    delete result.deletedAt;
    return result;
}