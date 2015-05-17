<!-- section start -->
<section class="account login">
    <!-- form start -->
    <form action=""
        id="form"
        data-disabled-submit="1"
        data-widget="app/client/common/view/account/login.js#form">
        <div class="form-widget">
            <div class="form-group">
                <div class="form-field" data-role="field" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-name="username">
                    <div class="form-item">
                        <label class="form-label"><i class="icon icon-user">账号</i></label>
                        <div class="form-control">
                            <label class="input-group">
                                <input data-role="input" name="username" type="text" class="input-text" class="username" placeholder="用户名/手机号" value="" />
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>
                <div class="form-field" data-role="field" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-name="password">
                    <div class="form-item">
                        <label class="form-label"><i class="icon icon-lock">密码</i></label>
                        <div class="form-control">
                            <label class="input-group">
                                <input data-role="input" name="password" type="password" class="input-text" placeholder="输入您的密码" value="" />
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>
                <div class="form-field" data-role="field" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-name="captcha">
                    <div class="form-item">
                        <div class="form-control">
                            <label class="input-group">
                                <input data-role="input" name="captcha" type="text" class="input-text" placeholder="输入下方的验证码" />
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>
                <div class="pic-code-group" data-role="captcha">
                    <img alt="">
                    <a href="javascript: void(0);" class="refresh">看不清，换一张</a>
                </div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large js-touch-state" data-role="login">登录</button>
            </div>
        </div>
    </form>

    <div class="form-text">
        <a href="javascript: void(0);" class="fl"
            data-widget="app/client/common/view/account/widget/widget.js#link"
            data-url="app/client/common/view/account/register.js?<%= back_url %>">注册</a>
        <a href="javascript:;" class="fr" data-role="toUrl"
            data-widget="app/client/common/view/account/widget/widget.js#link"
            data-url="app/client/common/view/account/forget_password.js?<%= back_url %>">忘记密码？</a>
    </div>
    <!-- form end -->
</section>
<!-- section end -->
