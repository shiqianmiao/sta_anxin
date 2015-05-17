var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var Log = require('com/mobile/lib/log/tracker.js');
var Storage = require('com/mobile/lib/storage/storage.js');
var storage = new Storage('showMask');

var isMaskShow = false;
exports.postList = Widget.define({
    events: {
        'click [data-role="delete"]': 'deletePost',
        'click [data-role="access"]': 'toggleAccess',
        'click [data-role="moreChange"]': 'moreChange',
        'click [data-role="reason"]': 'toggleReason',
        'click [data-role="showmore"]': 'toggleMore'
    },
    init: function (config) {
        this.config = config;

        $('body').on('touchmove', function(e) {
            if(isMaskShow) {
                e.preventDefault();
            }
        });
    },
    deletePost: function(e) {
        e.preventDefault();
        var self = this;
        var $target = $(e.currentTarget);
        var puid = $target.parents('.resume-list').data('puid');

        actionConfirm($('#deleteConfirm'), function (isConfirm) {
            if (!isConfirm) {
                return;
            }
            $.ajax({
                url: self.config.ajaxurl['post-delete'],
                data: {
                    puid: puid
                }
            })
            .done(function () {
                window.location.href = window.location.href;
            });
        });
    },
    toggleAccess: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var $orginTarget = $(e.target);
        var ac = $orginTarget.data('ac');

        if(ac === 'off' && $target.hasClass('active')) {
            return false;
        } else if(ac === 'on' && !$target.hasClass('active') ){
            return false;
        }

        $target.toggleClass('active');

        var $post = $target.parents('.post-list');
        var puid = $post.data('puid');

        $.ajax({
            url: this.config.ajaxurl['post-access'],
            data: {
                ac: ac,
                puid: puid
            }
        })
        .done(function () {
            // window.location.href = window.location.href;
        });
    },
    moreChange: function(e) {
        e.preventDefault();
        var $target = $(e.target);
        if($target.hasClass('active')) {
            return false;
        }

        this.config.$moreChange.find('span').removeClass('active');
        $target.addClass('active');

        var $post = $target.parents('.post-list');
        var puid = $post.data('puid');

        var ac = $target.data('ac');

        $.ajax({
            url: this.config.ajaxurl['post-change'],
            data: {
                type: ac,
                puid: puid
            }
        })
        .done(function () {
            // window.location.href = window.location.href;
        });

    },
    toggleReason: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var $post = $target.parents('.post-list');

        $post.find('.js-reason').toggle();
        $target.toggleClass('active');
    },
    toggleMore: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget).parents().find('.del-mod');
        $target.toggleClass('active');
    }
});

function actionConfirm ($el, callback) {
    var scrollTop = $('body').scrollTop();
    var screenHeight = $(window).height();

    isMaskShow = true;
    $('#mask').show();

    $el
        .css('top', scrollTop + screenHeight / 2)
        .show()
        .one('click', '[data-role="yes"]', yes)
        .one('click', '[data-role="no"]', no);

    function yes () {
        hide();
        callback(true);
    }

    function no () {
        hide();
        callback(false);
    }

    function hide () {
        isMaskShow = false;
        $('#mask').hide();
        $el
            .off('click', '[data-role="yes"]', yes)
            .off('click', '[data-role="no"]', no)
            .hide();
    }
}

exports.showMask = Widget.define({
    events:{
        'click [data-role="mask"]': 'closeMask'
    },
    init: function(config){
        this.config = config;
        if(config.isFree){
            var nowTime = new Date();
            nowTime = nowTime.getTime();
            if(config.page === 'my-posts-poppup' && config.hasPost){
                if(!storage.get('newMyPostsMask') || nowTime - storage.get('newMyPostsMask') > 1209600000){
                    storage.set('newMyPostsMask', nowTime);
                    config.$mask.addClass('active');
                    Log.send('wap_myPosts_showMask');
                }
            }else if(config.page === 'detail-poppup'){
                if(!storage.get('newDetailMask') || nowTime - storage.get('newDetailMask') > 1209600000){
                    storage.set('newDetailMask', nowTime);
                    config.$mask.addClass('active');
                    Log.send('wap_detail_showMask');
                }
            }
        }
    },
    closeMask: function(){
        this.config.$mask.removeClass('active');
    }
});
