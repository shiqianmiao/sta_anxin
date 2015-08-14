<% for(var i = 0; i < order_list.length; i++) { %>
<li class="per-order">
    <% if (!(order_list[i].status > 1 && order_list[i].status <= 15)) { %>
    <header class="order-title">
        服务状态：<%= order_list[i].status_text %>
    </header>
    <% } %>
    <div class="content-wrap clear time-wrap">
        <h3>服务信息：</h3>
        <ul class="intr-list">
            <li><%= order_list[i].service_time_text %></li>
            <% for(var j = 0; j < order_list[i].service_item_list.length; j++) { %>
                <li class="text-indent-8"><%= order_list[i].service_item_list[j] %></li>
            <% } %>
        </ul>
    </div>
    <div class="content-wrap clear service-wrap">
        <h3>联系人信息：</h3>
        <ul class="intr-list">
            <li><%= order_list[i].customer_name %></li>
            <li><%= order_list[i].mobile %></li>
            <li><a class="addr-link" href="<%= order_list[i].map_url %>"><%= order_list[i].address_text %><img src="http://s1.anxinsta.com/app/hybrid/app/keshi/imgs/addr.png" class="addr-icon" /></a></li>
        </ul>
        <% if(order_list[i].mark) { %>
            <h3>备注信息：</h3>
            <ul class="intr-list">
                <li><%= order_list[i].mark %></li>
            </ul>
        <% } %>
        <h3>订单金额：</h3>
        <em class="price">￥<%= order_list[i].price %> <%= order_list[i].pay_way %></em>
    </div>

    <% if (order_list[i].status > 1 && order_list[i].status <= 15) { %>
    <footer class="opation-footer" data-widget="app/hybrid/app/keshi/js/order_list.js#order" data-id="<%= order_list[i].id %>">
        <a href="javascript:;" data-op="<%= order_list[i].next_op %>" class="js_button do-service borR-3"><%= order_list[i].btn_text %></a>
        <a href="javascript:;" data-op="cancel" class="js_button cancel-order borR-3">取消订单</a>
    </footer>
    <% } %>
</li>
<% } %>