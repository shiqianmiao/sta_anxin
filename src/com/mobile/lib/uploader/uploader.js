var EventEmitter = require('com/mobile/lib/event/event.js');
var UUID = require('com/mobile/lib/uuid/uuid.js');
// var $ = require('$');
var Compress = require('com/mobile/lib/uploader/photoCompress.js');

function Uploader (config) {
    var self = this;
    this.ajax_timeout = config.ajaxTimeout || 30;
    this.config = config || {};
    this.$el = config.$el;
    this.files = {};
    this.requests = {};
    this.pending = false;
    if (config.uploadedFiles) {
        config.uploadedFiles.forEach(function (fileInfo) {
            if (!fileInfo.id) {
                fileInfo.id = UUID.generateUUIDV4();
            }

            fileInfo.status = Uploader.STATUS_SUCCESS;

            self.files[fileInfo.id] = fileInfo;
        });
    }
}

Uploader.ERROR_TYPE = 1;
Uploader.ERROR_MAX_SIZE = 2;
Uploader.ERROR_MAX_COUNT = 3;
Uploader.ERROR_NETWORK = 4;
Uploader.ERROR_SERVER = 5;
Uploader.ERROR_RESPONSE = 6;
Uploader.ERROR_COMPRESS = 7;
Uploader.ERROR_TIMEOUT = 8;

Uploader.STATUS_SUCCESS = 0;
Uploader.STATUS_UPLOADING = 1;
Uploader.STATUS_ERROR = -1;
Uploader.STATUS_CANCEL = -2;
Uploader.STATUS_DELETE = -3;

Uploader.prototype = new EventEmitter();
Uploader.prototype.constructor = EventEmitter;

Uploader.prototype.validate = function (file, fileInfo) {
    var extName = getExtName(file.name.toLowerCase());
    var error = new Error();

    if (this.config.allowTypes && this.config.allowTypes.indexOf(extName) === -1) {
        error.code = Uploader.ERROR_TYPE;
        return error;
    }

    if (this.config.maxSize && file.size && file.size > this.config.maxSize) {
        error.code = Uploader.ERROR_MAX_SIZE;
        return error;
    }

    if (this.config.maxCount && Object.keys(this.files).length >= this.config.maxCount) {
        error.code = Uploader.ERROR_MAX_COUNT;
        return error;
    }else{
        this.files[fileInfo.id] = fileInfo;
    }
};

Uploader.prototype.upload = function(file) {
    var self = this;
    var fileInfo;
    var validateError = null;

    if (!this.pending) {
        fileInfo = {
            id: UUID.generateUUIDV4(),
            name: file.name
        };
        validateError = this.validate(file, fileInfo);

        if (validateError) {
            fileInfo.status = Uploader.STATUS_ERROR;
            this.trigger('error', fileInfo, validateError);
            return false;
        }
        this.trigger('resizing', fileInfo);
        this.pending = true;
        Compress.getImageData(file,{
                maxW: 1028,
                maxH: 1028
            },function (err, data) {
                self.pending = false;
                if (err) {
                    self.trigger('error', fileInfo, err);
                }else{
                    self._upload(data.base64, fileInfo);
                }
            });
    }else{
        setTimeout(function (){
            self.upload(file);
        }, 300);
    }
};

Uploader.prototype._upload = function (file, fileInfo) {
    var self = this;
    var xhr, fd, params, key;

    xhr = new XMLHttpRequest();
    fd = new FormData();
    params = this.config.params;


    for(key in params) {
        if (params.hasOwnProperty(key)) {
            fd.append(key, params[key]);
        }
    }

    fd.append('base64', file);
    fd.append('uploadDir', self.config.uploadDir);

    xhr.upload.addEventListener('progress', function (e) {
        self.trigger('progress', fileInfo, e.loaded, e.total);
    }, false);

    xhr.addEventListener('load', function (e) {
        var response, info, key, err;

        delete self.requests[fileInfo.id];
        clearTimeout(ajaxTimeout);
        try{
            response = JSON.parse(e.target.responseText);
        } catch (ex) {
            ex.code = Uploader.ERROR_SERVER;
            fileInfo.status = Uploader.STATUS_ERROR;
            self.trigger('error', fileInfo, ex);
            delete self.files[fileInfo.id];
        }

        if (response.error) {
            err = new Error(response.text);
            err.code = Uploader.ERROR_RESPONSE;
            fileInfo.status = Uploader.STATUS_ERROR;
            self.trigger('error', fileInfo, err);
            delete self.files[fileInfo.id];
        } else {
            info = response.info[0];

            for (key in info) {
                if (info.hasOwnProperty(key)) {
                    fileInfo[key] = info[key];
                }
            }
            fileInfo.status = Uploader.STATUS_SUCCESS;
            self.files[fileInfo.id] = fileInfo;

            self.trigger('success', fileInfo);
        }
    }, false);

    xhr.addEventListener('error', function () {
        fileInfo.status = Uploader.STATUS_ERROR;
        self.trigger('error', fileInfo, '网络错误(HTTP '+xhr.status+')');
        delete self.requests[fileInfo.id];
    }, false);

    this.trigger('start', fileInfo);
    xhr.open('POST', this.config.url, true);
    var ajaxTimeout   = setTimeout(function () {
        var err = new Error();
        err.code = Uploader.ERROR_TIMEOUT;
        self.trigger('error', fileInfo, err);
        self.cancel(fileInfo.id);
    }, parseInt(self.ajax_timeout, 10)*1000);
    xhr.send(fd);

    fileInfo.status = Uploader.STATUS_UPLOADING;

    this.requests[fileInfo.id] = xhr;
};

Uploader.prototype.cancel = function (id) {
    var xhr = this.requests[id];
    var fileInfo = this.files[id];
    if (!xhr) {
        return;
    }
    xhr.abort();
    fileInfo.status = Uploader.STATUS_CANCEL;
    this.trigger('cancel', fileInfo);
};

Uploader.prototype.deleteFile = function (id) {
    var fileInfo = this.files[id];
    if (this.requests[id]) {
        this.cancel(id);
    }

    if (!fileInfo) {
        return;
    }

    fileInfo.status = Uploader.STATUS_DELETE;

    delete this.files[id];
};

Uploader.prototype.getLength = function () {
    var files = this.files;
    return Object.keys(this.files)
            .filter(function (key) {
                var file = files[key];
                return file.status === Uploader.STATUS_UPLOADING || file.status === Uploader.STATUS_SUCCESS;
            })
            .length;
};

function getExtName (filepath) {
    var RE = /\.(\w*)$/;
    var match = filepath.match(RE);

    if (match) {
        return match[1];
    }

    return '';
}

return Uploader;