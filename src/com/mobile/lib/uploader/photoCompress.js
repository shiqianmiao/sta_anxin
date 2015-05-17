var $ = require('$');
var JpegMeta = require('com/mobile/lib/uploader/jpegMeta.js');
var JPEGEncoder = require('com/mobile/lib/uploader/jpegEncode.js');
var ImageCompresser = {
        isIOSSubSample: function(img) {
            var w = img.naturalWidth;
            var h = img.naturalHeight;
            var hasSubSample = false;
            if (w * h > 1024 * 1024) {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = canvas.height = 1;
                ctx.drawImage(img, -w + 1, 0);
                hasSubSample = (ctx.getImageData(0, 0, 1, 1).data[3] === 0);
                canvas = ctx = null;
            }
            return hasSubSample;
        },
        getIOSImageRatio: function(img, w, h) {
            /**
             * Detecting vertical squash in loaded image.
             * Fixes a bug which squash image vertically while drawing into canvas for some images.
             * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
             * 
             */
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = 1;
            canvas.height = h;
            ctx.drawImage(img, 0, 0);
            var data = ctx.getImageData(0, 0, 1, h).data;
            var sy = 0;
            var ey = h;
            var py = h;
            while (py > sy) {
                var alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0){
                    ey = py;
                }
                else{
                    sy = py;
                }
            /* jshint ignore:start */
                py = ey + sy >> 1;
            /* jshint ignore:end */
            }
            return py / h;
        },
        transformCT: function(canvas, width, height, orientation) {
            var ctx = canvas.getContext('2d');
            if (orientation >= 5 && orientation <= 8) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }
            switch (orientation) {
                case 2:
                    ctx.translate(width, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    ctx.translate(width, height);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    ctx.translate(0, height);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(0, -height);
                    break;
                case 7:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(width, -height);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-width, 0);
                    break;
                default:
                    break;
            }
        },
        acfix: function (natural, max) {
            var naturalWidth  = natural.width;
            var naturalHeight = natural.height;
            var maxW          = max.width;
            var maxH          = max.height;
            var width, height;
            if (naturalWidth > maxW && naturalWidth / naturalHeight >= maxW / maxH) {
                width = maxW;
                height = naturalHeight * maxW / naturalWidth;
            } else if (naturalHeight > maxH && naturalHeight / naturalWidth >= maxH / maxW) {
                width = naturalWidth * maxH / naturalHeight;
                height = maxH;
            } else {
                width = naturalWidth;
                height = naturalHeight;
            }
            return {width: width,height: height};
        },
        getImageBase64: function (img,param) {
            param = $.extend({maxW: 800,maxH: 800,quality: 0.85,orien: 1}, param);
            var naturalW = img.naturalWidth;
            var naturalH = img.naturalHeight;
            if (($.os.iphone || $.os.ipad || $.os.ipod) && ImageCompresser.isIOSSubSample(img)) {
                naturalW = naturalW / 2;
                naturalH = naturalH / 2;
            }
            var maxH   = param.maxH, maxW = param.maxW;
            var orienW = naturalW, orienH = naturalH;
            if (param.orien >= 5 && param.orien <= 8) {
                orienW = naturalH;
                orienH = naturalW;
            }
            if (orienW > orienH) {
                maxH = maxH + maxW;
                maxW = maxH - maxW;
                maxH = maxH - maxW;
            }
            var orienFix  = this.acfix({width: orienW,height: orienH}, {width: maxW, height: maxH});
            var orienFixW = orienFix.width;
            var orienFixH = orienFix.height;
            var naturalFixW = orienFixW;
            var naturalFixH = orienFixH;
            if (param.orien >= 5 && param.orien <= 8) {
                naturalFixH = orienFixW;
                naturalFixW = orienFixH;
            }
            var canvas = document.createElement('canvas');
            var ctx    = canvas.getContext('2d');
            this.transformCT(canvas, naturalFixW, naturalFixH, param.orien);
            if ($.os.iphone || $.os.ipod || $.os.ipad) {
                var tmpCanvas = document.createElement('canvas');
                var tmpCtx    = tmpCanvas.getContext('2d');
                var d = 1024;
                tmpCanvas.width = tmpCanvas.height = d;
                var vertSquashRatio = ImageCompresser.getIOSImageRatio(img, naturalW, naturalH);
                var sy = 0;
                while (sy < naturalH) {
                    var sh;
                    if (sy + d > naturalH){
                        sh = naturalH - sy;
                    }
                    else{
                        sh = d;
                    }
                    var sx = 0;
                    while (sx < naturalW) {
                        var sw;
                        if (sx + d > naturalW){
                            sw = naturalW - sx;
                        }
                        else{
                            sw = d;
                        }
                        tmpCtx.clearRect(0, 0, d, d);
                        tmpCtx.drawImage(img, -sx, -sy);
                        var dx = Math.floor(sx * naturalFixW / naturalW);
                        var dw = Math.ceil(sw * naturalFixW / naturalW);
                        var dy = Math.floor(sy * naturalFixH / naturalH / vertSquashRatio);
                        var dh = Math.ceil(sh * naturalFixH / naturalH / vertSquashRatio);
                        ctx.drawImage(tmpCanvas, 0, 0, sw, sh, dx, dy,dw, dh);
                        sx += d;
                    }
                    sy += d;
                }
                tmpCanvas = tmpCtx = null;
            } else{
                ctx.drawImage(img, 0, 0, naturalW, naturalH, 0, 0, naturalFixW, naturalFixH);
            }
            var base64Str;
            if ($.os.android) {
                var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var encoder = new JPEGEncoder(param.quality * 100);
                base64Str = encoder.encode(imgData);
                encoder = null;
            } else{
                base64Str = canvas.toDataURL('image/jpeg', param.quality);
            }
            canvas = ctx = null;
            return {base64: base64Str,height: orienFixH,width: orienFixW};
        }
    };
