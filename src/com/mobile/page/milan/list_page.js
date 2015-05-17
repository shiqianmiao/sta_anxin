var Widget = require('com/mobile/lib/widget/widget.js');
var BasePage = require('./base_page.js');
var _ = require('com/mobile/lib/underscore/underscore.js');
var $ = require('$');
var Storage = require('com/mobile/lib/storage/storage.js');

$.extend(exports, BasePage);

exports.loadMore = Widget.define({
    events: {
        'tap [data-role="loadMore"]': function() {
            this.loadMore();
        },
        'touchend [data-role="loadMore"]': function(e) {
            e.preventDefault();
        }
    },
    init: function(config) {
        var self = this;
        var windowHeight = window.screen.height;
        this.render = _.template($(config.template).html());
        this.config = config;
        this.offset = 0;
        this.scrollAble = config.scrollAble ? config.scrollAble : false;
        this.listening = false;

        function onScroll() {
            var top = $(window).scrollTop();
            if ($('body').height() - windowHeight - top < 50) {
                self.loadMore();
            }
        }

        this.listenScroll = function() {
            if (self.listening) {
                return;
            }
            self.listening = true;
            $(window).on('scroll', onScroll);
        };

        this.removeScrollListener = function() {
            $(window).off('scroll', onScroll);
            self.listening = false;
        };
        if (config.scrollAble) {
            self.listenScroll();
        }
    },
    loadMore: function() {
        var self = this;
        if (self.loading) {
            return;
        }
        self.removeScrollListener();
        self.loading = true;
        self.getData(++self.offset, function(err, data) {
            if (!err) {
                if (data && data.length !== 0) {
                    self.config.$list.append(
                        self.render({
                            'posts': data
                        })
                    );
                    self.loading = false;
                    self.config.$loadMore.html('查看更多<i></i>');
                    if (self.config.scrollAble) {
                        self.listenScroll();
                    }
                } else {
                    self.config.$loadMore.html('没有更多了');
                }
            } else {
                BasePage.tip(err.message, 1500);
            }
        });
    },
    getData: function(query, callback) {
        var self = this;
        $.ajax({
            url: self.config.ajaxUrl,
            data: {
                offset: query,
                page: query + 1
            },
            beforeSend: function() {
                self.config.$loadMore.html('加载中...');
            },
            dataType: 'json'
        }).done(function(data) {
            callback(null, data);
        }).fail(function() {
            callback(new Error('network error!'));
        });
    }
});

var getURIParams = function(searchStr) {
    if (!searchStr) {
        searchStr = window.location.search;
    }
    var params = {},
        URIArr;
    searchStr = searchStr.replace('?', '');

    URIArr = searchStr.split('&');
    $.each(URIArr, function(i, v) {
        var keyArr = v.split('=');
        if (keyArr.length === 2) {
            params[keyArr[0]] = decodeURIComponent(keyArr[1]);
        }
    });
    return params;

};

