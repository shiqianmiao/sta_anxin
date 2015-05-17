var $ = require('$');
var AutoComplete = require('com/mobile/lib/autocomplete/autocomplete.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var BasePage = require('./base_page');
var Cookie = require('com/mobile/lib/cookie/cookie.js');

exports.search = Widget.define({
    events: {
        'tap [data-role="suggestion"] li': function (e) {
            this.search($(e.currentTarget).data('keyword'));
        },
        'touchend [data-role="suggestion"] li': function (e) {
            e.preventDefault();
        },
        'submit form': function (e) {
            if (!this.config.$input.val()) {
                e.preventDefault();
                this.search(this.config.defaultKeyword);
            }
        },
        'tap [data-role="close"]': function () {
            this.config.$input.val('').focus();
            this.config.$close.hide();
        },
        'focus [data-role="input"]': function () {
            if (this.config.$input.val()) {
                this.config.$close.show();
            } else {
                this.config.$close.hide();
            }
        },
        'blur [data-role="input"]': function () {
            this.config.$close.hide();
        },
        'input [data-role="input"]': function () {
            if (this.config.$input.val()) {
                this.config.$close.show();
            } else {
                this.config.$close.hide();
            }
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        this.autocomplete = new AutoComplete({
            $input: this.config.$input,
            getData: function (query, callback) {

                if (query) {
                    $.getJSON(config.autocompleteUrl, { keyword: query})
                        .done(function (data) {
                            callback(data);
                        });
                } else {
                    callback(null);
                }
            }
        });

        this.autocomplete
            .on('data', function (data) {
                self.showSuggestion(data);
            })
            .on('empty', function () {
                self.hideSuggestion();
            });

        this.config.$input
            .on('blur', function () {
                self.hideSuggestion();
            });
    },
    showSuggestion: function (data) {
        var html = data.map(function (row) {
            return '<li data-keyword="{{keyword}}">{{keyword}}<span class="fr">约{{count}}条</span></li>'
                        .replace(/\{\{keyword\}\}/g, row.text)
                        .replace(/\{\{count\}\}/g, row.count);
        }).join('');

        if (!html) {
            this.hideSuggestion();
        } else {
            this.config.$suggestion.html(html);

            this.config.$el.addClass('active');
        }
    },
    hideSuggestion: function () {
        this.config.$el.removeClass('active');
    },
    search: function (keyword) {
        this.config.$input.val(keyword);
        this.config.$form.submit();
    }
});

exports.footerSearch = function (config) {
    config.$submit.on('tap', function (e) {
        if (!config.$input.val()) {
            e.preventDefault();
            config.$input.val(config.defaultKeyword);
            config.$el.submit();
        }
    });
};

exports.slideAd = function (config) {
    var index = 0;
    var total = $(config.$item).size();

    if (total <= 1) {
        return;
    }

    setInterval(function () {
        index ++;
        if (index >= total) {
            index = 0;
        }
        config.$item
            .hide()
            .eq(index)
                .show();
    }, config.interval || 5000);
};

exports.showMore = function (config) {
    config.$toggle.on('click', function (e) {
        e.preventDefault();
        setTimeout(function () {
            config.$el.toggleClass('active');
            config.$text.text(config.$el.hasClass('active') ? '收起' : '更多');
        }, 300);
    });
};

exports.cityInfo = function (config) {
    var ipFirst       = config.ipFirst || false;
    var cookieExpires = config.cookieExpires || 24;
    var geoTimeout    = config.geoTimeout * 1000 || 15000;
    require.async('com/mobile/lib/cookie/cookie.js', function (Cookie) {
        if (!Cookie.get('index_city_domain') && !Cookie.get('index_city_refuse')) {
            require.async(['com/mobile/lib/geo/geo.js'], function (GEO) {
                var tip = BasePage.tip('正在获取位置信息…');

                setTimeout(function() {
                    GEO.getLocation({ ipFirst: ipFirst, timeout:geoTimeout }, function (error, cityInfo) {
                        var text;
                        var cookieConfig = {
                            expires: 3600 * cookieExpires,
                            path: '/',
                            domain: '.ganji.com'
                        };

                        if (!error) {
                            tip.setMessage('当前定位城市: ' + cityInfo.cityName);

                            Cookie.set('index_city_domain', cityInfo.cityDomain, cookieConfig);
                            Cookie.set('index_city_name', cityInfo.cityName, cookieConfig);

                            if (cityInfo.cityDomain === config.currentCity) {
                                setTimeout(function () {
                                    tip.remove();
                                }, 1000);
                                return;
                            }
                            $('#lbstips .js-city-name').text(cityInfo.cityName);
                            $('#lbstips').show();
                            $('#lbsmask').show();
                            $('#lbstips')
                                .on('click', '.js-cancel', function(e) {
                                    e.preventDefault();
                                    tip.remove();
                                    $('#lbstips').hide();
                                    $('#lbsmask').hide();
                                })
                                .on('click', '.js-confirm', function(e) {
                                    e.preventDefault();
                                    tip.setMessage('正在跳转...');
                                    window.location.href = '/' + cityInfo.cityDomain;
                                });
                        } else if (error && error.code) {
                            switch (error.code) {
                                case error.PERMISSION_DENIED:
                                    Cookie.set('index_city_refuse', 'refuse', cookieConfig);
                                    text = '您已拒绝共享位置，可手动切换城市';
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    text = '抱歉，定位失败，可手动切换城市';
                                    break;
                                case error.TIMEOUT:
                                    text = '抱歉，定位失败，可手动切换城市';
                                    break;
                                default:
                                    text = '抱歉，定位失败，可手动切换城市';
                            }

                            tip.setMessage(text);
                            setTimeout(function () {
                                tip.remove();
                            }, 1000);
                        } else {
                            text = '抱歉，定位失败，可手动切换城市';

                            tip.setMessage(text);
                            setTimeout(function () {
                                tip.remove();
                            }, 1000);
                        }
                    });
                }, 1000);
            });
        }
    });
};
/*jshint -W016 */
exports.imMsgCount = function (config) {
    var getUserIdDefer = $.Deferred();

    getUserIdDefer
        .done(function (userID) {
            $.ajax({
                url: 'http://webim.ganji.com/index.php?op=getnewmsgcount',
                data: {
                    userId: userID
                },
                dataType: 'jsonp'
            })
                .done(function (data) {
                    if (data.data && data.data.msgTotalNewCount && data.data.msgTotalNewCount !== '0') {
                        config.$count.text(data.data.msgTotalNewCount);
                        config.$el.show();
                        $('body').addClass('show-im-message');
                        config.$close.on('touchend', function (e) {
                            e.preventDefault();
                            setTimeout(function () {
                                $('body').removeClass('show-im-message');
                                config.$el.hide();
                            }, 300);
                        });
                    }else{
                        var cookieVal = Cookie.get('top_info');
                        if ( cookieVal !== 'off' || !cookieVal) {
                            if (config.url !== '' && config.text !== '') {
                                var backUrl = 'location.href=\''+config.url+'\'';
                                $('body').addClass('show-im-message');
                                $('#im').attr('onclick',backUrl).text(config.text);
                                config.$el.show();
                                config.$close.on('touchend', function (e) {
                                    e.preventDefault();
                                    Cookie.set('top_info','off',{
                                        domain : '3g.ganji.com',
                                        expires: 3*24*3600,
                                        path   : '/'
                                    });
                                    $('body').removeClass('show-im-message');
                                    config.$el.hide();
                                });
                                $('#im').on('click', function (e) {
                                    e.preventDefault();
                                    Cookie.set('top_info','off',{
                                        domain : '3g.ganji.com',
                                        expires: 3*24*3600,
                                        path   : '/'
                                    });
                                    $('body').removeClass('show-im-message');
                                    config.$el.hide();
                                });
                            }
                        }
                    }
                });
        });

    require.async('com/mobile/lib/cookie/cookie.js', function (Cookie) {
        var userInfo = JSON.parse(Cookie.get('GanjiUserInfo') || '{}');
        if (!userInfo.user_id) {
            require.async(['com/mobile/lib/crypto/md5.js'], function (MD5) {
                var uuid = MD5(Cookie.get('__utmganji_v20110909') || '');
                var arr = [0, 0, 0, 0];
                var userID;

                uuid.split('').forEach(function (ch, i) {
                    var hex = (ch >= '0' && ch <= '9') ? ch - '0' : 10 + ch.charCodeAt(0) - 97;
                    var n = i % 8;
                    arr[Math.floor(i/8)] |= hex << ((n % 2 ===0  ? n + 1 : n - 1) * 4);
                });

                arr.forEach(function (v, i) {
                    arr[i] = arr[i] >>> 0;
                });

                userID = 2147483648 + Math.floor((arr[0] + arr[1] + arr[2] + arr[3]) / 8);
                getUserIdDefer.resolve(userID);
            });
        } else {
            getUserIdDefer.resolve(userInfo.user_id);
        }
    });
};
/*jshint +W016 */

exports.couponMsg = function (config) {
    $.ajax({
        url:config.url,
        type:'get',
        dataType:'json'
    }).done(function (data) {
        if (data && data.data > 0) {
            config.$count.text(data.data);
            config.$el.show();
            $('body').addClass('show-im-message');
        }
    });
};

exports.fixedToTop = function(config) {
    //IOS7 hack
    var isIOS7 = navigator.userAgent.indexOf('iPhone OS 7') > -1;

    if(!isIOS7) {
        config.$el.css('position', 'relative');
    }
};

exports.closeHistory = Widget.define({
    events: {
        'click [data-role="close"]': 'clearCookie'
    },
    init: function(config) {
        this.config = config;
    },
    clearCookie: function() {
        var config = this.config;

        require.async('com/mobile/lib/cookie/cookie.js', function (Cookie) {
            Cookie.remove(config.cookie, {
                domain: config.domain,
                path: config.path
            });
            config.$el.remove();
        });
    }
});

exports.bottomSearch = Widget.define({
    events: {
        'tap [data-role="close"]': function () {
            this.config.$input.val('').focus();
            this.config.$close.hide();
        },
        'focus [data-role="input"]': function () {
            if (this.config.$input.val()) {
                this.config.$close.show();
            } else {
                this.config.$close.hide();
            }
        },
        'blur [data-role="input"]': function () {
            this.config.$close.hide();
        },
        'submit form': function(e) {
            var keyword = this.config.$input.val();
            if (!keyword.trim()) {
                e.preventDefault();
                return;
            }
        },
        'input [data-role="input"]': function () {
            if (this.config.$input.val()) {
                this.config.$close.show();
            } else {
                this.config.$close.hide();
            }
        }
    },
    init: function (config) {
        this.config = config;
    }
});


exports.init = function () {
    BasePage.init();
};