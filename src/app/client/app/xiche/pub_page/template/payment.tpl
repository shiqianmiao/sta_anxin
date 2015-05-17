<div class="show-mask qd-mask">
    <div class="pop-qd-wrapper"></div>
</div>
<section class="yxc-payment-bg">
    <div class="yxc-pay-main"
        data-widget="app/client/app/xiche/pub_page/view/payment.js#main"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
    >
        <header class="yxc-brand no-select">
            <a class="arrow-wrapper no-select" data-role="back">
                <i class="bt-brand-back"></i>
            </a>
            <span>收银台</span>
        </header>
        <div class="cashier-wrap cashier-discount no-select">
            <div class="cashier-tit">选择优惠方式</div>
            <ul class="yxc-service-list boder-top">
                <li class="js-coupon-row coupon-row <%= couponFlag ? 'active' : '' %>">
                    <% if (couponFlag) { %>
                        <div class="js-coupon js-coupon-enable"
                            style="<%= selectedDiscount === 'redPacket' ? 'display: none;' : '' %>"
                            data-role="select"
                            data-url="app/client/app/xiche/pub_page/view/pay_coupon.js"
                        >
                            <i class="icon-yxc-pay icon-discount"></i>
                            <span>优惠劵</span>
                            <% if (selectedDiscount === 'coupon') { %>
                                <div class="not-first-red">
                                    <%= couponName %>
                                    <em><%= couponPrice %></em>元
                                </div>
                            <% } else { %>
                                <b>选择要使用的优惠券</b>
                            <% } %>
                        </div>
                    <% } else { %>
                        <div class="js-coupon js-coupon-enable"
                            style="<%= selectedDiscount === 'redPacket' ? 'display: none;' : '' %>"
                        >
                            <i class="icon-yxc-pay icon-discount"></i>
                            <span>优惠劵</span>
                            <b>优惠券不能与其他优惠同时使用</b>
                        </div>
                    <% }%>
                    <div class="js-coupon js-coupon-disable"
                        style="<%= selectedDiscount === 'redPacket' ? '' : 'display: none;' %>"
                    >
                        <i class="icon-yxc-pay icon-discount"></i>
                        <span>优惠劵</span>
                        <b class="fc-red">优惠券不能与红包同时使用</b>
                    </div>
                </li>
                <li class="js-red-row red-row <%= selectedDiscount !== 'coupon' && redPacketFlag && redPackageTotalAmount > 0 ? 'active' : '' %>">
                    <div class="js-red js-red-enable"
                        style="<%= selectedDiscount === 'coupon' ? 'display: none;' : '' %>"
                    >
                        <% if (redPacketFlag && redPackageTotalAmount > 0) { %>
                            <label class="pay-type" for="pay-red"
                                data-role="redPacket"
                            >
                                <i class="icon-yxc-pay icon-red"></i>
                                <span>红包</span>
                                <div class="not-first-red">
                                    现有<em><%= redPackageTotalAmount %></em>元，
                                    可用<em class="js-red-can-use"><%= redPackageUsableAmount %></em>元
                                </div>
                                <input name="" type="checkbox" value="" id="pay-red">
                                <div id="red-packet-on-off" class="status-bt status-close">
                                    <em>关</em>
                                </div>
                            </label>
                        <% } else if (redPacketFlag && redPackageTotalAmount === 0 ) { %>
                            <i class="icon-yxc-pay icon-red"></i>
                            <span>红包</span>
                            <b>您还没有可用红包</b>
                        <% } else { %>
                            <i class="icon-yxc-pay icon-red"></i>
                            <span>红包</span>
                            <b>红包不能与其他优惠同时使用</b>
                        <% }%>
                    </div>
                    <div class="js-red js-red-disable"
                        style="<%= selectedDiscount === 'coupon' ? '' : 'display: none;' %>"
                    >
                        <i class="icon-yxc-pay icon-red"></i>
                        <span>红包</span>
                        <b class="fc-red">优惠券不能与红包同时使用</b>
                    </div>
                </li>
            </ul>
        </div>
        <div class="cashier-wrap no-select">
            <div class="cashier-tit">选择支付方式</div>
            <% if (customPayType) { %>
            <ul class="yxc-service-list boder-top">
                <li>
                    <label class="pay-type" for="pay-type1">
                        <%= customPayType %>
                    </label>
                </li>
            </ul>
            <% } else { %>
            <ul class="yxc-service-list boder-top">
                <% if (appId === '1001') { %>
                <li>
                    <label class="pay-type" for="pay-type1">
                        <i class="icon-yxc-pay icon-weixin"></i>微信支付
                        <input id="pay-type1" name="pay-type" type="radio" value="weixin" checked="checked">
                        <span class="bt-interior"></span>
                    </label>
                </li>
                <% } %>
                <% if(appId !== '1001') { %>
                <li>
                    <label class="pay-type" for="pay-type"><i class="icon-yxc-pay icon-zfb"></i>支付宝钱包
                        <input name="pay-type" id="pay-type" type="radio" value="alipay" checked><span class="bt-interior"></span>
                    </label>
                </li>
                <% } %>
                <% if (appId === '1002') { %>
                <li>
                    <label class="pay-type" for="pay-type2"><i class="icon-yxc-pay icon-bfb"></i>百度钱包支付
                        <input name="pay-type" id="pay-type2" type="radio" value="baidu"><span class="bt-interior"></span>
                    </label>
                </li>
                <% } %>
            </ul>
            <% } %>
        </div>
        <div class="cashier-wrap no-select">
            <div class="cashier-tit">结账台</div>
            <p class="cash-order-info">
                商品名称：<%= title %>
                <br>
                <em>金</em>额：<%= price %>元
            </p>
            <p data-role="discount" class="cash-order-dis">
                <% if (selectedDiscount === 'coupon') { %>
                    <em>优</em>惠：优惠券抵扣<b><%= couponPrice %></b>元
                <% } else { %>
                    <em>优</em>惠：未使用
                <% }%>
            </p>
        </div>
        <div class="total-wrap no-select">
            <a class="bt-charge" data-role="submit">立即支付</a>
            合计：<em>¥</em><span data-role="orderPrice"><%= payAmount %></span>
        </div>
    </div>
</section>