exports.listFilter = Widget.define({
    events: {
        'click [data-role="filterItem"]': 'showFilterContent',
        'tap [data-role=checkItem]': 'toggleCheckItem',
        'tap .js-sigle [data-ajax]': 'showNextCate',
        'tap .js-sigle [data-value]': 'sigleUpdate',
        'tap [data-role="moreItem"] li': 'showChildFilter', //高级
        'tap [data-role="moreItem"] [data-role="singleCheck"]': 'moreSingleCheck', //高级check
        'tap [data-role="back"]': 'backParentFilter', //高级
        'tap .js-more [data-ajax]': 'showNextCate', //高级显示二级类目
        'tap .js-more [data-value]': 'moreUpdate', //高级选中
        'tap [data-role="reset"]': 'resetFilter',
        'tap [data-role="submit"]': 'submitFilter'
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
            if (that.noScroll) {
                e.preventDefault();
            }
        });

        $('.filtate-outter').css('position', 'sticky');

        //高级筛选默认值构造
        if (this.config.$moreChild && this.config.$moreChild.length) {
            this.config.$moreChild.find('.js-filt-child').each(function() {
                var $childEl = $(this);
                var params = {};

                $childEl.find('[data-key]').each(function() {
                    var key = $(this).data('key');
                    var value = $(this).find('.active').data('value');

                    if (!value) {
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
        var maxHeight = $(window).height() * 0.78;
        this.maxHeight = (Math.round(maxHeight / 41) - 1) * 41;
        config.$el.find('.js-sigle .warpper').css('height', this.maxHeight);
        if (config.$moreItem) {
            config.$moreItem.css('height', this.maxHeight);
            config.$moreItem.find('.warpper').css('height', this.maxHeight - 43);
            config.$moreChild.find('.warpper').css('height', this.maxHeight - 41);
        }
    },
    momentum: function(distance, curY, time, maxScrollY, warpperHeight) {
        var speed = Math.abs(distance) / time,
            destination, duration;

        var deceleration = 8e-4;

        destination = curY + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
        duration = speed / deceleration;

        if (destination < maxScrollY) {
            destination = warpperHeight ? maxScrollY - warpperHeight / 2.5 * (speed / 8) : maxScrollY;
            distance = Math.abs(destination - curY);
            duration = distance / speed;
        } else if (destination > 0) {
            destination = warpperHeight ? warpperHeight / 2.5 * (speed / 8) : 0;
            distance = Math.abs(curY) + destination;
            duration = distance / speed;
        }
        return {
            destination: Math.round(destination),
            duration: duration
        };
    },
    initScroll: function($warppers) {
        var self = this;

        $warppers.each(function() {
            var curEl = this;
            if (!$(this).data('hasScroll')) {
                var $ul = $(curEl).find('ul');
                var startY = 0,
                    curY = 0,
                    warpperHeight = $(curEl).height(),
                    maxScrollY = $(curEl).height() - $(curEl).find('ul').height(),
                    startTime = 0,
                    startScreenY = 0,
                    animating = false;

                if(maxScrollY > 0) {
                    maxScrollY = 0;
                }

                var scrollTo = function() {
                    if (curY > 0) {
                        curY = 0;
                    } else if (curY < 0 && curY < maxScrollY) {
                        curY = maxScrollY;
                    }

                    animating = false;
                    $ul.css({
                        '-webkit-transform': 'translate3d(0, ' + curY + 'px, 0)',
                        'transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        '-webkit-transition-duration': 400 + 'ms'
                    });
                };

                $(curEl).find('ul')
                    .on('touchstart', function(e) {
                        startY = e.changedTouches[0].screenY - curY;
                        startTime = e.timeStamp;

                        startScreenY = e.changedTouches[0].screenY;
                    })
                    .on('touchmove', function(e) {
                        animating = false;

                        curY = e.changedTouches[0].screenY - startY;
                        if (curY > 0) {
                            curY = curY * 0.4;
                        } else if (curY < maxScrollY) {
                            curY = maxScrollY + (curY - maxScrollY) * 0.4;
                        }

                        $(this).css({
                            '-webkit-transform': 'translate3d(0,' + curY + 'px, 0)',
                            '-webkit-transition-duration': '0'
                        });

                        var timeStamp = e.timeStamp;
                        if (timeStamp - startTime > 280) {
                            startTime = timeStamp;
                            startScreenY = e.changedTouches[0].screenY;
                        }
                    })
                    .on('touchend', function(e) {
                        var duration = e.timeStamp - startTime;
                        var distance = e.changedTouches[0].screenY - startScreenY;

                        if (animating) {
                            e.preventDefault();
                        }

                        animating = true;
                        if (curY > 0 || curY < maxScrollY) {
                            scrollTo();
                            return;
                        }

                        if (duration < 280) {
                            var newMove = self.momentum(distance, curY, duration, maxScrollY, warpperHeight);

                            curY = newMove.destination;
                            $(this).css({
                                '-webkit-transform': 'translate3d(0, ' + newMove.destination + 'px, 0)',
                                'transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
                                '-webkit-transition-duration': newMove.duration + 'ms'
                            });
                        }
                    })
                    .on('transitionend', function() {
                        if (!animating) {
                            return false;
                        }
                        animating = false;
                        scrollTo();
                    });
            }
            $(this).data('hasScroll', true);
        });
    },
    toggleCheckItem: function(e) {
        var $cur = $(e.currentTarget);

        $cur.find('[data-week]').toggleClass('checked js-check');
    },
    showFilterContent: function(e) {
        e.preventDefault();
        this.noScroll = true;
        var $target = $(e.currentTarget);

        if ($target.hasClass('active')) {
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

        var $container = $('#'+ id), $warppers;

        if($container.hasClass('js-more')) {
            $container = this.config.$moreItem;
        }

        $warppers = $container.find('.warpper');

        this.initScroll($warppers);
    },
    preventFilterContent: function(e) {
        e.preventDefault();
    },
    showNextCate: function(e) {
        e.preventDefault();
        var that = this;
        var $target = $(e.currentTarget);

        if ($target.hasClass('active')) {
            return false;
        }

        var $parent = $target.parents('.warpper');

        $parent.find('.active').removeClass('active');
        $target.addClass('active');
        var $nextEl = $parent.next();

        if ($nextEl.length) {
            $nextEl.find('.active').removeClass('active');
            var $tmpEl = $nextEl.next();
            //删除下下一级子类目
            while (1) {
                if ($tmpEl.length) {
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

        if (!extra) {
            extra = {};
        }

        url = url.replace('{keyword}', keyword);

        // 有子类目
        $.getJSON(url, extra, function(jsonData) {
            var curKey = jsonData.key;

            if (jsonData.data.length) {
                $.each(jsonData.data, function(i, v) {
                    var dataExtra = '';
                    if (v.extra) {
                        dataExtra = 'data-extra=\'' + JSON.stringify(v.extra) + '\'';
                    }

                    var dataDefaultName = '';
                    if (v.default_name) {
                        dataDefaultName = 'data-name="' + v.default_name + '"';
                    }
                    if (v.hasChild) {
                        html += '<li ' + dataExtra + ' data-ajax="' + v.id + '" ' + dataDefaultName + '><a>' + v.name + '</a><i class="filt-arrow"></i></li>';
                    } else {
                        html += '<li ' + dataExtra + ' data-value="' + v.id + '" ' + dataDefaultName + '><a>' + v.name + '</a></li>';
                    }

                });
            }

            if ($nextEl.length) {
                html = '<ul>' + html + '</ul>';
                $nextEl
                    .html(html)
                    .data('key', curKey)
                    .data('hasScroll', false)
                    .show();
            } else {
                var height = that.maxHeight;

                if ($parent.parents('.js-filt-child').length > 0) {
                    height = height - 41;
                }

                var className = 'bg-gray';

                if ($parent.closest('.filt-show').find('.warpper').length > 1) {
                    className = 'bg-black';
                }

                html = '<div style="height:' + height + 'px" class="warpper box-flex1 ' + className + '" data-key="' + curKey + '"><ul>' + html + '</ul></div>';
                $parent.after(html);
            }

            var id = $parent.parents('.filt-open').attr('id');
            var $warppers = $('#'+ id).find('.warpper');
            that.initScroll($warppers);
        });
    },
    sigleUpdate: function(e) {
        e.preventDefault();

        var that = this;
        var $target = $(e.currentTarget);

        if ($target.data('type') === 'customPrice') {
            this.showCustomPrice(e);
            return;
        } else {
            var $board = $('[data-role="customPriceBoard"]');

            $board.find('[data-role="customInput"]').each(function() {
                var $input = $(this);

                delete that.curParams[$input.data('name')];
            });
        }

        var $parent = $target.parents('.js-sigle');

        var $checkEl = $target.find('[type="checkbox"]');

        if ($checkEl.length) {
            var isChecked = $checkEl.prop('checked');
            $checkEl.prop('checked', !isChecked);
        }

        //去除子类目的active
        var $warpper = $target.parents('.warpper');
        var $nextEl = $warpper.next();
        //隐藏下一级子类目
        var $tmpEl = $nextEl;
        while (1) {
            if ($tmpEl.length) {
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
            var extra = $(this).find('.active').data('extra');
            if (extra) {
                paramsObj = $.extend(paramsObj, extra);
            }

            if (value === undefined || $.trim(value) === '') {
                value = $(this).find('.active').data('ajax');
            }
            //如果还没有值，删除这个key
            if (value === undefined || $.trim(value) === '') {
                delete that.curParams[key];
            } else {
                paramsObj[key] = value;
            }
        });
        var rejectArr = $parent.data('reject');
        if (rejectArr && rejectArr.length) {
            $.each(rejectArr, function(i, v) {
                delete that.curParams[v];
            });
        }

        this.gotoUrl(paramsObj);
    },
    showChildFilter: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);

        var id = $target.data('id');

        if (!id) {
            var curKey = $target.data('curKey');
            var curVal = $target.data('curValue');
            if (curKey && curVal !== undefined) {
                if ($target.find('.js-check').hasClass('active')) {
                    delete this.curParams[curKey];
                    $target.find('.js-check').removeClass('active');
                } else {
                    this.curParams[curKey] = curVal;
                    $target.find('.js-check').addClass('active');
                }
            }
        } else {
            this.config.$moreChild.find('.js-filt-child').hide();
            $('#' + id).show();
            this.config.$moreItem.parent().animate({
                left: '-100%'
            }, 300, 'ease-in-out');

            var $warppers = $('#'+ id).find('.warpper');
            this.initScroll($warppers);
        }
    },
    moreSingleCheck: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var $input = $target.find('input');

        var isCheck = $input.prop('checked');
        $input.prop('checked', !isCheck);
    },
    moreUpdate: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var that = this;
        if ($target.hasClass('active')) {
            return false;
        }

        //去除子类目的active
        var $warpper = $target.parents('.warpper');
        var $nextEl = $warpper.next();
        //隐藏下一级子类目
        var $tmpEl = $nextEl;
        while (1) {
            if ($tmpEl.length) {
                $tmpEl.hide();
                $tmpEl.find('.active').removeClass('active');
                $tmpEl = $tmpEl.next();
            } else {
                break;
            }
        }

        var text = $target.text();
        if ($target.data('name')) {
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
            if (extra) {
                paramsObj = $.extend(paramsObj, extra);
            }

            if (value === undefined || $.trim(value) === '') {
                value = $(this).find('.active').data('ajax');
            }

            //如果还没有值，删除这个key
            if (value === undefined || $.trim(value) === '') {
                delete that.curParams[key];
            } else {
                paramsObj[key] = value;
            }

            paramsObj[key] = value;
        });

        //更新父节点
        $parentsEl.data('params', paramsObj);
        var rejectArr = $parentsEl.data('reject');
        if (rejectArr && rejectArr.length) {
            $.each(rejectArr, function(i, v) {
                delete that.curParams[v];
            });
        }
        if (event) {
            $('#' + refId).trigger(event, paramsObj);
        }
    },
    backParentFilter: function(e) {
        e.preventDefault();
        this.backParnentHandler(null, null);
    },
    backParnentHandler: function(id, text) {
        if (id && text) {
            this.config.$moreItem.find('[data-id="' + id + '"]').find('.js-span').text(text);
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
        this.config.$moreItem.find('.js-check').each(function() {
            $(this).removeClass('active');
        });

        this.curParams = {};
        this.config.$moreChild.find('.js-filt-child').each(function() {
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

        this.config.$singleCheck.each(function() {
            $(this).find('input').prop('checked', false);
        });
    },
    submitFilter: function() {
        var that = this;
        var paramsObj = {};
        var $moreChild = this.config.$moreChild;
        var $checkItem = this.config.$checkItem;
        var $singleCheck = this.config.$singleCheck;

        if ($moreChild) {
            $moreChild.find('.js-filt-child').each(function() {
                var params = $(this).data('params');
                params = params || {};

                $.extend(paramsObj, params);
            });
        }

        if ($checkItem) {
            var checkedDay = '';

            $checkItem.find('.js-check').each(function() {
                checkedDay += $(this).data('week');
            });

            if (checkedDay) {
                paramsObj.workday = checkedDay;
            } else {
                delete this.curParams.workday;
            }
        }

        if ($singleCheck) {
            $singleCheck.each(function() {
                var $input = $(this).find('input');
                var key = $(this).data('key');
                if ($input.prop('checked')) {
                    paramsObj[key] = $input.val();
                } else {
                    delete that.curParams[key];
                }
            });
        }

        this.gotoUrl(paramsObj);
    },
    gotoUrl: function(paramsObj) {
        paramsObj = $.extend({}, this.curParams, paramsObj);
        //页面跳转到第一页
        paramsObj.page = 1;
        delete paramsObj.ingore;
        delete paramsObj.ifid;

        if (!window.location.origin) {
            window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }
        window.location.href = window.location.pathname + '?' + $.param(paramsObj);
    }
});

exports.removeField = function(config) {
    // 二手手机号特殊筛选
    var $operatorEl = $('#filter-more [data-id="filt-more-shoujihao_operator"]');
    var $featureEl = $('#filter-more [data-id="filt-more-shoujihao_feature"]');

    if (!$operatorEl.length || !$featureEl.length) {
        return false;
    }

    Widget.ready($('.list-filtrate'), function(filtWidget) {
        config.$el.on('click', 'li', function() {
            var curVal = $(this).data('value');

            if (curVal === 'shoujihaoma') {
                $operatorEl.show();
                $featureEl.show();

                $('#filt-more-shoujihao_operator').addClass('js-filt-child');
                $('#filt-more-shoujihao_feature').addClass('js-filt-child');

            } else {
                delete filtWidget.curParams.shoujihao_operator;
                delete filtWidget.curParams.shoujihao_feature;

                // 隐藏父筛选
                $operatorEl.hide();
                $featureEl.hide();

                //删除筛选，确保不会再带走参数
                $('#filt-more-shoujihao_operator').removeClass('js-filt-child');
                $('#filt-more-shoujihao_feature').removeClass('js-filt-child');
            }
        });
    });
};

exports.geoStatus = function(config) {
    var $el = config.$el;
    var url = config.url;
    var arr, baseURL = '';
    if (url) {
        url = url.replace(/#./, '');
        arr = url.split('?');
        baseURL = arr[0];
    }
    var paramsObj = {};

    if (arr && arr.length > 1) {
        var searchStr = arr[1];
        paramsObj = getURIParams(searchStr);
    }

    if (config.lat && config.lng) {
        var latlng = config.lat + ',' + config.lng;
        $.getJSON('/latlng/?latlng=' + latlng, function(data) {
            var addressName = data.data.currentLocation;
            $el.find('.tip1').hide();
            config.$addressName.text(addressName);
            config.$agree.show();
        });
    }

    var posStorage = new Storage('nearbyPos');

    var requestGeo = function() {
        var geoDefer = $.Deferred();

        geoDefer
            .done(function(curPos) {
                $el.find('.tip1').hide();
                config.$checking.show();
                // config.$agree.show();

                _.extend(paramsObj, getURIParams());

                paramsObj.lat = curPos.latitude;
                paramsObj.lng = curPos.longitude;

                window.location.href = window.location.pathname + '?' + $.param(paramsObj);

                setTimeout(function() {
                    $el.find('.tip1').hide();
                    config.$check.show();
                }, 1000);
            })
            .fail(function(err) {
                var text = '';
                if (err.code === err.PERMISSION_DENIED) {
                    text = '浏览器定位授权未打开';
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    text = '定位失败';
                } else {
                    text = '定位超时';
                }
                $el.find('.tip1').hide();
                config.$tip.text(text);
                config.$reject.show();
            });


        $el.find('.tip1').hide();
        config.$checking.show();

        var curPos = posStorage.get('curPos');
        var now = new Date().getTime();

        if (!curPos || (curPos && now - curPos.curTime > 1000 * 3600 * 5)) {
            posStorage.remove('curPos');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos) {
                    curPos = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        curTime: new Date().getTime()
                    };

                    posStorage.set('curPos', curPos);
                    geoDefer.resolve(curPos);
                }, function(err) {
                    geoDefer.reject(err);
                }, {
                    timeout: config.timeout || 30000,
                    maximumAge: 600000,
                    enableHighAccuracy: true
                });
            } else {
                // 手机不支持定位
                geoDefer.reject();
            }
        } else {
            geoDefer.resolve(curPos);
        }
    };

    config.$check.on('click', function(e) {
        e.preventDefault();
        requestGeo();
    });

    config.$refresh.on('click', function() {
        posStorage.remove('curPos');
        requestGeo();
    });

};

exports.initPage = function(config) {
    var curParams = getURIParams();
    var selectedIndex = config.$select.attr('selectedIndex');
    var gotoUrl = function() {
        window.location.href = window.location.pathname + '?' + $.param(curParams);
    };

    curParams.page = curParams.page ? parseInt(curParams.page, 10) : 1;

    $(config.$prev).on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('disable')) {
            return false;
        }
        if (curParams.page) {
            curParams.page -= 1;
        } else {
            curParams.page = 1;
        }

        gotoUrl();
    });

    config.$select
        .on('change', function() {
            var val = $(this).val();
            $(this).prop('selectedIndex', selectedIndex || 0);
            setTimeout(function() {
                window.location.href = val;
            }, 300);
        })
        .on('touchstart', function() {
            $(this).addClass('touch');
        })
        .on('touchend, touchmove, touchcancel', function() {
            $(this).removeClass('touch');
        })
        .on('touchstart, touchmove, touchend', function(e) {
            e.stoppropagation();
        });

    $(config.$next).on('click', function() {
        if ($(this).hasClass('disable')) {
            return false;
        }

        if (curParams.page) {
            curParams.page += 1;
        } else {
            curParams.page = 1;
        }

        gotoUrl();
    });
};


