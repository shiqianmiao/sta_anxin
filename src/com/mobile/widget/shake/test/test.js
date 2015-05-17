var Shake = require('com/mobile/widget/shake/shake.js').shake;
var tip = require('com/mobile/widget/toast.js').show;

exports.shake = Shake.extend({
    onShake: function() {
        tip('摇一摇生效！', 2000);
        // this.stopListening();
    }
});