function compress(dataUrl, param, callback) {
        var img = new Image();
        img.onload =
        function() {
            var result = ImageCompresser.getImageBase64(this, param);
            var data = $.extend({}, {param: param});
            data.dataUrl = dataUrl;
            data.base64 = result.base64;
            data.width = result.width;
            data.height = result.height;
            data.rawWidth = img.naturalWidth;
            data.rawHeight = img.naturalHeight;
            callback(null, data);
        };
        img.onerror = function() {
            callback(new Error('\u56fe\u7247\u65e0\u6cd5\u89e3\u6790'), null);
        };
        img.src = dataUrl;
    }
function getImageMeta(file, callback) {
        var r = new FileReader();
        var err = null;
        var meta = null;
        r.onload = function(event) {
            if (file.type === 'image/jpeg'){
                try {
                    meta = new JpegMeta.JpegFile(event.target.result, file.name);
                } catch (ex) {
                    err = ex;
                }
            }
            callback(err, meta);
        };
        r.onerror = function(event) {
            callback(event.target.error, meta);
        };
        r.readAsBinaryString(file);
    }
function getURLObject() {
        if ($.browser.uc && $.browser.version === '8.4'){
            return false;
        }
        return window.URL || window.webkitURL || window.mozURL;
    }
function getImageURL(file, callback) {
        var url = getURLObject();
        if (url){
            callback(null, url.createObjectURL(file));
        }
        else {
            var r = new FileReader();
            r.onload = function(event) {
                callback(null,
                event.target.result);
            };
            r.onerror = function(event) {
                callback(event.target.error, null);
            };
            r.readAsDataURL(file);
        }
    }
function getImageData(file, picParam, callback) {
        if (!file){
            return;
        }
        var param = $.extend({}, picParam);
        getImageURL(file, function(err, dataUrl) {
            if (err){
                callback(new Error('\u62ff\u4e0d\u5230URL'), null);
            }
            else{
                getImageMeta(file, function(err, meta) {
                    if (meta && meta.tiff && meta.tiff.Orientation){
                        param = $.extend({orien: meta.tiff.Orientation.value,make: meta.tiff.Make && meta.tiff.Make.value,model: meta.tiff.Model && meta.tiff.Model.value,
                            date: meta.tiff.DateTime && meta.tiff.DateTime.value}, param);
                    }
                    file = null;
                    compress(dataUrl, param, callback);
                });
            }
        });
    }

return {getImageData: getImageData, getImageMeta: getImageMeta};