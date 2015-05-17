var $ = require('$');
var BasePage = require('com/mobile/page/milan/detail_page.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Uploader = require('com/mobile/lib/uploader/uploader.js');
var confirmPopRender = require('com/mobile/page/milan/template/confirm_pop.tpl');

var EventEmitter = require('com/mobile/lib/event/event.js');

module.exports = Widget.define({
    events:{
        'click [data-role="more"]':function(){
            this.config.$el.toggleClass('active');
        },
        'change [data-role="uploader"]': function (e) {
            [].forEach.call(e.target.files, this.uploader.upload.bind(this.uploader));
            // this.reloadAddBtn(e);
        },
        'Upload::success': function (e, fileInfo) {
            this.success(fileInfo);
            this.reloadAddBtn(e);
        },
        'Upload::error': function (e, fileInfo, error) {
            this.onError(fileInfo, error);
        },
        'click [data-role="img"]': function (e) {
            e.preventDefault();
            var self = this;
            var $li = $(e.currentTarget);
            var id = $li.data('id');
            var fileInfo = this.uploader.files[id];
            var url = $li.find('img').attr('src');

            this.confirm(url, function(isConfirm){
                if (isConfirm) {
                    $li.remove();
                    self.uploader.deleteFile(fileInfo.id);
                    self.deleteFile(fileInfo);
                    self.config.$el.trigger('Upload::delete');
                }
            });
        }
    },
    init: function (config) {
        var self     = this;
        var $input   = config.$input;
        var data      = $input.val();

        if (data) {
            try {
                data = JSON.parse(data);
            } catch (ex) {
                data = null;
            }
        }

        $input.val('[[], []]');

        this.config = config;
        var type = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
        if(config.type) {
            type = config.type.replace(/\s/g, '').split(',');
        }
        this.uploader = new Uploader({
            url: config.uploadUrl || 'http://image.ganji.com/UploadFile.inc.php',
            maxCount: typeof config.maxCount === 'undefined' ? 15 : config.maxCount,
            uploadDir: typeof config.uploadDir === 'undefined' ? 'default' : config.uploadDir,
            allowTypes: type,
            ajaxTimeout: typeof config.ajaxTimeout === 'undefined' ? 30 : config.ajaxTimeout,
            uploadedFiles: data ? data[0] : []
        });

        this.config.width = this.config.$uploader.width();

        Object.keys(this.uploader.files).forEach(function (id) {
            var file = self.uploader.files[id];
            self.addFile(file);
            self.success(file);
        });

        this.uploader
            .on('success', function (fileInfo) {
                config.$el.trigger('Upload::success', [fileInfo]);
            })
            .on('error', function (fileInfo, error) {
                config.$el.trigger('Upload::error', [fileInfo, error]);
            })
            .on('resizing', function (fileInfo) {
                self.addFile(fileInfo);
            });

    },
    addFile: function (fileInfo) {
        this.config.$el.trigger('Upload::start');
        var $li = $('<li data-role="img" data-id="' + fileInfo.id + '"></li>');
        var $img = $('<img>');

        $img.attr('src', this.config.defaultImg);
        $li
            .append($img)
            .addClass('loading');

        this.config.$addfile.after($li);
        this.updateCountInfo();
    },
    success: function (fileInfo){
        fileInfo = this.formatImageInfo(fileInfo);
        var $li = this.config.$images.find('[data-id="' + fileInfo.id + '"]');
        var $img = $li.find('img');

        $img.attr('src', fileInfo.thumbUrl);
        $li.removeClass('loading');

        this.saveFile(fileInfo);
    },
    onError: function (fileInfo, error) {
        var $li = this.config.$images.find('[data-id="' + fileInfo.id + '"]');
        var msg = '';
        if ($li.size()) {
            $li.remove();
        }

        switch (error.code) {
            case Uploader.ERROR_TYPE:
                msg = '文件类型错误';
                break;
            case Uploader.ERROR_MAX_SIZE:
                msg = '文件太大了';
                break;
            case Uploader.ERROR_MAX_COUNT:
                msg = '文件数量超过限制';
                break;
            case Uploader.ERROR_COMPRESS:
                msg = '图片压缩失败';
                break;
            case Uploader.ERROR_NETWORK:
                msg = '网络异常';
                break;
            case Uploader.ERROR_SERVER:
            case Uploader.ERROR_RESPONSE:
                msg = '服务器错误，请稍后再试';
                break;
            case Uploader.ERROR_TIMEOUT:
                msg = '请求超时';
                break;
            default:
                msg = '上传出错了';
        }

        BasePage.tip(msg, 1500);
    },
    reloadAddBtn: function () {
        if(this.config.$add) {
            var $input = '<input type="file" accept="image/*" data-role="uploader">';

            this.config.$add
                .find('[data-role="uploader"]')
                    .remove();

            this.config.$add
                .append($input);
        }
    },
    saveFile: function (fileInfo) {
        var $input = this.config.$input;
        var data = JSON.parse($input.val());

        data[0].push(fileInfo);

        $input.val(JSON.stringify(data));
        this.updateCountInfo();

    },
    deleteFile: function (fileInfo) {
        var id = fileInfo.id;
        var $input = this.config.$input;
        var data = JSON.parse($input.val());

        data[0] = data[0].filter(function (info) {
            if (info.id === id) {
                fileInfo = info;
                return false;
            } else {
                return true;
            }
        });

        if (!fileInfo.is_new) {
            data[1].push(fileInfo);
        }

        $input.val(JSON.stringify(data));
        this.updateCountInfo();
    },
    updateCountInfo: function () {
        var files = this.uploader.files;
        var uploadingCount = 0;
        var uploadedCount = 0;
        var total = 0;
        Object.keys(files).forEach(function (file) {
            file = files[file];
            if (file.status === Uploader.STATUS_UPLOADING) {
                uploadingCount ++;
            }

            if (file.status === Uploader.STATUS_SUCCESS) {
                uploadedCount ++;
            }
        });

        total = uploadedCount + uploadingCount;

        if(this.config.$remain) {
            this.config.$remain.text(this.config.maxCount - total);
        }

        if(this.config.$count) {
            this.config.$count.text(uploadedCount);
        }

        if(this.config.$hiddenCount) {
            this.config.$hiddenCount.text(total - 3);
        }


        if (total > 3) {
            if(this.config.$more) {
                this.config.$more.show();
            }
        } else {
            this.config.$el.removeClass('active');
            if(this.config.$more) {
                this.config.$more.hide();
            }
        }
    },
    formatImageInfo: function (info) {
        var ret = {};
        var imgInfo = parseImageUrl(info.image || info.url);

        imgInfo.width = this.config.width;
        imgInfo.height = this.config.width;
        imgInfo.flag = 'c';
        imgInfo.host = this.config.server;

        info.image_info = info.image_info || [];
        ret.id = info.id;
        ret.image = info.image || info.url;
        ret.thumbUrl = makeImageUrl(imgInfo);
        ret.width = info.width || info.image_info[0];
        ret.height = info.width || info.image_info[1];
        ret.is_new = typeof info.is_new === 'undefined' ? true : info.is_new;
        return ret;
    },
    confirm: function (imgUrl, callback) {
        var confirm = new Confirm(imgUrl);
        confirm.showPop();
        confirm
            .on('yes', function () {
                callback(true);
                confirm.hidePop();
            })
            .on('no',function(){
                callback(false);
                confirm.hidePop();
            });
    }
});

function Confirm (data) {
    var self = this;
    this.$el = $(confirmPopRender({data:data}));
    this.$el.on('click','[data-role="confirm"]',function(e){
        e.preventDefault();
        self.trigger('yes');
    })
    .on('click','[data-role="cancel"]',function(e){
        e.preventDefault();
        self.trigger('no');
    });
    this.showPop = function () {
        self.$el.appendTo('body');
    };
    this.hidePop = function () {
        self.$el.remove();
    };
}
Confirm.prototype = new EventEmitter();
Confirm.prototype.constructor = EventEmitter;

// http://image.ganji.com/gjfstmp2/M00/00/01/wKgCzFNWISyIXYD1AAGQjeuTPZkAAAAjQNsF8kAAZCl716_90-75c_6-0.jpg
function parseImageUrl (url) {
    var match =  /(https?:\/\/[\w\.]*\/)?(.*?)(_(\d*)-(\d*)(\w?)_(\d*)-(\d*))?\.(\w*)$/.exec(url);

    if (!match) {
        return {};
    }

    return {
        host: match[1],
        id  : match[2],
        width: match[4],
        height: match[5],
        flag: match[6],
        quality: match[7],
        version: match[8],
        ext: match[9]
    };
}

function makeImageUrl (config) {
    var url = '{host}{id}_{width}-{height}{flag}_{quality}-{version}.{ext}'
                .replace('{host}'   , config.host || '')
                .replace('{id}'     , config.id)
                .replace('{width}'  , config.width || '0')
                .replace('{height}' , config.height || '0')
                .replace('{flag}'   , config.flag || '')
                .replace('{quality}', config.quality || '6')
                .replace('{version}', config.version || '0')
                .replace('{ext}'    , config.ext);
    return url;
}

