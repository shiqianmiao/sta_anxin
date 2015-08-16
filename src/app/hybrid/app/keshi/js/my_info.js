/**
 * @desc 问答页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-07-23
 */
// dependences
var $ = require('jquery');
var Base = require('app/hybrid/common/base.js');
var Widget = require('com/mobile/lib/widget/widget.js');

var HimgCropJquery = require('widget/HimgCrop/js/HimgCropJquery2.js');
var Qiniu = require('lib/qiniu/qiniu.js');
var MyInfo = exports;

MyInfo.updateFacePhoto = function(config) {
    var $el = config.$el;
    var $uploadMark = $('.upload-mark');
    var $bigPicWrap = $('.big-pic-mark');
    var token = $el.data('token');
    // 点击头像
    $el.on('click', function(){
        $uploadMark.css({top: 0});
    });
    // 点击图片上传弹层的取消按钮
    $uploadMark.find('.close-upload-win').on('touchend', function(){
        // 隐藏
        $uploadMark.css({top: '-100%'});
    });
    // 点击查看大图
    $uploadMark.find('.show-big').on('click', showBigImg);
    function showBigImg(){
        var src = $bigPicWrap.find('img').data('big');
        $bigPicWrap.find('img').attr('src', src);
        $bigPicWrap.removeClass('window-hide');
        $uploadMark.css({top: '-100%'});
    }

    // 关闭查看大图
    $bigPicWrap.find('.close-big-pic').on('click', function(){
        $('.big-pic-wrap').hide();
    });
    $bigPicWrap.on('click', function(){
        $(this).addClass('window-hide');
    });

    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '100mb',
        flash_swf_url: 'js/plupload/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        //uptoken_url: 'http://192.168.2.107/test/qiniu/demo/views/a.php',
        uptoken: token,
        domain: '7u2mgp.com2.z0.glb.qiniucdn.com',
        auto_start: true,
        init: {
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = 'face_file';
                var timestamp = new Date().getTime();
                return key + timestamp;
            },
            'FileUploaded': function(up, file, info) {

                // 隐藏
                $uploadMark.css({top: '-100%'});

                var key = JSON.parse(info).key;
                var qnDomain = 'http://7u2mgp.com2.z0.glb.qiniucdn.com/';
                var src = qnDomain + key;
                $('.srcDom').val(src);
                // 裁剪
                var HimgCropJquery1 = new HimgCropJquery({
                    srcDom: $('.srcDom'),
                    rotateIngEvent : 'touchend',
                    callback : function(canvasDom, data){

                        // 图片的缩放宽高
                        var imgWidth = Math.round(data.canvasData.width);
                        var imgHeight = Math.round(data.canvasData.height);
                        // 裁剪是的宽高
                        var cropWidth = Math.round(data.CropBoxData.width);
                        var cropHeight = Math.round(data.CropBoxData.height);
                        // 裁剪是的偏移
                        var cropOffsetLeft = Math.round(data.CropBoxData.left) - Math.round(data.canvasData.left);
                        var cropOffsetTop = Math.round(data.CropBoxData.top) - Math.round(data.canvasData.top);
                        // 旋转的角度
                        var rotate = data.imageData.rotate;

                        // 拼接七牛裁剪连接,注意裁剪顺序，先旋转
                        key = key + '?imageMogr2/rotate/' + rotate + '/thumbnail/' + imgWidth + 'x' + imgHeight + '!/crop/!' + cropWidth + 'x' + cropHeight + 'a' + cropOffsetLeft + 'a' + cropOffsetTop;
                        src = qnDomain + key;
                        updateProfile({face_url : key}, function(data){
                            if (data.errorCode == 0) {
                                $el.find('.head-pic').attr('src', src);
                                $('.big-pic-mark img').data('big', data.data.face_url);
                                $('.head-info .audit').html('待审核');
                                window.plugins.toast.showShortCenter('上传成功！', function(){}, function(){});
                            } else if(data.errorMessage) {
                                window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                            }
                        });
                    },
                    cropperSetting : {
                        aspectRatio: 2 / 2,
                        autoCropArea: 0.65,
                        strict: true,
                        guides: false,
                        highlight: false,
                        dragCrop: false,
                        cropBoxMovable: true,
                        background: true, // 是否显示网格背景 true 是 false 不显示
                        cropBoxResizable: true,
                        guides: true
                    }
                });

            }
        }
    });
};

MyInfo.updateTitle = function(config) {
    var $el = config.$el;
    var $pageTitle = $('.page3');
    // 点击职称选择按钮
    $el.on('click', function(){
        $pageTitle.show().removeClass('pt-page-scaleUpCenter-hide').addClass('pt-page-scaleUpCenter');
    });
    // 点选职称
    $pageTitle.find('.p3-per-list').on('click', function(){
        var $this = $(this);
        var value = $(this).data('value');
        updateProfile({work_title : value}, function(data){
            if (data.errorCode == 0) {
                var selectPos = $this.find('em').html();
                $el.find('.position-name').html(selectPos);
                $pageTitle.find('.radio-status').removeClass('active');
                $this.find('.radio-status').addClass('active');

                $pageTitle.removeClass('pt-page-scaleUpCenter').addClass('pt-page-scaleUpCenter-hide');
                setTimeout(function(){
                    $pageTitle.hide();
                }, 400);
                window.plugins.toast.showShortCenter('更新成功！', function(){}, function(){});
            } else if(data.errorMessage) {
                window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
            }
        });
    });
    $pageTitle.find('.header-return').on('click', function(){
        $pageTitle.removeClass('pt-page-scaleUpCenter').addClass('pt-page-scaleUpCenter-hide');
        setTimeout(function(){
            $pageTitle.hide();
        }, 400);
    });
};

