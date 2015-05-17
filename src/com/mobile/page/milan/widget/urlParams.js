function UrlParams() {}

UrlParams.prototype.getUrlParams = function(paramName) {
    var sUrl = location.href;
    var sReg = '(?:\\?|&){1}' + paramName + '=([^&]*)';
    var re = new RegExp(sReg, 'gi');
    var position = re.exec(sUrl);
    if (null === position) {
        return '';
    }
    return RegExp.$1;
};
UrlParams.prototype.getUrlParamsByJH = function() {
    var sUrl = location.href;
    var sReg = '(?:\\#){1}([^\\?|&]*)';
    var re = new RegExp(sReg, 'gi');
    var position = re.exec(sUrl);
    if (null === position) {
        return '';
    }
    return RegExp.$1;
};
return new UrlParams();