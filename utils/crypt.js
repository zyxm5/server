const crypto = require('crypto');
// 使用对称加密算法：AES 128
// 128位的密钥
const secret = Buffer.from('28y39loqf9ego3um');
// 准备一个随机向量iv
const iv = Buffer.from('4qtai2h8sac2y2hn');
exports.encrypt = function (str) {
    const cry = crypto.createCipheriv('aes-128-cbc',secret, iv);
    let result = cry.update(str, 'utf8', 'hex');
    result += cry.final('hex');
    return result;
}
exports.decrypt = function (str) {
    const decry = crypto.createDecipheriv('aes-128-cbc', secret, iv);
    let result = decry.update(str, 'hex', 'utf8');
    result += decry.final('utf8');
    return result;
}
