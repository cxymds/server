const crypto = require('crypto');
const MD5_SUFFIX = 'FIFJOSDSXMJVRO039292MKK3J5NO2J稀点击33d'; //盐值

module.exports = {
    md5: function (str) {
        var obj = crypto.createHash('md5');
        obj.update(str+MD5_SUFFIX);
        return obj.digest('hex');
    }
}
