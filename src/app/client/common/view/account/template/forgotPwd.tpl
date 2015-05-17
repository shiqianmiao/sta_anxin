<!-- section start -->
<section class="account">
    <!-- form start -->
    <form action=""
        class="js-form"
        data-disabled-submit="1"
        data-widget="app/client/common/view/account/forget_password.js#step1Form" id="step-1">
        <div class="form-widget">
            <div class="form-step">
                <div class="step-item active">1.验证手机</div>
                <div class="step-item">2.手机确认</div>
                <div class="step-item">3.密码重置</div>
            </div>
            <div class="form-tips">仅限于使用手机号注册或绑定过手机号的用户有效</div>
            <div class="form-group">
                <div class="form-field" data-role="field" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-name="phone">
                    <div class="form-item">
                        <label class="form-label">手机号码</label>
                        <div class="form-control">
                            <label class="input-group code-group">
                                <input data-role="input" name="phone" type="text" class="input-text" id="phone" placeholder="请输入手机号码" />
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>

                <div class="form-field" data-role="field" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-name="captcha">
                    <div class="form-item">
                        <label class="form-label">验&nbsp;&nbsp;证&nbsp;&nbsp;码</label>
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
                <button class="btn btn-primary btn-large js-touch-state">下一步</button>
            </div>
        </div>
    </form>
    <form action="" class="js-form hide" id="step-2"
        data-disabled-submit="1"
        data-widget="app/client/common/view/account/forget_password.js#step2Form"
        data-phone="<%= phone %>"
    >
        <div class="form-widget">
            <div class="form-step">
                <div class="step-item">1.验证手机</div>
                <div class="step-item active">2.手机确认</div>
                <div class="step-item">3.密码重置</div>
            </div>
            <div class="form-tips">您的手机号码“<span class="js-phone-text"><%= phone %></span>”验证成功！</div>
            <div class="form-opt">
                <button type="button" class="btn btn-primary btn-large js-touch-state"
                    data-role="send"
                >获取短信验证码</button>
            </div>
            <div class="form-group">
                <div class="form-field"
                    data-role="field"
                    data-name="authCode"
                    data-widget="app/client/common/view/account/widget/widget.js#inputField"
                >
                    <div class="form-item">
                        <label class="form-label">验&nbsp;&nbsp;证&nbsp;&nbsp;码</label>
                        <div class="form-control">
                            <label class="input-group">
                                <input data-role="input" name="authCode" type="text" class="input-text" placeholder="输入收到的验证码" />
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large js-touch-state">下一步</button>
            </div>
        </div>
    </form>
   <form action="" class="js-form hide" id="step-3"
        data-disabled-submit="1"
        data-widget="app/client/common/view/account/forget_password.js#step3Form">
        <div class="form-widget">
            <div class="form-step">
                <div class="step-item">1.验证手机</div>
                <div class="step-item">2.手机确认</div>
                <div class="step-item active">3.密码重置</div>
            </div>
            <div class="form-tips">您可以重新设置您的登录密码</div>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item" data-role="field" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-name="password">
                        <label class="form-label">新&nbsp;&nbsp;密&nbsp;&nbsp;码</label>
                        <div class="form-control">
                            <label class="input-group">
                                <input data-role="input" name="password" type="password" class="input-text" placeholder="6-16字符，必须数字加字母" />
                            </label>
                        </div>
                        <div class="form-warning" data-role="tipSpan"></div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item" data-role="field" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-name="rePassword">
                        <label class="form-label">确认密码</label>
                        <div class="form-control">
                            <label class="input-group">
                                <input data-role="input" name="rePassword" type="password" class="input-text" placeholder="请再次输入新密码" />
                            </label>
                        </div>
                        <div class="form-warning" data-role="tipSpan"></div>
                    </div>
                </div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large js-touch-state">下一步</button>
            </div>
        </div>
    </form>
    <!-- form end -->
</section>
<!-- section end -->
