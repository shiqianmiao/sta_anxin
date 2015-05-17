<section class="yxc-payment-bg">
    <div class="yxc-pay-main"
        data-widget="app/client/app/xiche/pub_page/widget/widget.js#list"
        data-back-url="app/client/app/xiche/pub_page/view/index.js"
    >
        <header class="yxc-brand">
            <a class="arrow-wrapper" data-role="cancel">
                <i class="bt-brand-back"></i>
            </a>
            <span>个人中心</span>
        </header>
        <div class="person-center-head"
            data-widget="app/client/app/xiche/pub_page/view/profile.js#main"
        >
            <i class="icon-user"></i>
            <div class="info-user">
                <p>用户名：<%= userCenterInfo.name || userCenterInfo.phone %></p>
                <p>手&nbsp;&nbsp;&nbsp;机：<%= userCenterInfo.phone %></p>
            </div>
            <% if (!isGanjiAPP) { %>
            <a class="bt-out" data-role="logout">退出</a>
            <% } %>
        </div>
        <div class="yxc-space"></div>
        <ul class="ui-center">
            <li
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/order_list.js"
            >
                <a><i class="icon-center-order"></i>我的订单</a>
            </li>
            <li
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/red_packet_list.js"
            >
                <a>
                    <i class="icon-center-red"></i>我的红包
                    <span>¥<%= redPacketInfo.total_balance %></span>
                </a>
            </li>
            <li
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/coupon_list.js"
            >
                <a>
                    <i class="icon-center-discount"></i>我的优惠劵
                    <span><%= couponInfo.total_list_num %>张</span>
                </a>
            </li>
        </ul>
        <div class="yxc-space border-t-no"></div>
        <ul class="ui-center">
            <li
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/profile_address/address_main.js"
            >
                <a><i class="icon-center-order icon-center-commonly"></i>常用地址</a>
            </li>
            <li
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/profile_car/car_main.js"
            >
                <a><i class="icon-center-red icon-center-mycar"></i>我的车辆</a>
            </li>
        </ul>
    </div>
    <p class="yxc-logo center-logo"></p>
    <div class="car-info-fixed">
        <em>©赶集易洗车2015</em>
        <span>客服电话：<a href="tel:4007335500" class="bt-telphone">4007-335-500</a></span>
    </div>
</section>