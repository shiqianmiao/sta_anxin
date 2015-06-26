<% for(var i = 0; i < order_list.length; i++){ %>
<li class="per-order2">
    <h2 class="order2-title"><%= order_list[i].desc %></h2>

    <% if(order_list[i].remain_time) {%>
    <div class="remaining-wrap">
        <p class="order2-remaining-time">距离接单结束还剩：<%= order_list[i].remain_time%></p>
    </div>
    <% } %>
    <a href="/order/desc?order_id=<%= order_list[i].order_id%>">
        <ul class="order2-pro">
            <li class="per-pro">
                <h3>时间： </h3>
                <p><%= order_list[i].service_time_b%></p>
            </li>
            <li class="per-pro">
                <h3>项目： </h3>
                <p><%= order_list[i].service_name%></p>
            </li>
            <li class="per-pro">
                <h3>应付： </h3>
                <p>￥<%= order_list[i].actually_amount/100 %></p>
            </li>
            <li class="per-pro">
                <h3>地点： </h3>
                <p><%= order_list[i].address%><%= order_list[i].address_detail_detail%></p>
            </li>
        </ul>
    </a>
    <% if(order_list[i].op_html) {%>
    <footer class="order2-foot">
        <a href="#" class="borR-3"><%= order_list[i].op_html%></a>
    </footer>
    <% } %>
</li>
<% } %>
