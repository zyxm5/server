// 使用 Mock
var Mock = require('mockjs');
function test() {
    const arr = [];
    for (let index = 0; index < 7; index++) {
        arr.push(Math.random().toFixed(2));
    }
    return arr;
}
var data = Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'data1': test(),
    'data2': test(),
    'data3': test(),
    'data4': test(),
})
// 输出结果
console.log(JSON.stringify(data, null, 4))