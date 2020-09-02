const handlerHelper = require('../util/handlerHelper');
const express = require('express');
const multer = require('multer');
const path = require('path');
const Jimp = require('jimp');

/**
 * 图片添加水印
 * @param { String } originPath 原图路径
 * @param { String } waterPath 水印路径
 * @param { String } compositePath 合成图片路径
 * @param { Number } proportion 原图与水印比例
 * @param { Number } marginProportion 水印距离右下角与原图比例
 */
async function mark(originPath, waterPath, compositePath, proportion = 5, marginProportion = 0.01) {
    // 得到jimp对象
    const [water, origin] = await Promise.all([Jimp.read(waterPath), Jimp.read(originPath)]);
    // 修改水印比例
    const p = origin.bitmap.width / water.bitmap.width / proportion;
    water.scale(p);
    // 合成图片
    origin.composite(water,
        origin.bitmap.width * (1 - marginProportion) - water.bitmap.width,
        origin.bitmap.height * (1 - marginProportion) - water.bitmap.height, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 0.5
        })
    // 写入
    await origin.writeAsync(compositePath);
}

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../../public/resources'))
    },
    filename: function (req, file, cb) {
        // 文件名: 时间戳 + 6位随机数 + 后缀名
        const timestamp = Date.now();
        const random = Math.random().toString(36).slice(-6);
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}-${random}${ext}`);
    }
})
const upload = multer({
    storage,
    // limits: {
    //     fileSize: 1024 * 100
    // },
    fileFilter(req, file, cb) {
        const ext = path.extname(file.originalname).slice(1);
        console.log(ext);
        const whiteList = ['png', 'jpg', 'jpeg', 'gif'];
        if (!whiteList.includes(ext)) {
            cb(new Error(`your file's extname ${ext} is not supported`));
        }
        cb(null, true);
    }
})
router.post('/', upload.single('img'), handlerHelper(async req => {
    // 创建水印图片，并保存
    const url = `/upload/${req.file.filename}`;
    const waterPath = path.resolve(__dirname, '../../public/img/water.png');
    const compositePath = path.resolve(__dirname, '../../public', `upload/${req.file.filename}`);
    await mark(req.file.path, waterPath, compositePath);
    console.log(url);
    return url;
}));

module.exports = router;

// // 上传文件
// module.exports = {
//     method: 'POST',
//     path: '/api/upload',
//     handler: handlerHelper(async (req, res) => {
//         console.log(req);
//         res.send('file upload success!')
//     }),
//     needToken: false
// };