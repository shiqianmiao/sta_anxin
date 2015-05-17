<div class="show-mask qd-mask">
    <div class="pop-qd-wrapper"></div>
</div>
<section class="yxc-body-bg">
    <header class="yxc-brand">
        <a class="arrow-wrapper"
            data-widget="app/client/app/xiche/pub_page/widget/widget.js#link"
            data-url="app/client/app/xiche/pub_page/view/order_detail.js?id=<%= puid %>"
        >
            <i class="bt-brand-back"></i>
        </a>
        <span>选择支付方式</span>
    </header>
    <div class="content">
        <form action=""
            data-widget="app/client/app/xiche/pub_page/view/choose_payment.js#form"
        >
            <input type="hidden" name="orderId" value="<%= orderId %>">
            <input type="hidden" name="amount" value="<%= amount %>">
            <ul class="yxc-service-list">
                <% if (appId === '1001') { %>
                <li>
                    <label class="pay-type">
                        <i class="icon-yxc-pay icon-weixin"></i>微信支付
                        <input name="payType" type="radio" value="weixin" checked="checked">
                        <span class="bt-interior"></span>
                    </label>
                </li>
                <% } %>
                <% if (appId !== '1001') { %>
                <li>
                    <label class="pay-type">
                        <i class="icon-yxc-pay icon-zfb"></i>
                        支付宝钱包
                        <input name="payType" type="radio" value="alipay" checked>
                        <span class="bt-interior"></span>
                    </label>
                </li>
                <% } %>
                <% if (appId === '1002') { %>
                <li>
                    <label class="pay-type">
                        <i class="icon-yxc-pay icon-bfb"></i>
                        百度钱包支付
                        <input name="payType" type="radio" value="baidu">
                        <span class="bt-interior"></span>
                    </label>
                </li>
                <% } %>
            </ul>
            <a class="bt-sub-order" href="javascript: void(0);" data-role="submit">立即付款</a>
        </form>
    </div>
    <p class="yxc-logo"></p>
</section>