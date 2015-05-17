var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var API = require('../../lib/remoteAPI.js');
//var NativeAPI = require('app/client/common/lib/native/native.js');


var template = require('../template/detail/detail_page.tpl');
var pageConfig;
require('app/client/app/fw/service/style/service.css');

exports.init = function (config) {
    this.config = config;
    pageConfig = config;

    API.getData(
        {
            'controller': 'Ask',
            'action': 'detail',
            'id': config.ask_id
        },
        function(err, data){
            $('body').removeClass('loading');
            if (err) {
                $('body').addClass('offline');
                return;
            }

            if (!data) {
                $('body').addClass('nothing');
                return;
            }
            $('body').removeClass('loading').append(template({
                detail : data
            }));
            Widget.initWidgets();
            $(window).on('scroll', onScroll);
            function onScroll() {
                var top = $(window).scrollTop();
                //$('html').height() - ( $(window).height() + $(window).scrollTop())
                if (document.body.scrollHeight - $('body').height() - top < 50) {
                    var $wrap = $('[data-role="listwrap"]');
                    if (parseInt($wrap.data('maxpage'), 10) === parseInt($wrap.data('page'), 10)) {
                        return;
                    } else {
                        loadMore($wrap);
                    }
                }
            }
            function loadMore($wrap) {
                if ($wrap.data('loadMore')) {
                    return;
                }
                var $more = $wrap.siblings('[data-role="more"]');
                $wrap.data('loadMore', true);
                var nextPage = parseInt($wrap.data('page'), 10) + 1;
                var params = {
                    'controller': 'Ask',
                    'action': 'detail',
                    'id': config.ask_id,
                    'pageIndex': nextPage
                };
                $more.removeClass('hide');
                API.getData(
                    params,
                    function (err, data) {
                        if (err) {
                            return;
                        }
                        $wrap.data('loadMore', false);
                        $wrap.data('page', data.page_info.page);
                        var pageTemplate = require('../template/detail/list_item.tpl');
                        $more.addClass('hide');
                        $wrap.append(pageTemplate({
                            detail : data
                        }));
                    }
                );
            }
        }
    );
};