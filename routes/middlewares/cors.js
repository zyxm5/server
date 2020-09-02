const allowOrigin = [
    'http://127.0.0.1:5500',
    'null'
]
module.exports = function(req, res, next){
    // 处理带预检的请求
    if(req.method === 'OPTIONS'){
        const method = req.headers['access-control-request-method'],
            headers = req.headers['access-control-request-headers'];
        res.header('access-control-allow-methods', method);
        res.header('access-control-allow-headers', headers);
    }
    res.header("access-control-allow-credentials", true);
    // 处理简单请求
    const { origin } = req.headers;
    if(origin && allowOrigin.includes(origin)){
        res.header('access-control-allow-origin', origin);
    }
    next();
}