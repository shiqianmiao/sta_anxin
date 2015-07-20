/**
 * @desc 身份验证页面js
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('jquery');
var Base = require('app/hybrid/common/base.js');
var Util = require('com/common/util.js');
var HimgCropJquery = require('widget/HimgCrop/js/HimgCropJquery2.js');
var Qiniu = require('lib/qiniu/qiniu.js');

var Identity = exports;

Identity.IdentityForm = function(config) {
    var $el = config.$el;
    var inputId = '';
    var $showImg = '';
    var $uploadMark = $('.upload-mark');
    // 点击图片
    $el.find('.show-img').on('click', function(){
        $showImg = $(this);
        inputId = $(this).parent().find('input').attr('id');
        var abled = $(this).data('abled');
        if(abled == true){
            $uploadMark.css({top: 0});
        }else{
            showBigImg();
        }
    });


    // 点击查看大图
    $('.show-big').on('touchend', showBigImg);
    function showBigImg($img){

        var src = $showImg.attr('src');

        $('.big-pic').on('load', function(){
            $('.big-pic-wrap').show();
            $('.big-pic').cropper('replace', src);
        });
        $('.big-pic-wrap').show();
        $('.big-pic').cropper('replace', src);

    }

    // 初始化大图
    $('.big-pic').cropper({
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
    $('.close-big-pic').on('touchend', function(){
        $('.big-pic-wrap').hide();
        $uploadMark.css({top: '-100%'});
    });

    // 点击图片上传弹层的取消按钮
    $('.close-upload-win').on('touchend', function(){
        // 隐藏
        $uploadMark.css({top: '-100%'});
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
        uptoken_url: 'http://nurse.hybrid.anxin365.com/ajax/getQiniuToker/',
        domain: '7u2mgp.com2.z0.glb.qiniucdn.com',
        auto_start: true,
        init: {
            'FileUploaded': function(up, file, info) {
                // 隐藏
                $uploadMark.css({top: '-100%'});
                var domain = 'http://7u2mgp.com2.z0.glb.qiniucdn.com/';
                var key = JSON.parse(info).key;
                var src = domain + key;
                $('.srcDom').val(src);
                // 判断如果是上传头像要裁剪
                if(inputId == 'face_file'){
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
                            key += '?imageMogr2/rotate/' + rotate + '/thumbnail/' + imgWidth + 'x' + imgHeight + '!/crop/!' + cropWidth + 'x' + cropHeight + 'a' + cropOffsetLeft + 'a' + cropOffsetTop;
                            src = domain + key;
                            $('#' + inputId).val(key);
                            $('#' + inputId).parent().find('img').attr('src', src);

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

                }else{
                    $('#' + inputId).val(key);
                    $('#' + inputId).parent().find('img').attr('src', src);
                }
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = inputId;
                var timestamp = new Date().getTime();
                return key + timestamp;
            }
        }
    });

    //表单是否已经提交
    var isSubmit = false;
    $el.find('#js_finish').on('touchend', function() {
        if (!checkForm() || isSubmit) {
            return false;
        }
        isSubmit = true;
        var data= getFormData();
        $.ajax({
            type : 'post',
            url  : '/myInfo/ajaxIdentity/',
            data : data,
            dataType : 'json',
            success : function(data) {
                if (data.error == 0) {
                    window.plugins.toast.showShortCenter('信息提交成功，请耐心等待审核！', function(){}, function(){});
                    if (data.url) {
                        window.location.href = data.url;
                    }
                } else if (data.msg) {
                    window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('未知错误，请重试！', function(){}, function(){});
                }
                isSubmit = false;
            },
            error : function() {
                isSubmit = false;
            }
        });
    });

    var $faceUrl    = $('#face_file');
    var $idCardNum  = $('#id_card');
    var $cardImgUrl = $('#card_img_url');
    var $nurseCertificateNum = $('#nurse_certificate_num');
    var $nurseCertificateUrl = $('#nurse_certificate_url');
    function checkForm() {
        if ($.trim($faceUrl.val()) == "") {
            window.plugins.toast.showShortCenter('请上传头像！', function(){}, function(){});
            return false;
        }
        if ($idCardNum.length != 0) {
            if ($.trim($idCardNum.val()) == "") {
                window.plugins.toast.showShortCenter('身份证号不能为空！', function(){}, function(){});
                return false;
            }
            if (!Util.isIdCard($.trim($idCardNum.val()))) {
                window.plugins.toast.showShortCenter('身份证号不正确！', function(){}, function(){});
                return false;
            }
        }
        if ($cardImgUrl.length != 0) {
            if ($.trim($cardImgUrl.val()) == "") {
                window.plugins.toast.showShortCenter('请上传身份证图片！', function(){}, function(){});
                return false;
            }
        }

        if ($nurseCertificateNum.length != 0) {
            if ($.trim($nurseCertificateNum.val()) == "") {
                window.plugins.toast.showShortCenter('护士证编号不能为空！', function(){}, function(){});
                return false;
            }
        }

        if ($nurseCertificateUrl.length != 0) {
            if ($.trim($nurseCertificateUrl.val()) == "") {
                window.plugins.toast.showShortCenter('请上传护士证图片！', function(){}, function(){});
                return false;
            }
        }
        return true;
    }

    function getFormData() {
        var data = {};
        if ($.trim($faceUrl.val()) != $faceUrl.data('origin')) {
            data.face_url = $.trim($faceUrl.val());
        }
        if ($idCardNum.length != 0) {
            if ($.trim($idCardNum.val()) != $idCardNum.data('origin')) {
                data.id_card = $.trim($idCardNum.val());
                data.card_img_url = $.trim($cardImgUrl.val());
            }
        }
        if ($cardImgUrl.length != 0) {
            if ($.trim($cardImgUrl.val()) != $cardImgUrl.data('origin')) {
                data.id_card = $.trim($idCardNum.val());
                data.card_img_url = $.trim($cardImgUrl.val());
            }
        }

        if ($nurseCertificateNum.length != 0) {
            if ($.trim($nurseCertificateNum.val()) != $nurseCertificateNum.data('origin')) {
                data.nurse_certificate_num = $.trim($nurseCertificateNum.val());
                data.nurse_certificate_url = $.trim($nurseCertificateUrl.val());
            }
        }

        if ($nurseCertificateUrl.length != 0) {
            if ($.trim($nurseCertificateUrl.val()) != $nurseCertificateUrl.data('origin')) {
                data.nurse_certificate_num = $.trim($nurseCertificateNum.val());
                data.nurse_certificate_url = $.trim($nurseCertificateUrl.val());
            }
        }
        return data;
    }
};

Identity.start = function(param) {
    Base.init(param);
};