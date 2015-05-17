var Normal = require('com/mobile/widget/bounce/bounce.js').normal;

exports.normal = Normal.extend({
    getData: function(callback) {
        var arr = [ 'A', 'B', 'C', 'D', 'E', 'F'];

        callback(arr, function() {
            window.alert('123');
        });
    }
});