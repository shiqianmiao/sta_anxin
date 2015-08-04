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
    var $bigPicWrap = $('.big-pic-wrap');
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
    $uploadMark.find('.show-big').on('touchend', showBigImg);
    function showBigImg(){

        var src = $el.find('.head-pic').attr('src');

        $bigPicWrap.find('.big-pic').on('load', function(){
            $bigPicWrap.show();
            $bigPicWrap.find('.big-pic').cropper('replace', src);
        });
        $bigPicWrap.show();
        $bigPicWrap.find('.big-pic').cropper('replace', src);

    }

    // 初始化大图
    $bigPicWrap.find('.big-pic').cropper({
        aspectRatio: 2 / 2,
        autoCropArea: 1,
        strict: false,
        guides: false,
        autoCrop : false,
        highlight: false,
        dragCrop: false,
        cropBoxMovable: true,
        background: true, // 是否显示网格背景 true 是 false 不显示
        cropBoxResizable: true,
        guides: true
    });

    // 关闭查看大图
    $bigPicWrap.find('.close-big-pic').on('click', function(){
        $('.big-pic-wrap').hide();
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
                        $el.find('.head-pic').attr('src', src);
                        updateProfile({face_url : key}, function(data){
                            if (data.errorCode == 0) {
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
        if(type == 'signature'){
            title = '签名';
        } else if(type == 'introduction'){
            title = '简介';
        }
        $page2.find('.textarea-con').val('');
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
