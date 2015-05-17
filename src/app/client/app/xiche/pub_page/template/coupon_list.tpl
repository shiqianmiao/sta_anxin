<section class="yxc-payment-bg pad-bot-comm">
    <div class="yxc-pay-main" data-widget="app/client/app/xiche/pub_page/view/coupon_list.js#couponList">
        <header class="yxc-brand">
            <a class="arrow-wrapper"
                data-widget="app/client/app/xiche/pub_page/widget/widget#link"
                data-url="app/client/app/xiche/pub_page/view/profile.js"
            >
                <i class="bt-brand-back"></i>
            </a>
            <span>优惠券</span>
        </header>
        <div class="red-num border-none">
            <div class="red-intro">
                <a href="javascript:;"
                    data-widget="app/client/app/xiche/pub_page/widget/widget#link"
                    data-url="app/client/app/xiche/pub_page/view/coupon_instructions.js"
                >使用说明</a>
            </div>
            <em>¥</em>
            <span data-role="totalPrice"><%= total_special %></span>
            <p>您可在下单过程选择要使用的红包</p>
        </div>
        <form action="" method="get" class="fm-center-coupon">
            <input name="" type="text" placeholder="输入优惠劵兑换码" value="" class="inpt-center-coupon" data-role="input">
            <button type="button" class="bt-center-exc" data-role="redeemBtn">兑换</button>
        </form>
        <div data-role="list">
        <% list.forEach(function (coupon) { %>
            <% if (coupon.special_status==='4' ) { return } %>
            <div class="coupon-comm<% if (coupon.special_status === '3'){%> active<% } %>">
                <div class="coupon-left">
                    <em>¥</em>
                    <%= coupon.special_price %>
                </div>
                <div class="coupon-right">
                    <h3>优惠券</h3>
                    <p><%= coupon.special_summary %></p>
                    <p>
                        <%= coupon.expires_time_text %>
                    </p>
                    <p class="coupon-spe">
                        <%= coupon.activity_name %>
                    </p>
                </div>
            </div>
        <% }) %>
        </div>
    </div>
    <div class="car-info-fixed">
        <em>©赶集易洗车2015</em>
        <span>客服电话：<a href="tel:4007335500" class="bt-telphone">4007-335-500</a>
        </span>
    </div>
</section>
