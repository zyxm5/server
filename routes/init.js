const express = require('express');
const path = require('path');
const apiConfig = require('./util/apiConfig');
const cors = require('cors');
const session = require('express-session');

const app = express();

// 加入cookie-parser 中间件
// 加入之后，会在req对象中注入cookies属性，用于获取所有请求传递过来的cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//配置token中间件
app.use(require('./middlewares/token'));

// 配置session中间件
// app.use(session({
//     secret: 'true'
// }))

// 配置防盗链中间件
app.use(require('./middlewares/anti-leech'));

//配置静态资源映射中间件
const staticPath = path.resolve(__dirname, '../public');
app.use(express.static(staticPath));

// 配置cors中间件
// app.use(require('./corsMiddleware'));
// 默认支持简单请求和预检请求
// 白名单
const { whiteList } = require('./config');
app.use(cors({
    origin(origin, callback) {
        if (!origin || whiteList.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('not allowd cors'));
        }
    },
    credentials: true
}));


// 配置x-www-form-urlencoded格式请求中间件
app.use(express.urlencoded({
    extended: true
}));

// 配置application/json格式请求中间件
app.use(express.json());

// 配置日志记录中间件
app.use(require('./middlewares/log'));

// 配置服务器代理
app.use(require('./middlewares/proxy'));

// 配置验证码
app.use(require('./api/captcha'));

// 配置api
apiConfig(app);
// 上传
app.use('/api/upload', require('./api/upload'));
// 下载
app.use('/api/res', require('./api/download'));

// 配置错误处理中间件
app.use(require('./middlewares/error'));

const port = 8000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
})