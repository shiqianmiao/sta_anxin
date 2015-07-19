/**
 * @desc 身份验证页面js
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('jquery');
var Base = require('app/hybrid/common/base.js');
var HimgCropJquery = require('widget/HimgCrop/js/HimgCropJquery2.js');
var Qiniu = require('lib/qiniu/qiniu.js');
var Hselect = require('widget/Hselect/js/Hselect.js');

var Extend = exports;

Extend.start = function(config) {
    $('.select-department').click(function(){
        $(this).find('img').addClass('se-img-rotate');
        var hse = new Hselect({
            title : '选择科室',
            selectTplId : 'department-box',
            defaultSelect : 0,	// 默认初始选项
            completeFn : function($elem){
                $('.select-department em').html($elem.html());
                $('.select-department img').removeClass('se-img-rotate');
                $('#hospital_depart').val($elem.data('value'));
            }
        });
    });

    $('.select-position').click(function(){
        $(this).find('img').addClass('se-img-rotate');
        var hse = new Hselect({
            title : '选择职称',
            selectTplId : 'position-box',
            defaultSelect : 0,	// 默认初始选项
            completeFn : function($elem){
                $('.select-position em').html($elem.html());
                $('.select-position img').removeClass('se-img-rotate');
                $('#work_title').val($elem.data('value'));
            }
        });
    });


    // 点击叉叉移除证书
    $('.remove-cert').on('click', removeCert);
    function removeCert(){
        $(this).parent().detach();
    }

    // 点击证书图片 查看大图
    $('.zs-img').on('click', showBigImg);
    function showBigImg(){

        var src = $(this).attr('src');

        $('.big-pic').on('load', function(){
            $('.big-pic-wrap').show();
            $('.big-pic').cropper('replace', src);
        });
        $('.big-pic-wrap').show();
        $('.big-pic').cropper('replace', src);

    }
    // 关闭查看大图
    $('.close-big-pic').on('click', function(){
        $('.big-pic-wrap').hide();
    });
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

    // 点击时间选择
    $('#month-input').on('change', function(){
        var dataStr = $(this).val();
        var dataArr = dataStr.split('-');
        if (dataArr[0] > 0 && dataArr[1] > 0) {
            var showStr = dataArr[0] + '年' + dataArr[1] + '月';
            var timeStr = dataArr[0] + '/'+ dataArr[1] + '/' + '01';
            var timestamp = new Date(timeStr).getTime() / 1000;
            $('#service_time').val(timestamp);
            $('.select-time em').html(showStr);
        }
    });

    // 隐藏选择组件
    $(document).on('touchend', function(){
        $('#H-wrap-box').detach();
        $('.select-hospital img').removeClass('se-img-rotate');
        $('.select-position img').removeClass('se-img-rotate');
    });

    // 点击添加证书
    $('#add-zs').click(function(){
        showCertItems();
        var hse = new Hselect({
            title : '请选择其他专项证书',
            selectTplId : 'zs-box',
            defaultSelect : 0,	// 默认初始选项
            initFn : function($Hwrapbox){
                $Hwrapbox.find('.H-head').attr('id', 'container');
                $Hwrapbox.find('.H-complete').attr('id', 'add-zs-btn');
                $('#H-list .H-effective').eq(0).addClass('select-true');
                var uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',
                    browse_button: 'add-zs-btn',
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
                            // 获取证书类型名称
                            var zsTypeName = $('#H-list .select-true').html();
                            var zsTypeValue = $('#H-list .select-true').data('value');
                            // 移除select组件
                            $Hwrapbox.detach();
                            var key = JSON.parse(info).key;
                            var src = 'http://7u2mgp.com2.z0.glb.qiniucdn.com/' + key;
                            // 创建证书DOM
                            // <li class="per-cert">
                            // 	<h3>资格证书</h3>
                            // 	<img src="imgs/a.jpg" class="zs-img" />
                            // 	<span class="remove-cert"></span>
                            // </li>
                            var oLi = document.createElement('li');
                            oLi.setAttribute ( 'data-id', zsTypeValue) ;
                            oLi.setAttribute ( 'data-img', key) ;

                            oLi.className = 'per-cert';
                            var oH3 = document.createElement('h3');
                            oH3.innerHTML = zsTypeName;
                            var oImg = document.createElement('img');
                            oImg.src = src;
                            oImg.src = src;
                            oImg.onclick = showBigImg;
                            var oSpanClose = document.createElement('span');
                            oSpanClose.className = 'remove-cert';
                            oSpanClose.onclick = removeCert;

                            oLi.appendChild(oH3);
                            oLi.appendChild(oImg);
                            oLi.appendChild(oSpanClose);

                            $('.certificate').append($(oLi));
                        },
                        'Key': function(up, file) {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                            var key = 'other-cert';
                            var timestamp = new Date().getTime();
                            return key + '-' +  timestamp;
                        }
                    }
                });

            }

        });

    });

    //显示当前可以添加的证书选项，已经添加的证书会被隐藏
    function showCertItems() {
        var addArr = [];
        $('.certificate li').each(function(){
            addArr.push($(this).data('id'));
        });
        $('#zs-box').find('li').each(function(){
            var $this = $(this);
            var value = $this.data('value');
            if (addArr.indexOf(value) >= 0) {
                $this.hide();
            } else {
                $this.show();
            }
        });
    }

    //表单是否已经提交
    var isSubmit = false;
    $('#js_finish').on('touchend', function() {
        if (!checkForm() || isSubmit) {
            return false;
        }
        isSubmit = true;
        var data= getFormData();
        $.ajax({
            type : 'post',
            url  : '/myInfo/ajaxExtend/',
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

    function checkForm() {
        var $serviceTime = $('#service_time');
        var $school = $('#school');
        var $hospital = $('#work_hospital');
        var $department = $('#hospital_depart');
        var $workTitle = $('#work_title');
        if (!($.trim($serviceTime.val()) > 0)) {
            window.plugins.toast.showShortCenter('请选择从业时间！', function(){}, function(){});
            return false;
        }
        if ($.trim($school.val()) == "") {
            window.plugins.toast.showShortCenter('请输入毕业院校！', function(){}, function(){});
            return false;
        }
        if ($.trim($hospital.val()) == "") {
            window.plugins.toast.showShortCenter('请输入就职医院！', function(){}, function(){});
            return false;
        }
        if ($.trim($department.val()) == "") {
            window.plugins.toast.showShortCenter('请选择所在科室！', function(){}, function(){});
            return false;
        }
        if ($.trim($workTitle.val()) == "") {
            window.plugins.toast.showShortCenter('请选择职称！', function(){}, function(){});
            return false;
        }
        return true;
    }

    function getFormData() {
        var data = {};
        var $serviceTime = $('#service_time');
        var $school = $('#school');
        var $hospital = $('#work_hospital');
        var $department = $('#hospital_depart');
        var $workTitle = $('#work_title');
        if ($.trim($serviceTime.val()) != $serviceTime.data('origin')) {
            data.service_time = $.trim($serviceTime.val());
        }
        if ($.trim($school.val()) != $school.data('origin')) {
            data.school = $.trim($school.val());
        }
        if ($.trim($hospital.val()) != $hospital.data('origin')) {
            data.work_hospital = $.trim($hospital.val());
        }
        if ($.trim($department.val()) != $department.data('origin')) {
            data.hospital_depart = $.trim($department.val());
        }
        if ($.trim($workTitle.val()) != $workTitle.data('origin')) {
            data.work_title = $.trim($workTitle.val());
        }
        var other_cert = [];
        if ($('.certificate li').not(".js_pass").length > 0) {
            $('.certificate li').not(".js_pass").each(function(index) {
                var item = {};
                item.id = $(this).data('id');
                item.img = $(this).data('img');
                other_cert.push(item);
            });
        }
        data.other_cert = JSON.stringify(other_cert);
        return data;
    }
};