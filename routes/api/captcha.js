const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');

router.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create({
        ignoreChars: '0oO1lLiI',
        color: true,
        noise: 4
    });
    // 不区分大小写
	req.session.captcha = captcha.text.toLocaleLowerCase();
	
	res.type('svg');
    res.status(200).send(captcha.data);
})

function captchaHandler(req, res, next){
    //获得用户传递的验证码
    const {captcha} = req.body;
    if(captcha.toLocaleLowerCase() !== req.session.captcha){
        // 验证码错误
        res.status(401).send({
            code: 401,
            msg: '验证码错误'
        });
        // 更新验证码
        req.session.captcha = '';
    }else{
        next();
    }
}

// router.post('*', captchaHandler);
// router.put('*', captchaHandler);

module.exports = router;