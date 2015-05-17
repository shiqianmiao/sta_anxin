var NativeAPI = require('app/client/common/lib/native/native.js');

exports.alert = function(msg) {
    NativeAPI.invoke('alert', {
        title: '赶集群组',
        message: msg,
        btn_text: '确定'
    });
};

// Test cases:
// calcWidth(188, [1, 180, 290])
// 53.64
// calcWidth(188, [1, 180])
// 100
// calcWidth(188, [1, 180, 280, 380])
// 36
// calcWidth(180, [1, 180, 280, 380])
// 33.33
// calcWidth(180, [1, 180, 280, 380, 480])
// 25
// calcWidth(180, [180, 190, 280, 380, 480])
// 0
// calcWidth(180, [181, 190, 280, 380, 480])
// 0
// calcWidth(180, [1])
// 0
// calcWidth(180, [180])
// 0
// calcWidth(180, [190])
// 0
exports.calcWidth = function(current, needs) {
    var width = 0;
    var len = needs.length;

    if (len > 1) {
        if (current >= needs[len - 1]) {
            width = 100;
        } else {
            var base = 100 / (needs.length - 1);

            needs.reduce(function(prev, curt, index) {
                if (current > prev && current <= curt) {
                    width = base * (index - 1);
                    width += (current - prev) / (curt - prev) * base;
                }

                return curt;
            });
        }

        width = parseFloat((width).toFixed(2));
    }

    return width > 100 ? 100 : width;
};