var ScratchCard = require('com/mobile/widget/scratch_card/scratch_card.js');

exports.lottery = ScratchCard.extend({
    getImageURL: function(canvas) {
        var src = 'http://sta.ganjistatic1.com/src/image/mobile/touch/milan/house/chuzu.png';
        canvas.style.backgroundImage = 'url(' + src + ')';
    },
    showResult: function() {
        window.alert('自定义方法');
        this.initCard();
    }
});