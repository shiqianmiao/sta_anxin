var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

var getURIParams = function(searchStr) {
    if(!searchStr) {
        searchStr = window.location.search;
    }
    var params = {}, URIArr;
    searchStr = searchStr.replace('?', '');

    URIArr = searchStr.split('&');
    $.each(URIArr, function(i, v) {
        var keyArr = v.split('=');
        if(keyArr.length === 2) {
            params[keyArr[0]] = decodeURIComponent(keyArr[1]);
        }
    });
    return params;
};

exports.searchFilter = Widget.define({
    events: {
        'click [data-role="filterItem"]' : 'showFilterContent',
        'tap .js-sigle [data-ajax]' : 'showNextCate',
        'tap .js-sigle [data-value]' : 'sigleUpdate',
        'tap .js-sigle [data-direct]': 'sigleDirect', //直接跳转
        'tap [data-role="moreItem"] li': 'showChildFilter', //高级
        'tap [data-role="back"]': 'backParentFilter',  //高级
        'tap .js-more [data-ajax]': 'showNextCate', //高级显示二级类目
        'tap .js-more [data-value]': 'moreUpdate', //高级选中
        'tap [data-role="reset"]' : 'resetFilter',
        'tap [data-role="submit"]' : 'submitFilter'
    },
    init: function(config) {
        var that = this;
        this.config = config;
        this.$el = config.$el;
        this.$container = null;
        this.$mask = $('#maskEl');
        this.curParams = getURIParams();

        this.$mask.on('click', function(e) {
            e.preventDefault();
            that.hideFilterContent();
        });

        this.noScroll = false;

        $('body').on('touchmove', function(e) {
            if(that.noScroll) {
                e.preventDefault();
            }
        });
        var curScrollTop = $('body').scrollTop();
        window.scrollTo(0, curScrollTop + 1);

        //IOS7 hack
        var isIOS7 = navigator.userAgent.indexOf('iPhone OS 7') > -1;

        if(!isIOS7) {
            $('.filtate-outter').css('position', 'relative');
        }

        //高级筛选默认值构造
        if(this.config.$moreChild && this.config.$moreChild.length) {
            this.config.$moreChild.find('.js-filt-child').each(function() {
                var $childEl = $(this);
                var params = {};

                $childEl.find('[data-key]').each(function() {
                    var key = $(this).data('key');
                    var value = $(this).find('.active').data('value');

                    if(!value) {
                        value = $(this).find('.active').data('ajax');
                    }
                    params[key] = value;
                });

                $childEl.data('params', params);
            });
        }

        config.$el
            .on('touchstart', 'li', function() {
                $(this).addClass('touch');
            })
            .on('touchmove, touchcanel, touchend', 'li', function() {
                $(this).removeClass('touch');
            });

        //最大高度
        var maxHeight = $(window).height() - 130;
        this.maxHeight = (Math.round(maxHeight/41) - 1) * 41;
        config.$el.find('.js-sigle .warpper').css('height', this.maxHeight);
        if(config.$moreItem) {
            config.$moreItem.css('height', this.maxHeight);
            config.$moreItem.find('.warpper').css('height', this.maxHeight - 43);
            config.$moreChild.find('.warpper').css('height', this.maxHeight - 41);
        }
    },
    initScroll: function(id) {
        var $warpperBox = $('#' + id);
        G.use('com/mobile/lib/iscroll/iscroll.js', function() {
            $warpperBox.find('.warpper').each(function() {
                var curEl = this;
                if(!$(this).data('hasScroll')) {
                    /*jshint nonew: false */
                    new window.IScroll(curEl, {
                        bounceEasing: 'easing',
                        bounceTime: 600,
                        click: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale'
                    });
                }
                $(this).data('hasScroll', true);
            });
            // ios6 隐藏地址栏
            var curScrollTop = $('body').scrollTop();
            window.scrollTo(0, curScrollTop + 1);
        });
    },
    showFilterContent: function(e) {
        e.preventDefault();
        this.noScroll = true;
        var $target = $(e.currentTarget);

        if($target.hasClass('active')) {
            this.hideFilterContent();
            return false;
        }

        var $el = this.$el;
        var id = $target.data('id');

        this.$container = $('#' + id);

        $('body').addClass('body-filt-open');

        this.config.$filterItem.removeClass('active');
        $el.find('.filt-open').removeClass('filt-show');

        $target.addClass('active');

        this.$container.addClass('filt-show');
        this.$mask.show();

        //多选标签不初始化scroll
        if($('#' + id).hasClass('js-more')) {
            var $moreItem = this.config.$moreItem;
            var $warpper = $moreItem.find('.warpper');
            G.use('com/mobile/lib/iscroll/iscroll.js', function() {
                if($warpper.length && !$warpper.data('hasScroll')) {
                    /*jshint nonew: false */
                    new window.IScroll($warpper[0], {
                        bounceEasing: 'easing',
                        bounceTime: 600,
                        click: true,
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale'
                    });
                    $warpper.data('hasScroll', true);
                }
            });

            return false;
        }
        // ios6 隐藏地址栏
        var curScrollTop = $('body').scrollTop();
        window.scrollTo(0, curScrollTop + 1);
        this.initScroll(id);
    },
    preventFilterContent: function(e) {
        e.preventDefault();
    },
    showNextCate: function(e) {
        e.preventDefault();
        var that = this;
        var $target = $(e.currentTarget);
        var $parent = $target.parents('.warpper');

        $parent.find('.active').removeClass('active');
        $target.addClass('active');
        var $nextEl = $parent.next();

        if($nextEl.length) {
            $nextEl.find('.active').removeClass('active');
            var $tmpEl = $nextEl.next();
            //删除下下一级子类目
            while(1) {
                if($tmpEl.length) {
                    $tmpEl.remove();
                    $tmpEl = $nextEl.next();
                } else {
                    break;
                }
            }
        }

        var html = '';
        var url = $parent.parents('.filt-open').data('url');
        var keyword = $target.data('ajax');
        var extra = $target.data('extra');

        if(!extra) {
            extra = {};
        }

        url = url.replace('{keyword}', keyword);

        // 有子类目
        $.getJSON(url, extra, function(jsonData) {
            var curKey = jsonData.key;

            if(jsonData.data.length) {
                $.each(jsonData.data, function(i, v) {
                    var dataExtra = '';
                    if(v.extra) {
                        dataExtra = 'data-extra=\''+ JSON.stringify(v.extra) +'\'';
                    }

                    var dataDefaultName = '';
                    if(v.default_name) {
                        dataDefaultName = 'data-name="' + v.default_name +'"';
                    }
                    if(v.hasChild) {
                        html += '<li '+ dataExtra +' data-ajax="'+ v.id +'" '+ dataDefaultName +'><a>'+ v.name +'</a><i class="filt-arrow"></i></li>';
                    } else if(v.hasDirect) {
                        html += '<li '+ dataExtra +' data-direct="'+ v.id +'" '+ dataDefaultName +'><a>'+ v.name +'</a></li>';
                    }else {
                        html += '<li '+ dataExtra +' data-value="'+ v.id +'" '+ dataDefaultName +'><a>'+ v.name +'</a></li>';
                    }

                });
            }

            if($nextEl.length) {
                html = '<ul class="bg-gray">' + html + '</ul>';
                $nextEl
                    .html(html)
                    .data('key', curKey)
                    .data('hasScroll', false)
                    .show();
            } else {
                var height = that.maxHeight;

                if($parent.parents('.js-filt-child').length > 0) {
                    height = height - 41;
                }

                var className = 'bg-gray';

                if($parent.closest('.filt-show').find('.warpper').length > 1) {
                    className = 'bg-white';
                }

                html = '<div style="height:'+ height +'px" class="warpper box-flex1" data-key="'+ curKey +'"><ul class="'+ className +'">' + html + '</ul></div>';
                $parent.after(html);
            }

            var id = $parent.parents('.filt-open').attr('id');
            that.initScroll(id);
        });
    },
    sigleUpdate: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);

        var $parent = $target.parents('.js-sigle');
        var that = this;

        var $checkEl = $target.find('[type="checkbox"]');

        if($checkEl.length) {
            var isChecked = $checkEl.prop('checked');
            $checkEl.prop('checked', !isChecked);
        }

        //去除子类目的active
        var $warpper = $target.parents('.warpper');
        var $nextEl = $warpper.next();
        //隐藏下一级子类目
        var $tmpEl = $nextEl;
        while(1) {
            if($tmpEl.length) {
                $tmpEl.hide();
                $tmpEl.find('.active').removeClass('active');
                $tmpEl = $tmpEl.next();
            } else {
                break;
            }
        }

        $target.parents('ul').find('.active').removeClass('active');
        $target.addClass('active');

        var paramsObj = {};
        $parent.find('[data-key]').each(function() {
            var key = $(this).data('key');
            var value = $(this).find('.active').data('value');
            var extra =  $(this).find('.active').data('extra');
            if(extra) {
                paramsObj = $.extend(paramsObj, extra);
            }

            if(value === undefined || $.trim(value) === '') {
                value = $(this).find('.active').data('ajax');
            }
            //如果还没有值，删除这个key
            if(value === undefined || $.trim(value) === '') {
                delete that.curParams[key];
            } else {
                paramsObj[key] = value;
            }
        });
        var rejectArr = $parent.data('reject');
        if(rejectArr && rejectArr.length) {
            $.each(rejectArr, function(i, v) {
                delete that.curParams[v];
            });
        }

        this.gotoUrl(paramsObj);
    },
    sigleDirect: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var direct = $target.data('direct');

        $target.parents('ul').find('.active').removeClass('active');
        $target.addClass('active');

        window.location.href = direct;
    },
    showChildFilter: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);

        var id = $target.data('id');
        this.config.$moreChild.find('.js-filt-child').hide();

        $('#'+id).show();
        this.config.$moreItem.parent().animate({
            left: '-100%'
        }, 300, 'ease-in-out');

        this.initScroll(id);
    },
    moreUpdate: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var that = this;
        if($target.hasClass('active')) {
            return false;
        }

        //去除子类目的active
        var $warpper = $target.parents('.warpper');
        var $nextEl = $warpper.next();
        //隐藏下一级子类目
        var $tmpEl = $nextEl;
        while(1) {
            if($tmpEl.length) {
                $tmpEl.hide();
                $tmpEl.find('.active').removeClass('active');
                $tmpEl = $tmpEl.next();
            } else {
                break;
            }
        }

        var text = $target.text();
        if($target.data('name')) {
            text = $target.data('name');
        }
        var $parentsEl = $target.parents('.js-filt-child');

        $target.parents('ul').find('.active').removeClass('active');
        $target.addClass('active');
        var id = $parentsEl.attr('id');
        var event = $parentsEl.data('event');
        var refId = $parentsEl.data('refId');

        this.backParnentHandler(id, text);


        var paramsObj = {};
        $parentsEl.find('[data-key]').each(function() {
            var key = $(this).data('key');
            var value = $(this).find('.active').data('value');

            var extra = $(this).find('.active').data('extra');
            if(extra) {
                paramsObj = $.extend(paramsObj, extra);
            }

            if(value === undefined || $.trim(value) === '') {
                value = $(this).find('.active').data('ajax');
            }

            //如果还没有值，删除这个key
            if(value === undefined || $.trim(value) === '') {
                delete that.curParams[key];
            } else {
                paramsObj[key] = value;
            }

            paramsObj[key] = value;
        });

        //更新父节点
        $parentsEl.data('params', paramsObj);
        var rejectArr = $parentsEl.data('reject');
        if(rejectArr && rejectArr.length) {
            $.each(rejectArr, function(i, v) {
                delete that.curParams[v];
            });
        }

        if(event) {
            $('#'+refId).trigger(event, paramsObj);
        }
    },
    backParentFilter: function(e) {
        e.preventDefault();
        this.backParnentHandler(null, null);
    },
    backParnentHandler: function(id, text) {
        if(id && text) {
            this.config.$moreItem.find('[data-id="'+ id +'"]').find('.js-span').text(text);
        }
        this.config.$moreItem.parent().animate({
            left: 0
        }, 300, 'ease-in-out');
    },
    hideFilterContent: function() {
        $('body').removeClass('body-filt-open');
        this.config.$filterItem.removeClass('active');
        this.$el.find('.filt-open').removeClass('filt-show');
        this.$mask.hide();
        this.noScroll = false;
    },
    resetFilter: function(e) {
        e.preventDefault();

        this.config.$moreItem.find('.js-span').each(function() {
            $(this).text('不限');
        });

        this.curParams = {};
        this.config.$moreChild.find('.js-filt-child').each(function() {
            var tmpObj = {};

            $(this).find('.warpper').each(function(i) {
                var key = $(this).data('key');
                if($(this).data('defaultValue')) {
                    tmpObj[key] = $(this).data('defaultValue');
                }

                if(i === 0) {
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

        this.config.$moreChild.find('.js-filt-child').each(function() {
            var params = $(this).data('params');
            params = params || {};

            $.extend(paramsObj, params);
        });
        this.gotoUrl(paramsObj);
    },
    gotoUrl: function(paramsObj) {
        paramsObj = $.extend({}, this.curParams, paramsObj);
        //页面跳转到第一页
        paramsObj.page = 1;
        delete paramsObj.ingore;
        delete paramsObj.ifid;
        var url = 'http://3g.ganji.com' + window.location.pathname +'?'+ $.param(paramsObj);
        window.location.href = url;
    }
});


exports.focusTopSearch = function(config) {
    $(config.$reSearch).on('click', function(e) {
        e.preventDefault();
        $('#searchVal').focus();
    });
};
