exports.errResp = function (code = 500, msg = "") {
    return {
        code,
        msg
    }
}

exports.successResp = function (data) {
    return {
        code: 0,
        msg: '',
        data
    }
}