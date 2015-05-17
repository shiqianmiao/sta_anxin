<section class="yxc-payment-bg pad-bot-comm">
    <div class="yxc-pay-main"
        data-widget="app/client/app/xiche/pub_page/view/pay_coupon.js#couponList"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
        data-back-url="app/client/app/xiche/pub_page/view/payment.js"
    >
        <header class="yxc-brand" data-role="back">
            <a class="arrow-wrapper">
                <i class="bt-brand-back"></i>
            </a>
            优惠劵
        </header>
        <ul class="yxc-service-list boder-top service-list not-use-coupon"
            data-role="select"
            data-coupon-puid=""
            data-coupon-name=""
            data-coupon-price=""
        >
            <li>
                <label class="pay-type" for="not-use-coupon">
                    <div class="service-intro">
                        <h3>不使用优惠劵</h3> 温馨提示：优惠劵和红包不能同时使用
                    </div>
                    <input name="pay-type" id="not-use-coupon" type="checkbox" value="">
                    <span class="bt-interior"></span>
                </label>
            </li>
        </ul>
        <div data-role="list">
        <% data.list.forEach(function (coupon, index) { %>
            <% if (coupon.special_status === '4' ) { return } %>
            <div class="coupon-comm coupon-not-use <% if (params.couponPuid && index === 0) {%> active<% } %>"
                data-role="select"
                data-coupon-puid="<%= coupon.special_puid %>"
                data-coupon-name="<%= coupon.special_name %>"
                data-coupon-price="<%= coupon.special_price %>"
            >
                <label for="coupon-lem<%= index %>" class="pay-type">
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
                    <input type="checkbox" id="coupon-lem<%= index %>" name="coupon-lem1" value="" checked="">
                    <span class="bt-interior"></span>
                </label>
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