MyInfo.updateDesc = function(config) {
    var $el = config.$el;
    var $page2 = $('.page2');
    // 点击签名或者简介的时候
    $el.find('li').on('click', function(){
        var type = $(this).data('type'),title = '';
        var originContent = '';
        if(type == 'signature'){
            title = '签名';
            originContent = $el.find('.signature-span').html();

        } else if(type == 'introduction'){
            title = '简介';
            originContent = $el.find('.introduction-span').html();
        }
        $page2.find('.textarea-con').val(originContent);
        $page2.find('.page2-title').html(title);
        $page2.data('type', type);
        $page2.show().removeClass('pt-page-scaleUpCenter-hide').addClass('pt-page-scaleUpCenter');
    });

    // 点击保存的时候
    $page2.find('.page2-save').on('click', function(){
        var content = $.trim($page2.find('.textarea-con').val());
        var params = {};
        if($page2.data('type') == 'signature'){
            params = {motto : content};
        }else if($('.page2').data('type') == 'introduction'){
            params = {description : content};
        }
        updateProfile(params, function(data){
            if (data.errorCode == 0) {
                $page2.removeClass('pt-page-scaleUpCenter').addClass('pt-page-scaleUpCenter-hide');
                setTimeout(function(){
                    $page2.hide();
                }, 400);
                if($page2.data('type') == 'signature'){
                    $el.find('.signature-span').html(content);
                }else if($('.page2').data('type') == 'introduction'){
                    $el.find('.introduction-span').html(content);
                }
                window.plugins.toast.showShortCenter('更新成功！', function(){}, function(){});
            } else if(data.errorMessage) {
                window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
            }
        });
    });

    // 点击page2的返回按钮
    $page2.find('.page2-return').on('click', function(){
        $page2.removeClass('pt-page-scaleUpCenter').addClass('pt-page-scaleUpCenter-hide');
        setTimeout(function(){
            $page2.hide();
        }, 400);
    });

    // 统计还可以输入字符数量
    setInterval(function(){
        var curLength = $page2.find('.textarea-con').val().length;
        var allLength = 120;
        var remainLength = allLength - curLength;
        $page2.find('.cur-length').html(curLength);
    }, 20);
};

MyInfo.updateSex = function(config) {
    var $el = config.$el;
    // 点选性别
    $el.find('#sex-select-input').on('change', function() {
        var sex = $(this).val();
        var sexText = $el.find("option:selected").text();
        updateProfile({sex: sex}, function (data) {
            if (data.errorCode == 0) {
                $el.find('.sex').html(sexText);
                window.plugins.toast.showShortCenter('更新成功！', function () {}, function () {});
            } else if (data.errorMessage) {
                window.plugins.toast.showShortCenter(data.errorMessage, function () {}, function () {});
            }
        });
    });
};

MyInfo.updateIosBirthday = function(config) {
    var $el = config.$el;
    // 点击时间选择
    var showStr = '';
    var timestamp = 0;
    var origin = $el.data('origin');
    $el.find('#data-select-input').on('change', function(){
        var dataStr = $(this).val();
        var dataArr = dataStr.split('-');
        if (dataArr[0] > 0 && dataArr[1] > 0 && dataArr[2] > 0) {
            showStr = dataArr[0] + '-' + dataArr[1] + '-' + dataArr[2];
            var timeStr = dataArr[0] + '/'+ dataArr[1] + '/' + dataArr[2];
            timestamp = new Date(timeStr).getTime() / 1000;
        }
    });
    $el.find('#data-select-input').on('blur', function(){
        if (origin != timestamp && timestamp != 0) {
            updateProfile({birthday: timestamp}, function (data) {
                if (data.errorCode == 0) {
                    $el.find('.data').html(showStr);
                    window.plugins.toast.showShortCenter('更新成功！', function () {}, function () {});
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function () {}, function () {});
                }
            });
        }
    });
};

MyInfo.updateArdBirthday = function(config) {
    var $el = config.$el;
    // 点击时间选择
    var timestamp = 0;
    $el.tap(function(){
        event.stopPropagation();
        var defaultDate = $el.data('default');
        defaultDate = new Date (defaultDate);
        window.plugins.datePicker.show({
            date : defaultDate,
            mode : 'date',
            minDate: 0,
            maxDate: 0,
            androidTheme : window.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }, function(returnDate) {
            var date = returnDate.getFullYear() + '-' + formatDate(returnDate.getMonth() + 1) + '-' + formatDate(returnDate.getDate());
            timestamp = new Date(date).getTime() / 1000;
            updateProfile({birthday: timestamp}, function (data) {
                if (data.errorCode == 0) {
                    $el.find('.data').html(date);
                    $el.data('default', date);
                    window.plugins.toast.showShortCenter('更新成功！', function () {}, function () {});
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function () {}, function () {});
                }
            });
        });
    });
    function formatDate(d) {
        var D=['00','01','02','03','04','05','06','07','08','09'];
        d = parseInt(d);
        if (d < 10) {
            return D[d];
        } else {
            return d;
        }
    }
};

var updateProfile = function(data, success, error) {
    $.ajax({
        type : 'post',
        url  : '/my/ajaxUpdate/',
        data : data,
        dataType : 'json',
        success : function(data) {
            success(data);
        },
        error : function(data) {
            error(data);
        }
    });
};

//页面初始化函数
MyInfo.start = function(param) {
    Base.init(param);
};
