<% for(var i = 0; i < order_list.length; i++) { %>
    <li id="order_<%= order_list[i].id %>" class="per-order" data-widget="app/hybrid/app/keshi/js/rob_order.js#order" data-id="<%= order_list[i].id %>" data-remain="<%= order_list[i].remain_time %>">
        <a href="<%= order_list[i].detail_url %>">
            <div class="order-title">
                <h3 class="order-name"><%= order_list[i].service_item_title %></h3>
                <time class="order-time"><%= order_list[i].service_time_text %></time>
            </div>
            <p class="addr"><%= order_list[i].address_text %></p>
            <div class="remaining">
                <h4 class="remaining-title">剩余时间：</h4>
                <time class="remaining-time"><%= order_list[i].remain_time_text %></time>
            </div>
        </a>
        <footer class="order-foot">
            <a href="javascript:;" class="rob-btn borR-3" data-robbed="<%= order_list[i].robbed %>"><%= order_list[i].btn_text %></a>
        </footer>
    </li>
<% } %>