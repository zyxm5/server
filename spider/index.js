const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

/**
 * 获取html源码
 * @param {*} url 
 */
async function getHtml(url) {
    const res = await axios.get(url);
    return res.data;
}

exports.initCategorys = async function (url) {
    const html = await getHtml(url);
    // 加载html
    const $ = cheerio.load(html);
    const categorys = [];
    $('.widget-food-category .item').each((i, e) => {
        categorys.push({
            name: $(e).find('.text-box h3 a').text(),
            img: $(e).find('.img-box img').attr('src'),
            desc: $(e).find('.text-box p').text().replace(/\s{2,}/g, ''),
            link: $(e).find('.text-box h3 a').attr('href')
        })
    })
    return categorys;
}
exports.initFoodsLink = async function (url) {
    const html = await getHtml(url);
    // 加载html
    const $ = cheerio.load(html);
    const foods = [];
    $('.food-list .item').each((i, e) => {
        foods.push( $(e).find('a').attr('href'))
    })
    return foods;
};
exports.initFoods = async function (url,cate) {
    const html = await getHtml(url);
    // 加载html
    const $ = cheerio.load(html);
    const content = $('.widget-food-detail .content');
    const nutr = $('.nutr-tag .content');
    const img = content.find('.food-pic img').attr('src');
    const imgName = img.split('/').pop();
    exports.initImg(imgName,img);
    return {
        name: $('.crumb').text().replace(/\s/g, '').split('/').pop(),
        img: `/img/${imgName}`,
        protein: +nutr.find('dl').eq(2).find('.dd').eq(1).text() || 0,
        fat: +nutr.find('dl').eq(2).find('.dd').eq(0).text() || 0,
        carbohydrate: +nutr.find('dl').eq(1).find('.dd').eq(1).text() || 0,
        energy: +nutr.find('dl').eq(1).find('.stress').text() || 0,
        link: url,
        CategoryId: cate + 1,
        desc: content.find('p').eq(0).text().replace(/\s|评价：/g, '')
    }
};

exports.initImg = async function(name, img){
    const res = await axios.get(img, {
        responseEncoding: 'binary'
    });
    fs.promises.writeFile(path.resolve(__dirname, '../public/img', name), res.data, {
        encoding: 'binary'
    });
}