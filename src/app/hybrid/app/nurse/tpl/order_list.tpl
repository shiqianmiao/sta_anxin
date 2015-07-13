<% for(var i = 0; i < order_list.length; i++) { %>
<li class="per-order">
    <% if (order_list[i].status > 1 && order_list[i].status <= 10) { %>
    <h3 class="order-time-title" data-time="<%= order_list[i].remain_time %>" data-widget="app/hybrid/app/nurse/js/order_list.js#remainTimer">距离服务还有：<span><%= order_list[i].remain_time_text %></span></h3>
    <% } %>
    <section class="order-pro clear">
        <h3 class="pro-title">服务时间 :</h3>
        <p class="pro-p"><%= order_list[i].service_time_text %></p>
    </section>
    <section class="order-pro clear">
        <h3 class="pro-title">服务项目 :</h3>
        <p class="pro-p"><%= order_list[i].service_item_title %></p>
    </section>
    <section class="order-pro clear">
        <h3 class="pro-title">服务金额 :</h3>
        <p class="pro-p red">￥<%= order_list[i].price %></p>
    </section>
    <section class="order-pro clear">
        <h3 class="pro-title"><em class="letter-span">联系人</em>:</h3>
        <p class="pro-p"><%= order_list[i].customer_name %></p>
    </section>
    <section class="order-pro clear">
        <h3 class="pro-title">联系电话 :</h3>
        <p class="pro-p"><%= order_list[i].mobile %></p>
    </section>
    <section class="order-pro clear">
        <h3 class="pro-title">服务地址 :</h3>
        <a href="<%= order_list[i].map_url %>"><p class="pro-p"><%= order_list[i].address_text %><i class="addr-icon"></i></p></a>
    </section>
    <section class="order-pro clear">
        <h3 class="pro-title">备　　注 :</h3>
        <p class="pro-p"><%= order_list[i].mark %></p>
    </section>
    <section class="order-pro clear">
        <h3 class="pro-title">状　　态 :</h3>
        <p class="pro-p"><%= order_list[i].status_text %></p>
    </section>
    <% if (order_list[i].status > 1 && order_list[i].status <= 15) { %>
        <footer class="order-btn-foot" data-widget="app/hybrid/app/nurse/js/order_list.js#order" data-id="<%= order_list[i].id %>">
            <a href="javascript:;" data-op="<%= order_list[i].next_op %>" class="js_button go-btn borR-3"><%= order_list[i].btn_text %></a><a href="javascript:" data-op="cancel" class="js_button cancle-btn cancle-order-btn borR-3">取消订单</a>
        </footer>
    <% } %>
</li>
<% } %>