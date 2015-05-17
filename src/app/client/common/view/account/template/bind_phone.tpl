<!-- section start -->
<section class="account">
    <!-- form start -->
    <form action="" data-disabled-submit="1" id="form"
        data-widget="app/client/common/view/account/bind_phone.js#form"
    >
        <input type="hidden" name="userId" value="<%= user_id %>">
        <div class="form-widget">
            <div class="form-group">
                <div class="form-field" data-role="field" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-name="phone">
                    <div class="form-item">
                        <label class="form-label">手机号码</label>
                        <div class="form-control">
                            <label class="input-group code-group">
                                <input data-role="input" name="phone" type="text" class="input-text" placeholder="请输入手机号码" />
                                <button class="btn btn-info js-touch-state"
                                    type="button"
                                    data-role="send"
                                >获取验证码</button>
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan"></div>
                </div>
                <div class="form-field" data-role="field" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-name="authCode">
                    <div class="form-item" >
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
                <button class="btn btn-primary btn-large js-touch-state">立即绑定</button>
            </div>
        </div>
    </form>
    <!-- form end -->
</section>
<!-- section end -->
