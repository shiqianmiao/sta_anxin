var $ = require('$');
var AutoComplete = require('com/mobile/lib/autocomplete/autocomplete.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Storage = require('com/mobile/lib/storage/storage.js');


exports.popSearch = Widget.define({
    events: {
        'click [data-role="key"]': function(e) {
            var $target = $(e.currentTarget);
            var source = '';
            if(this.config.source) {
                source = '_' + this.config.source;
            }

            if($target.hasClass('fc-green')) {
                this.ifid = 'suggestion_history' + source;
            } else {
                this.ifid = 'suggestion_remote' + source;
            }

            this.search($(e.currentTarget).parent().data('keyword'));
        },
        'submit form': function(e) {
            var keyword = this.config.$input.val();

            if (!keyword.trim()) {
                e.preventDefault();

                if (this.config.defaultKeyword) {
                    if (this.config.defaultIfid && this.config.$ifid && this.config.defaultIfid) {
                        this.config.$ifid.val(this.config.defaultIfid);
                    }
                    return this.search(this.config.defaultKeyword);
                }
                return;
            }

            if (keyword !== this.config.defaultKeyword && this.config.$ifid && this.config.ifid) {
                if (this.ifid) {
                    this.config.$ifid.val(this.ifid);
                } else {
                    this.config.$ifid.val(this.config.ifid);
                }
            }

            this.setHistory(this.config.$input.val());
        },
        'tap [data-role="close"]': function() {
            this.config.$close.hide();
            this.config.$input.val('');
            this.hideSuggestion();
        },
        'click [data-role="add"]': function(e) {
            var $input = this.config.$input;
            var keyword = $(e.currentTarget).parent().data('keyword');
            $input.val(keyword);

            this.autocomplete.trigger('change');

            $input.focus();
        },
        'click [data-role="hide"]': function() {
            this.hideSuggestion();
        },
        'click [data-role="clear"]': function() {
            this.clearHistory();
        },
        'focus [data-role="input"]': function() {
            $('body').removeClass('header-fixed');
            if (this.config.$input.val()) {
                this.config.$close.show();
            } else {
                this.config.$close.hide();
            }
            this.config.$input.attr('placeholder','');
        },
        'blur [data-role="input"]': function() {
            this.config.$close.hide();
            if (this.wasHeaderFixed) {
                $('body').addClass('header-fixed');
            }
            this.config.$input.attr('placeholder',this.config.defaultKeyword);
        },
        'input [data-role="input"]': function() {
            if (this.config.$input.val()) {
                this.config.$close.show();
            } else {
                this.config.$close.hide();
            }
        },
        'click [data-role=cancel]': function () {
            this.config.$el.removeClass('active');
            this.enableScroll();
        },
        'change-to': function (events, node) {
            if (node === '#search_list') {
                var $node = $(node);
                var history = this.storage.get('history') || [];
                $node.html(this.renderHistory(history));
            }
        }
    },
    init: function(config) {
        var self = this;
        this.storage = new Storage('autocomplete');
        this.config = config;
        this.isInList = this.config.isInList || false;
        this.wasHeaderFixed = $('body').hasClass('header-fixed');
        this.$ifid = this.config.$ifid;
        this.autocomplete = new AutoComplete({
            $input: this.config.$input,
            getData: function(query, callback) {
                if (query) {
                    $.getJSON(config.autocompleteUrl, {
                        keyword: query
                    })
                        .done(function(data) {

                            var matchQuery = self.matchLocalData(query, self.storage.get('history') || []);
                            var myData = data;
                            if (matchQuery) {
                                myData = self.filter(matchQuery.text, data);
                                myData.unshift(matchQuery);
                            }

                            callback(myData.slice(0,6));
                        });
                }
            }
        });

        this.autocomplete
            .on('data', function (data, query) {
                if (query && query.trim() && self.isInList) {
                    data = data.concat([{
                        _source: 'searchGlobal',
                        query: query,
                        url: self.config.searchGlobalUrl
                    }]);
                }

                self.showSuggestion(self.config.$input.val(), data);
            })
            .on('empty', function (query) {
                if (query && query.trim() && self.isInList) {
                    self.showSuggestion(query, [{
                        _source: 'searchGlobal',
                        query: query,
                        url: self.config.searchGlobalUrl
                    }]);
                }
                self.hideSuggestion();
            });
    },
    matchLocalData: function(query, localData) {
        var result;
        var regex = new RegExp('^' + query,'i');
        var data = localData.reverse();
        data.forEach(function(item) {
            if (regex.test(item.text)) {
                result = item;
                return;
            }
        });
        return result;
    },
    filter: function(query, arry) {
        var myArr = arry || [];
        var resultData = [];
        myArr.forEach(function(item) {
            if (query !== item.text) {
                resultData.push(item);
            }
        });
        return resultData;
    },
    formatItem: function(query, row) {
        var html = '';
        var tem = row.text;
        var term;
        if (tem) {
            term = tem.replace(new RegExp('^(' + query + ')', 'g'), '');
            if (query && term !== row.text && row._source !== 'localStorage') {
                tem = row.text.replace(new RegExp('(' + term + ')', 'g'), '<b>$1</b>');
            }
        }

        if (row._source === 'localStorage') {
            html = '<li  class="js-touch-state" data-keyword="{{keyword}}"><span data-role="key" class="sug-title fc-green"><span class="sug-text">{{tem}}</span></span><span data-role="add" class="sug-add">+</span></li>'
                .replace(/\{\{keyword\}\}/g, row.text)
                .replace(/\{\{tem\}\}/g, tem);
        } else if (row._source === 'searchGlobal') {
            html = '<li class="js-touch-state js-search-all search-all" data-keyword="' + query + '"><a href="'+ row.url +'&keyword='+query+'&ifid=suggestion_all" class="fc-gray">在全站搜“' + (query.length > 10 ? query.substr(0, 10) + '...' : query) + '”</a></li>';
        } else {
            html = '<li class="js-touch-state" data-keyword="{{keyword}}"><span data-role="key" class="sug-title"><span class="sug-text">{{tem}}</span><span class="sug-num">约{{count}}条</span></span><span data-role="add" class="sug-add">+</span></li>'
                .replace(/\{\{keyword\}\}/g, row.text)
                .replace(/\{\{tem\}\}/g, tem)
                .replace(/\{\{count\}\}/g, row.count);
        }
        return html;
    },
    showSuggestion: function(query, data) {
        var self = this;
        var html = data.map(function(row) {
            return self.formatItem(query, row);
        }).join('');
        if (!html) {
            this.hideSuggestion();
        } else {
            if (!query.trim()) {
                this.config.$suggestion.html(html + '<li class="sug-empty"><span data-role="clear" class="fc-50">清除历史记录</span><span data-role="hide" class="sug-close js-touch-state">关闭</span></li>');
            } else {
                this.config.$suggestion.html(html + '<li class="sug-empty"><span data-role="hide" class="sug-close js-touch-state">关闭</span></li>');
            }
            this.config.$searchBar.addClass('active');
        }
    },
    hideSuggestion: function() {
        this.config.$searchBar.removeClass('active');
    },
    search: function(keyword) {
        this.config.$input.val(keyword);
        this.config.$form.submit();
    },
    setHistory: function(keyword) {
        var arr = this.storage.get('history') || [];
        var myArr = [];
        myArr = this.filter(keyword, arr);
        myArr.unshift({
            text: keyword.replace(/<|>|\//g, ''),
            _source: 'localStorage'
        });
        this.storage.set('history', myArr.slice(0, 6));
    },
    clearHistory: function() {
        var self = this;
        self.config.$suggestion.html('');
        self.hideSuggestion();
        self.autocomplete.cache = [];
        self.storage.clear();
    },
    renderHistory: function (data) {
        var html = data.map(function(row) {
            return '<li  class="js-touch-state list-item" data-keyword="{{keyword}}"><a href="javascript:;" data-role="key" >{{keyword}}</a></li>'
                .replace(/\{\{keyword\}\}/g, row.text);
        }).join('');
        return html;
    },
    enableScroll: function () {
        this.config.$el.off('touchmove');
    }
});

exports.topSearch = Widget.define({
    events: {
        'tap [data-role="pop"]': function() {
            $('#popSearch')
                .addClass('active')
                .find('[data-role=input]')
                .val(this.config.$input.val())
                .focus();
            this.disableScroll();
        }
    },
    init: function (config) {
        this.config = config;
    },
    disableScroll: function () {
        $('#popSearch').on('touchmove', function (e) {
            e.preventDefault();
        });
    }
});