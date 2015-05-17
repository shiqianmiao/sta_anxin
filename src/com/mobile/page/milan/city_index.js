var Widget = require('com/mobile/lib/widget/widget.js');
var BasePage = require('./base_page.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');
var $ = require('$');

var changeCity = function(city) {
    window.location.href = 'http://3g.ganji.com/' + city;
};

exports.searchCity = function(config) {
    config.$form.submit(function() {
        var val = config.$input.val();
        val = $.trim(val);
        var patrn = /^[\u4e00-\u9fa5]+$/;
        var patrn2 = /^[\d]+$/;
        if(!val) {
            return false;
        }
        if((!patrn.test(val) && !patrn2.test(val)) || val.length > 5){
            $('#search-error').show();
            return false;
        }
    });

    config.$input.on('input focus', function() {
        var val = $(this).val();
        val = $.trim(val);
        $('#search-error').hide();
        if(val) {
            config.$close.show();
        } else {
            config.$close.hide();
        }
    });

    config.$close.on('click', function(e) {
        e.preventDefault();
        config.$input.val('');
        $('#searching').hide();
        $('#no-search').show();
    });

    $('#searching').on('click', 'js-select', function(e) {
        e.preventDefault();
        $('#searching').hide();
        $('#no-search').show();
    });
};

exports.geoCity = function(config) {
    var newCityDomain = null;
    var ipFirst       = config.ipFirst || false;
    var cookieExpires = config.cookieExpires || 24;
    var geoTimeout    = config.geoTimeout * 1000 || 15000;
    var doneHandler = function(data) {
        var cityDomain = Cookie.get('cityDomain');

        setTimeout(function() {
            if(data && data.cityDomain) {
                if(cityDomain !== data.cityDomain) {
                    newCityDomain = data.cityDomain;
                    $('#tips .js-city-name').text(data.cityName);
                    $('#tips').show();
                    $('#mask').show();
                } else {
                    config.$el.addClass('active');
                }
                config.$text.text(data.cityName);
            }

            config.$el.removeClass('positioning');
        }, 1000);
    };

    var failHandler = function(error) {
        var text = '定位不成功，请手动选择城市';

        if (error && error.code) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    text = '浏览器定位服务尚未打开';
                    break;
                case error.POSITION_UNAVAILABLE:
                    text = '定位不成功，请手动选择城市';
                    break;
                case error.TIMEOUT:
                    text = '定位不成功，请手动选择城市';
                    break;
                default:
                    text = '定位不成功，请手动选择城市';
            }
        }

        setTimeout(function() {
            config.$el.removeClass('active');
            config.$text.text(text);
            config.$el.removeClass('positioning');
        }, 1000);
    };

    var geoLocate = function() {
        require.async(['com/mobile/lib/geo/geo.js'], function (GEO) {
            GEO.getLocation($.extend(config, { ipFirst: ipFirst, timeout: geoTimeout }), function (err, cityInfo) {
                var cookieConfig = {
                    expires: 3600 * cookieExpires,
                    path: '/',
                    domain: '.ganji.com'
                };

                if (!err) {
                    Cookie.set('index_city_domain', cityInfo.cityDomain, cookieConfig);
                    Cookie.set('index_city_name', cityInfo.cityName, cookieConfig);

                    doneHandler(cityInfo);
                } else {
                    failHandler(err);
                }
            });
        });

    };

    var doLocate = function() {
        config.$el.removeClass('active');
        config.$text.text('正在定位中');
        config.$el.addClass('positioning');

        var cityDomain = Cookie.get('index_city_domain');
        var cityName = Cookie.get('index_city_name');

        if (cityDomain && cityName) {
            doneHandler({
                cityDomain: cityDomain,
                cityName: cityName
            });
        } else {
            geoLocate();
        }
    };

    $('#tips')
        .on('click', '.js-cancel', function(e) {
            e.preventDefault();
            $('#tips').hide();
            $('#mask').hide();
        })
        .on('click', '.js-confirm', function(e) {
            e.preventDefault();
            changeCity(newCityDomain);
        });

    config.$refresh.on('click', function(e) {
        e.preventDefault();
        config.$el.removeClass('active');
        config.$text.text('正在定位中');
        config.$el.addClass('positioning');
        geoLocate();
    });

    doLocate();
};

exports.toggleCity = Widget.define({
    events: {
        'click [data-role="province"]': 'toggleCity'
    },
    init: function(config) {
        this.config = config;
        this.hasToggle = false;

        var blankHander = $.proxy(this.hideMenu, this);

        // 防止点击 其他城市 这一行时触发周围按钮的跳转
        $('.column-title').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            blankHander();
        });
        $('footer').on('click', blankHander);
        $('body').on('click', blankHander);
    },
    hideMenu: function() {
        if (!this.hasToggle) {
            this.config.$province.removeClass('active');
            this.config.$el.find('.category-child').removeClass('active');
        } else {
            this.hasToggle = false;
        }
    },
    toggleCity: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var id = $target.data('id');

        if(!$target.hasClass('active')) {
            this.config.$province.removeClass('active');
            this.config.$el.find('.category-child').removeClass('active');
        }

        $target.toggleClass('active');
        $('#' + id).toggleClass('active');
        this.hasToggle = true;
    }
});

exports.init = function () {
    BasePage.init();
};