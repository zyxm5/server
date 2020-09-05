const Food = require('./models/Food');
const { initCategorys, initFoodsLink, initFoods, initImg } = require('./spider');
let cates = [];
const baseUrl = 'http://www.boohee.com';
initCategorys(baseUrl + '/food/').then(async data => {
    cates = data;
    // console.log(data);
    const foods = [];
    // 第一层循环食物分类
    for(let i = 0; i < data.length; i++){
        // 第二层循环该分类的分页
        for(let j = 1; j < 11; j ++){
            const link = await initFoodsLink(`${baseUrl}${cates[i].link}?page=${j}`);
            // 第三层循环该分页的食物
            for(let k = 0; k < link.length; k++){
                const food = await initFoods(`${baseUrl}${link[k]}`, i);
                console.log(food);
                foods.push(food);
            }   
        }
    }
    
    Food.bulkCreate(foods);
    console.log(foods);
    // const food = await initFoods(`http://www.boohee.com/shiwu/fd3ce3a1`, 0);
    // console.log(food);
    // Food.create(food)
    // const url = 'https://pic1.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_b.jpg';
    // initImg(url.split('/').pop(), url)
    // console.log(food);
})