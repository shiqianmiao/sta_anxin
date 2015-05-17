var Widget = require('com/mobile/lib/widget/widget.js');
var _ = require('com/mobile/lib/underscore/underscore.js');
var $ = require('$');
var filterRender = require('com/mobile/widget/template/list_filter.tpl');

var getURIParams = function (search) {
    if (!search) {
        search = window.location.search;
    }

    var params = {};

    if (search) {
        search = search.replace('?', '');

        search = search.split('&');

        _.each(search, function(item) {
            var pair = item.split('=');

            params[pair[0]] = decodeURIComponent(pair[1]);
        });
    }

    return params;
};

module.exports = Widget.define({
    events: {
        'input [data-role="customPriceInput"]': 'watchCustomPrice',
        'tap [data-role="submitCustomPrice"]' : 'submitCustomPrice',
        'click [data-role="filterItem"]'        : 'showFilterContent',
        'touchstart .js-letter-index'         : 'emitScrollToStart',
        'touchmove .js-letter-index'          : 'emitScrollToMove',
        'tap .js-sigle [data-ajax]'           : 'showNextLevel',
        'tap .js-sigle [data-value]'          : 'checkOneSingle',
        'tap [data-role="term"]'              : 'showChildFilter', // 高级
        'tap [data-role="back"]'              : 'backParentFilter',  // 高级
        'tap .js-more [data-ajax]'            : 'showNextLevel', // 高级显示二级类目
        'tap .js-more [data-value]'           : 'checkOneMore', // 高级选中
        'tap [data-role="reset"]'             : 'resetFilter', // 重置
        'tap [data-role="submit"]'            : 'submitFilter' // 完成筛选
    },
    init: function (config) {
        var self = this;

        this.config = config;
        this.config.curParams = getURIParams();
        this.config.$body = $('body');
        this.config.$mask = $('#maskEl');

        // letter bar 之中每个字母所在元素的高度
        this.config.letterHeiget = 28;

        config.$mask.on('click', function(e) {
            e.preventDefault();
            self.hideFilterContent();
        });

        this.noScroll = false;
        $('body').on('touchmove', function(e) {
            if (self.noScroll) {
                e.preventDefault();
            }
        });

        $('.filtate-outter').css('position', 'relative');

        // 设置最大高度
        var maxHeight = $(window).height() * 0.78;
        this.maxHeight = (Math.round(maxHeight / 41) - 1) * 41;
        config.$el.find('.js-sigle .warpper').css('height', this.maxHeight);

        if (config.$levelOne) {
            config.$levelOne.css('height', this.maxHeight);
            config.$levelOne.find('.warpper').css('height', this.maxHeight - 43);
            config.$levelTwo.find('.warpper').css('height', this.maxHeight - 41);
        }
    },
    addIScrollForWrapper: function(id) {
        var helper = _.bind(this.addIScroll, this);

        _.each($('#' + id).find('.warpper'), helper);
    },
    addIScroll: function(element) {
        var self = this;

        G.use('com/mobile/lib/iscroll/iscroll.js', function() {
            self.handleScrollEntrise(window.IScroll, element);
        });
    },
    handleScrollEntrise: function(IScroll, element) {
        var config = this.config;
        var $element = $(element);

        if (_.isObject( $element.data('iScroll') )) {
            $element.data('iScroll').refresh();
            return;
        }

        var iScrollObj = new IScroll(element, {
            bounceEasing: 'quadratic',
            click: true,
            mouseWheel: true,
            scrollbars: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale'
        });

        var $dict = $element.find('[data-dict]');

        if ( $dict.length > 0 ) {

            // 添加 iscroll 对象的引用
            config.letterBarIScrollObject = iScrollObj;

            var letterArr = [];

            _.each($dict, function(item) {
                letterArr.push( $(item).data('dict') );
            });

            // 保存字典索引
            config.dictArray = letterArr;

            var tmpl = filterRender({ letterArr: letterArr });

            // 显示 letter bar
            $('#filter-min_category')
                .find('.warpper')
                    .first()
                    .append(tmpl);

            config.letterHeiget = $('.js-letter-index').height();
        }

        $element.data('iScroll', iScrollObj);
    },
    emitScrollToStart: function(e) {
        var config = this.config;
        var point = e.touches[0];
        var $cur = $(e.currentTarget);

        config.start = {
            x: point.pageX,
            y: point.pageY
        };

        var $ele = $('[data-dict=' + config.dictArray[$cur.data('index')] + ']');

        if ($ele.length > 0) {
            config.letterBarIScrollObject.scrollToElement($ele.get(0), 0);
        }
    },
    emitScrollToMove: function(e) {
        var config = this.config;
        var $cur = $(e.currentTarget);

        e.preventDefault();
        e.stopPropagation();

        var deltaY = e.touches[0].pageY - config.start.y;
        var absY = Math.abs(deltaY);
        var letterY = config.letterHeiget;

        // touchmove 不满一个字母高度不处理
        if (absY <= letterY || (absY % letterY) > 5 ) {
            return;
        }

        var fixedValue = 0;

        if (deltaY > 0) {
            fixedValue = Math.min(letterY / 50, 5);
        } else if (deltaY < 0) {
            fixedValue = -Math.min(letterY / 50, 5);
        }

        var wordIndex = parseInt($cur.data('index'), 10) +
            Math.round((deltaY + fixedValue) / letterY);

        var $ele = $('[data-dict=' + config.dictArray[wordIndex] + ']');

        if ($ele.length > 0) {
            config.letterBarIScrollObject.scrollToElement($ele.get(0), 0);
        }
    },
    showFilterContent: function(e) {
        var $cur = $(e.currentTarget);
        var config = this.config;

        if ($cur.hasClass('active')) {
            this.hideFilterContent();
            return;
        }

        this.noScroll = true;

        config.$filterItem.removeClass('active');
        $cur.addClass('active');

        config.$body.addClass('body-filt-open');
        config.$el.find('.filt-open').removeClass('filt-show');

        var id = $cur.data('id');
        var $container = $('#' + id);

        $container.addClass('filt-show');
        config.$mask.show();

        if ($('#' + id).hasClass('js-more')) {
            var $wrapper = config.$levelOne.find('.warpper');

            if ($wrapper.length) {
                this.addIScroll($wrapper.get(0));
            }
        } else {
            this.addIScrollForWrapper(id);
        }
    },
    hideFilterContent: function() {
        this.noScroll = false;

        var config = this.config;

        config.$filterItem.removeClass('active');

        config.$body.removeClass('body-filt-open');
        config.$el.find('.filt-open').removeClass('filt-show');
        config.$mask.hide();
    },
    watchCustomPrice: function(e) {
        var $cur = $(e.currentTarget);

        if ( $cur.val() > $cur.data('max') ) {
            $cur.val( $cur.data('max') );
        }
    },
    getCustomPriceParam: function($cur) {
        var $board = $cur.closest('[data-role="customPriceBoard"]');
        var paramsObj = {};

        $board.find('[data-role="customPriceInput"]').each(function() {
            var $input = $(this);

            if ($input.val() > 0) {
                paramsObj[$input.data('name')] = $input.val();
            }
        });

        return paramsObj;
    },
    submitCustomPrice: function(e) {
        var $cur = $(e.currentTarget);

        if ( $cur.parents('.js-sigle').length > 0 ) {
            var paramsObj = this.getCustomPriceParam($cur);

            this.gotoUrl(paramsObj);
        } else if ( $cur.parents('.js-more').length > 0 ) {

            this.resetChildActive($cur);

            $cur.parents('ul').find('.active').removeClass('active');

            this.handleMoreMenuData($cur);

            var id = $cur.parents('.js-filt-child').attr('id');
            var text = $('[data-type="customPrice"]').text();

            this.backParnentHandler(id, text);
        }
    },
    showCustomPrice: function($cur) {
        if ( $cur.hasClass('active') ) {
            return;
        }

        var $container = $cur.closest('[data-key]');
        var $customPriceBoard = $container.find('[data-role="customPriceBoard"]');

        $cur.siblings().removeClass('active');
        $cur.addClass('active');
        $customPriceBoard.show();

        delete this.config.curParams.price;
    },
    showNextLevel: function(e) {
        e.preventDefault();

        var self = this;
        var $cur = $(e.currentTarget);

        if ( $cur.hasClass('active') ) {
            return;
        }

        var $parents = $cur.parents('.warpper');

        $parents.find('.active').removeClass('active');
        $cur.addClass('active');

        var $nextEl = $parents.next();

        if ($nextEl.length) {

            // 如果有已展开的再下一级
            var $tmpEl = $nextEl.next();

            // 删除下下一级子类目
            while (true) {
                if ($tmpEl.length) {
                    $tmpEl.remove();
                    $tmpEl = $nextEl.next();
                } else {
                    break;
                }
            }
        }

        var html = '';
        var url = $parents.parents('.filt-open').data('url');
        var keyword = $cur.data('ajax');
        var extra = $cur.data('extra') || {};

        url = url.replace('{keyword}', keyword);

        // 有子类目
        $.getJSON(url, extra, function(jsonData) {
            setTimeout(function () {
                var curKey = jsonData.key;

                if (jsonData.data.length) {
                    $.each(jsonData.data, function(i, v) {
                        var dataExtra = '';
                        if (v.extra) {
                            dataExtra = 'data-extra=\''+ JSON.stringify(v.extra) +'\'';
                        }

                        var dataDefaultName = '';
                        if (v.default_name) {
                            dataDefaultName = 'data-name="' + v.default_name +'"';
                        }
                        if (v.hasChild) {
                            html += '<li '+ dataExtra +' data-ajax="'+ v.id +'" '+ dataDefaultName +'><a>'+ v.name +'</a><i class="filt-arrow"></i></li>';
                        } else {
                            html += '<li '+ dataExtra +' data-value="'+ v.id +'" '+ dataDefaultName +'><a>'+ v.name +'</a></li>';
                        }

                    });
                }

                if ($nextEl.length) {
                    html = '<ul>' + html + '</ul>';
                    $nextEl
                        .html(html)
                        .data('key', curKey)
                        .data('iScroll', false)
                        .show();
                } else {
                    var height = self.maxHeight;

                    if ($parents.parents('.js-filt-child').length > 0) {
                        height = height - 41;
                    }

                    var className = 'bg-gray';

                    if ($parents.closest('.filt-show').find('.warpper').length > 1) {
                        className = 'bg-black';
                    }

                    html = '<div style="height:'+ height +'px" class="warpper box-flex1 '+ className +'" data-key="'+ curKey +'"><ul>' + html + '</ul></div>';
                    $parents.after(html);
                }

                var id = $parents.parents('.filt-open').attr('id');
                self.addIScrollForWrapper(id);
            }, 300);
        });
    },
    resetChildActive: function($cur) {

        // 如果有子类目，去掉子类目，例如选择‘不限’时
        var $wrapper = $cur.parents('.warpper');
        var $nextEl = $wrapper.next();

        while (true) {
            if ($nextEl.length) {
                $nextEl.hide();
                $nextEl.find('.active').removeClass('active');
                $nextEl = $nextEl.next();
            } else {
                break;
            }
        }
    },
    handleOne: function($cur) {
        var config = this.config;

        this.resetChildActive($cur);

        var $parents = $cur.parents('.js-sigle');

        $cur.parent().children().removeClass('active');
        $cur.addClass('active');

        var paramsObj = {};

        _.each($parents.find('[data-key]'), function(item) {
            var key = $(item).data('key');
            var data = $(item).find('.active').data();

            if (data) {
                if (data.extra != null) {
                    paramsObj = _.extend(paramsObj, data.extra);
                }

                var value = data.value || data.ajax;

                if (value != null) {
                    paramsObj[key] = value;
                } else {
                    delete config.curParams[key];
                }
            } else {
                delete config.curParams[key];
            }
        });

        var rejectArr = $parents.data('reject');

        if ( _.isArray(rejectArr) ) {
            _.each(rejectArr, function(item) {
                delete config.curParams[item];
            });
        }

        this.gotoUrl(paramsObj);
    },
    changeCurrentData: function($cur, type) {
        var config = this.config;

        if ($cur.closest('[data-key]').data('key') === 'price') {
            if ($cur.data('type') === 'customPrice') {
                this.showCustomPrice($cur);
                return;
            } else {
                var $board = $('[data-role="customPriceBoard"]');

                $board
                    .hide()
                    .find('[data-role="customPriceInput"]').each(function() {
                        delete config.curParams[$(this).data('name')];
                    });
            }
        }

        switch (type) {
            case 'one':
                this.handleOne($cur);
                break;
            case 'more':
                this.handleMore($cur);
                break;
        }
    },
    checkOneSingle: function(e) {
        var $cur = $(e.currentTarget);

        this.changeCurrentData($cur, 'one');
    },
    gotoUrl: function(obj) {
        obj = _.extend({}, this.config.curParams, obj);

        //页面跳转到第一页
        obj.page = 1;
        delete obj.ingore;
        delete obj.ifid;

        window.location.href = window.location.pathname + '?' + $.param(obj);
    },
    showChildFilter: function(e) {
        e.preventDefault();

        var config = this.config;
        var $cur = $(e.currentTarget);
        var id = $cur.data('id');
        var self = this;

        if (!id) {
            var curKey = $cur.data('curKey');
            var curVal = $cur.data('curValue');

            if (curKey && curVal != null) {
                if ($cur.find('.js-check').hasClass('active')) {
                    delete config.curParams[curKey];
                    $cur.find('.js-check').removeClass('active');
                } else {
                    config.curParams[curKey] = curVal;
                    $cur.find('.js-check').addClass('active');
                }
            }
        } else {
            if(this.animating) {
                return false;
            }

            this.animating = true;

            this.config.$levelTwo.find('.js-filt-child').hide();
            $('#'+id).show();

            this.addIScrollForWrapper(id);

            this.config.$levelOne
                .parent()
                .animate({ left: '-100%' }, 400, 'ease-in-out', function() {
                    self.animating = false;
                });
        }
    },
    backParentFilter: function(e) {
        e.preventDefault();
        this.backParnentHandler(null, null);
    },
    backParnentHandler: function(id, text) {
        if(this.animating) {
            return false;
        }

        this.animating = true;

        if (id && text) {
            this.config.$levelOne.find('[data-id="'+ id +'"]').find('.js-span').text(text);
        }

        var self = this;

        this.config.$levelOne
            .parent()
            .animate({ left: 0 }, 400, 'ease-in-out', function() {
                self.animating = false;
            });
    },
    handleMore: function($cur) {
        if ($cur.hasClass('active')) {
            return false;
        }

        this.resetChildActive($cur);

        $cur.parents('ul').find('.active').removeClass('active');
        $cur.addClass('active');

        this.handleMoreMenuData($cur);

        var id = $cur.parents('.js-filt-child').attr('id');
        var text = $cur.text();

        if ($cur.data('name')) {
            text = $cur.data('name');
        }

        this.backParnentHandler(id, text);
    },
    checkOneMore: function(e) {
        var $cur = $(e.currentTarget);

        this.changeCurrentData($cur, 'more');
    },
    handleMoreMenuData: function($cur) {
        var self = this;
        var config = this.config;
        var $parentsEl = $cur.parents('.js-filt-child');
        var paramsObj = {};

        $parentsEl.find('[data-key]').each(function() {
            var $key = $(this);
            var $active = $key.find('.active');
            var value;
            var extra;

            switch ( $active.data('type') ) {
                case 'customPrice':
                    _.extend(paramsObj, self.getCustomPriceParam($cur));
                    break;
                default:
                    value = $active.data('value');
                    extra = $active.data('extra');
            }

            if (extra) {
                paramsObj = _.extend(paramsObj, extra);
            }

            if (value == null) {
                value = $active.data('ajax');
            }

            var key = $key.data('key');

            //如果还没有值，删除这个key
            if (value == null) {
                delete config.curParams[key];
            }

            paramsObj[key] = value;
        });

        //更新父节点
        $parentsEl.data('params', paramsObj);

        var rejectArr = $parentsEl.data('reject');

        if (rejectArr && rejectArr.length) {
            $.each(rejectArr, function(i, v) {
                delete config.curParams[v];
            });
        }

        var callback = $parentsEl.data('callbackName');

        if (callback && _.isFunction(this[callback])) {
            var selector = $parentsEl.data('callbackSelector');

            this[callback](selector, paramsObj);
        }
    },
    resetFilter: function(e) {
        e.preventDefault();

        var config = this.config;

        this.config.$levelOne.find('.js-span').each(function() {
            $(this).text($(this).data('text') || '不限');
        });

        this.config.$levelOne.find('.js-check').each(function() {
            $(this).removeClass('active');
        });

        config.curParams = {};

        this.config.$levelTwo.find('.js-filt-child').each(function() {
            var tmpObj = {};

            $(this).find('.warpper').each(function(i) {
                var key = $(this).data('key');

                if ($(this).data('defaultValue')) {
                    tmpObj[key] = $(this).data('defaultValue');
                }

                if (i === 0) {
                    $(this).find('.active').removeClass('active');
                } else {
                    $(this).remove();
                }
            });

            $(this).data('params', tmpObj);
        });
    },
    submitFilter: function() {
        var paramsObj = {};
        var $levelTwo = this.config.$levelTwo;

        if ($levelTwo) {
            $levelTwo.find('.js-filt-child').each(function() {
                var params = $(this).data('params');

                params = params || {};
                $.extend(paramsObj, params);
            });
        }

        this.gotoUrl(paramsObj);
    }
});