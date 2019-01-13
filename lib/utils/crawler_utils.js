const request = require('request').defaults({gzip: true, json: true, timeout: 10000});
exports.requestJob = function (option) {
    return new Promise(function (resolve, reject) {
        request(option,function (err,res,body) {
            if(err){
                reject(err);
            }
            else {
                resolve(body);
            }
        })
    })
};
exports.sleep =function(ms) {
    return new Promise(function (resolve, reject) {
        try {
            setTimeout(function () {
                resolve()
            },ms)
        }
        catch (e){
            reject(e)
        }
    })
};






