<section>
    <header class="yxc-brand">
        <a class="arrow-wrapper"
            data-widget="app/client/app/xiche/pub_page/widget/widget#link"
            data-url="app/client/app/xiche/pub_page/view/index.js"
        >
            <i class="bt-brand-back"></i>
        </a>
        <span>联系方式</span>
    </header>
    <form action=""
        data-widget="app/client/app/xiche/pub_page/view/login.js#form"
        data-from="<%= from %>"
        data-action="<%= action %>"
    >
        <input type="hidden" name="back_url" value="<%= back_url || '' %>">
        <ul class="yxc-service-list content">
            <li>手机号码
                <input data-role="phone" name="phone" type="text" value="" class="yxc-telphone">
                <span class="bt-yxc-modify" data-role="changePhoneBtn" style="display: none;">修改</span>
                <span class="bt-verify-code" data-role="getAuthCodeBtn">获取验证码</span>
            </li>
            <li data-role="authCodeField">验&nbsp;&nbsp;证&nbsp;&nbsp;码
                <input value="" name="code" type="text" class="yxc-telphone">
            </li>
        </ul>
        <a class="bt-sub-order" href="javascript: void(0);" data-role="submit"><%= action === 'bindphone' ? '绑定手机号' : '登录' %></a>
    </form>
</section>
