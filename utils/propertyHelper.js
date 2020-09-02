exports.pick = function(obj, ...attrs){
    if(!obj || typeof obj !== 'object'){
        return obj;
    }
    const newObj = {};
    for (const key in obj) {
        if(attrs.includes(key)){
            newObj[key] = obj[key];
        }
    }
    return newObj;
}