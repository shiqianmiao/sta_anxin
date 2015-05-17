var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

exports.init = function () {
    Widget.initWidgets();
};

exports.multilevel = Widget.define({
    events: {
        'change [data-role="select"]': 'selectOption'
    },
    init: function(config) {
        this.config = config;

        var resetFlag = false;

        config.$select.each(function() {
            if ( $(this).find('option').length <= 1 ) {
                resetFlag = true;
            }
        });

        if (resetFlag) {

            // 页面初始化时置为默认值，避免前进后退时下一级没有内容
            config.$select.each(function() {
                var $select = $(this);
                var $firstOption = $select.find('option').first();

                $firstOption.prop('selected', true);

                if (!$firstOption.val()) {
                    $select.prop('disabled', $select.attr('data-for') ? true : false);
                }
            });
        }
    },
    selectOption: function(e) {
        var self = this;
        var $dom = $(e.currentTarget);
        var nextLevel = $dom.data('nextLevel');
        var $next = this.config.$select.filter('[data-for="'+ $dom.data('name') +'"]');
        var val = $dom.val().trim();
        var defaultText = $next.data('default-text') || '请选择';

        if (nextLevel && val) {
            $.ajax({
                url: nextLevel + val,
                dataType: 'json'
            }).done(function(result) {
                var html;
                if (!Array.isArray(result) || !result.length) {
                    $next
                        .html('<option value="">'+defaultText+'</option>')
                        .prop('disabled', true);

                    return;
                }

                html = self.createOption(result);
                $next
                    .prop('disabled', false)
                    .html(html);
            }).fail(function () {
                $next
                    .prop('disabled', true);
            });
        } else {
            $next.html('<option value="">'+defaultText+'</option>');
            $next.prop('disabled', true);
        }
    },
    createOption: function(data) {
        var html = '';

        $.each(data, function(i, v) {
            html += '<option value="' + v.id + '">' + v.name + '</option>';
        });

        return html;
    }
});

exports.changeMode = Widget.define({
    events: {
        'change [data-role="select"]': 'changeMode'
    },
    init: function(config) {
        this.config = config;
        this.$nextLevel = config.$nextLevel;
    },
    disableNext: function () {
        this.$nextLevel
            .addClass('disabled')
            .prop('disabled', true);
    },
    enableNext: function () {
        this.$nextLevel
            .removeClass('disabled')
            .prop('disabled', false);
    },
    changeMode: function (e) {
        var $dom = $(e.currentTarget);
        var tag  = $dom.find('option:selected').data('enableNext');
        if (tag) {
            this.enableNext();
        }else{
            this.disableNext();
        }
    }
});

exports.bottomUp = Widget.define({
    events: {
        'clear': function () {
            this.clearOptions();
            this.reset();
        },
        'click [data-role="text"]': function () {
            if (!this.config.$el.data('isDisabled')) {
                this.show();
                this.config.$el.trigger('focus');
            }
        },
        'click [data-role="cancel"]' : function (e) {
            e.preventDefault();
            this.hide();
        },
        'click [data-role="option"]': function(e){
            var $target = $(e.currentTarget);
            var val = $target.data('value');
            $target.siblings('[data-role="option"]').removeClass('active');
            $target.addClass('active');
            this.config.$text.text($target.text());
            this.hide();
            this.config.$el.trigger('blur');

            if (val !== this.config.$input.val()) {
                this.config.$input.val(val).trigger('change', val);
            }
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        this.defer  = $.Deferred();
        config.$el.one('show', function () {
            config.$el.find('.js-need-iscroll')
                .each(function () {
                    var el = this;
                    require.async('com/mobile/lib/iscroll/iscroll.js', function () {
                        self.iscroll = new window.IScroll(el, {
                            bounceEasing: 'easing',
                            bounceTime: 600,
                            click: true,
                            scrollbars: true,
                            mouseWheel: true,
                            interactiveScrollbars: true,
                            shrinkScrollbars: 'scale'
                        });
                        self.defer.resolve(self.iscroll);
                    });
                });
        });
    },
    getInstanceDefer: function () {
        return this.defer;
    },
    showMask: function(){
        $('body .mask').addClass('active');
    },
    hideMask: function(){
        $('body .mask').removeClass('active');
    },
    clearOptions: function () {
        this.config.$el.find('[data-role="option"]').remove();
    },
    addOptions: function (data) {
        var html = data.map(function (row) {
            return '<li data-role="option" data-value="'+ row.value +'">' + row.text + '</li>';
        }).join('');
        this.config.$options.append(html);
    },
    hide: function (){
        this.config.$el.removeClass('active');
        this.config.$panel.css('-webkit-transform', 'translateY(100%)');
        this.hideMask();
    },
    show: function () {
        this.config.$el
            .addClass('active')
            .trigger('show');
        this.config.$panel.animate({
            'translateY': '0'
        }, 200);
        if (this.iscroll) {
            this.iscroll.refresh();
        }

        this.showMask();
    },
    disable: function () {
        this.config.$el.data('isDisabled', true).addClass('disable');
    },
    enable: function () {
        this.config.$el.data('isDisabled', false).removeClass('disable');
    },
    reset: function () {
        this.config.$el.find('[data-role="option"]').removeClass('active');
        this.config.$text.text('请选择');
        this.config.$input.val('');
    }
});