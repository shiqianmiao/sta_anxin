var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

exports.form = Widget.define({
    events: {
        'blur  [data-role="input"]' : 'blur',
        //'input [data-role="input"]' : 'input',
        'click [data-role="code-group"]' : 'changeCodePic',
        'click [data-role="submit"]': 'submit'
    },
    init: function(config){
        var self = this;
        self.config  = config;
        self.fields  = {};
        self.isValid = true;

        $.each( self.config.$field, function(index, item){
            var name = $(item).data('name');
            var rules= $(item).data('rules');

            if (!rules.length) { return; }

            self.fields[name] = rules;
        });
    },
    blur: function(e){
        var self = this;
        var $t = $(e.currentTarget);

        if ( !self.addLock($t) ) { return; }

        self.valid(null, function(){
            self.removeLock($t);
        }, true);
    },
    // 提交登录
    'submit': function(e){
        e.preventDefault();

        var $t = $(e.currentTarget);
        var self = this;

        if ( !self.addLock($t) ) { return; }

        self.valid(function(){

            self.config.$el.submit();

        },function(){
            self.removeLock($t);
        });
    },
    showWarningTip: function(err){
        this.isValid = false;
        this.config.$warningTip.html(err).addClass('active');
    },
    hideWarningTip: function(){
        this.isValid = true;
        this.config.$warningTip.html('').removeClass('active');
    },
    // 校验表单，规则根据data-rules
    validField: function(name, ignoreRequired){
        var self = this;
        var rule = self.fields[name];
        var value = $.trim($('[data-name="'+ name +'"]').find('input').val());

        for (var i = 0; i < rule.length; i++ ) {
            if ( !self.isValid ) { break; }

            var item = rule[i];
            // 跳过必填项校验
            if ( ignoreRequired && item[0] === 'required' ) { continue; }

            validateFactory[item[0]](value, item, function(err){
                if (err) {
                    self.showWarningTip(err);
                } else {
                    self.hideWarningTip();
                }
            });
        }
    },
    // 总校验
    valid: function(success, complete, ignoreRequired){
        var self = this;
        self.isValid = true;

        $.each( self.fields, function(name){
            self.validField(name, ignoreRequired);
        });
        if ( self.isValid ) { success && success(); }
        complete && complete();

        return false;
    },
    changeCodePic: function(e){
        var $img = $(e.currentTarget).find('img');

        $img.attr('src' , $img.attr('src') );
        this.config.$checkcode.val('');
    },
    // 锁定元素
    addLock: function($wrap) {
        if ($wrap.data('_lock_')) { return false; }
        $wrap.data('_lock_', 1 );

        return true;
    },
    // 解锁元素
    removeLock: function($wrap) {
        $wrap.removeData('_lock_');
    }
});

// 校验方法
var validateFactory = {
    'required': function(value, config, callback){
        var msg = config[2];
        var err = null;
        if (!value) {
            err = msg;
        }

        callback(err);
    },
    'isLoginName': function (value, config, callback) {
        var min = config[1].split('|')[0];
        var max = config[1].split('|')[1];
        var msg = config[2];
        var err = null;

        var isUserName = function (data, min, max) {
            var pattern = /^([a-zA-Z0-9_.]|[\u4e00-\u9fa5_])*$/;
            var cnRegex = /[^\x00-\xff]/g;
            var strLength = data.replace(cnRegex, '**').length;
            if (strLength >= parseInt(min, 10) && strLength <= parseInt(max, 10)) {
                return pattern.test(data);
            }
            return false;
        };
        var isEmail = function(data) {
            var rs = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            return rs.test(data);
        };
        var isMoiblePhone = function (data) {
            var ab = /^1[3458]\d{9}$|^(0\d{2,4}-)?[2-9]\d{6,7}(-\d{2,5})?$|^(?!\d+(-\d+){4,})[48]00(-?\d){7,16}$/;
            return ab.test(data);
        };

        if( value && !isMoiblePhone(value) && !isEmail(value) && !isUserName(value, min, max)) {
            err = msg;
        }

        callback(err);
    },
    'isPassword': function(value, config, callback){
        var min = config[1].split('|')[0];
        var max = config[1].split('|')[1];
        var msg = config[2];
        var err = null;

        var isPassWordNums = function (data, min, max) {
            var pattern = /^\S*$/;
            if (data.length >= parseInt(min, 10) && data.length <= parseInt(max, 10)) {
                return pattern.test(data);
            }

        };
        if ( value && !isPassWordNums(value, min, max)) {
            err = msg;
        }

        callback(err);
    }
};
