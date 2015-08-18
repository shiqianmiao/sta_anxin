<% for(var i = 0; i < order_list.length; i++) { %>
    <li class="per-order" id="order_<%= order_list[i].id %>" data-widget="app/hybrid/app/keshi/js/rob_order.js#order" data-id="<%= order_list[i].id %>" data-remain="<%= order_list[i].remain_time %>">
        <a href="<%= order_list[i].detail_url %>">
            <div class="order-title">
                <time class="order-time"><%= order_list[i].service_time_text %></time>
                <div class="remaining">
                    <h4 class="remaining-title">剩余时间：</h4>
                    <time class="remaining-time"><%= order_list[i].remain_time_text %></time>
                </div>
            </div>
            <% for(var j = 0; j < order_list[i].service_item_list.length; j++) { %>
            <h3 class="service-opa"><%= order_list[i].service_item_list[j] %></h3>
            <% } %>
            <p class="addr"><%= order_list[i].address_text %></p>
        </a>
        <footer class="order-foot">
            <a href="javascript:;" class="rob-btn borR-3" data-robbed="<%= order_list[i].robbed %>"><%= order_list[i].btn_text %></a>
        </footer>
    </li>
<% } %>