exports.postList = function(config) {
    if (config.$imState && config.$imState.length) {
        var userIds = [];
        config.$imState.each(function() {
            var userId = $(this).data('userId');
            userIds.push(userId);
        });
        userIds = userIds.join(',');

        $.getJSON('http://webim.ganji.com/index.php?op=getuserstatuss&callback=?', {
            userIds: userIds
        }, function(data) {
            //拿到了所有的在线状态
            var stateObj = data.data;
            if (stateObj) {
                config.$imState.each(function() {
                    var userId = $(this).data('userId');
                    if (stateObj[userId] && stateObj[userId].status) {
                        $(this).addClass('online').show();
                        $(this).find('span').text('在线');
                    }
                });
            }
        });
    }

    if (config.$img && config.$img.length) {
        config.$img.each(function() {
            var offsetTop = $(this).offset().top;
            $(this).data('offsetTop', offsetTop);
        });

        var winHeight = $(window).height();
        var timer = null;
        var lastIndex = 0;
        var scrollHandler = function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                var scrollTop = $(window).scrollTop();
                config.$img.each(function(i) {
                    var src = $(this).data('src');
                    if (src) {
                        var offsetTop = $(this).data('offsetTop');
                        if (scrollTop + winHeight + 300 > offsetTop) {
                            $(this).attr('src', src);
                            $(this).data('src', '');
                        } else {
                            lastIndex = i;
                            return false;
                        }
                    }
                }, 0);
                config.$img = $(config.$img.toArray().splice(lastIndex));

                if (config.$img.length === 1) {
                    var lastSrc = config.$img.data('src');
                    config.$img.attr('src', lastSrc);
                    $(window).off('scroll', scrollHandler);
                    return false;
                }
            });
        };

        $(window).on('scroll', scrollHandler);
    }
};

exports.init = function() {
    BasePage.init();
};
