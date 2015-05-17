<!-- section start -->
<section>
    <!-- form start -->
    <form action="" id="form"
        data-disabled-submit="1"
        data-widget="app/client/common/view/account/register.js#form"
    >
        <div class="form-widget">
            <div class="form-group">
                <div class="form-field"
                    data-widget="app/client/common/view/account/widget/widget.js#inputField"
                    data-role="field"
                    data-name="phone"
                >
                    <div class="form-item" >
                        <label class="form-label">手机号码</label>
                        <div class="form-control">
                            <label class="input-group code-group">
                                <input data-role="input" name="phone" type="text" class="input-text" placeholder="请输入手机号码" />
                                <button class="btn btn-info js-touch-state" disabled
                                    type="button"
                                    data-role="send">获取验证码</button>
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>
                <div class="form-field"
                    data-widget="app/client/common/view/account/widget/widget.js#inputField"
                    data-role="field"
                    data-name="authCode"
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
                <div class="form-field"
                    data-role="field"
                    data-widget="app/client/common/view/account/widget/widget.js#inputField"
                    data-name="password"
                >
                    <div class="form-item">
                        <label class="form-label">密　　码</label>
                        <div class="form-control">
                            <label class="input-group">
                                <input data-role="input" name="password" type="password" class="input-text" placeholder="6-16字符，必须数字加字母" />
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>
                <div class="form-field"
                    data-widget="app/client/common/view/account/widget/widget.js#inputField"
                    data-role="field"
                    data-name="rePassword"
                >
                    <div class="form-item">
                        <label class="form-label">确认密码</label>
                        <div class="form-control">
                            <label class="input-group">
                                <input data-role="input" name="rePassword" type="password" class="input-text" placeholder="再次输入密码" />
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large js-touch-state">立即注册</button>
            </div>
        </div>
    </form>
    <div id="validatorConfig"></div>
    <!-- form end -->
</section>
<!-- section end -->
