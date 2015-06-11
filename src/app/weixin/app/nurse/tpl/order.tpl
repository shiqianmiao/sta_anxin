<% for(var i = 0; i < order_list.length; i++){ %> 
<li class="swiper-slide per-order boxSha orderInfo">
    <header class="order-top">
        <h3 class="name"><img class="head borR-50" src="<%= order_list[i].face_url %>"><%= order_list[i].worker_name %></h3>
        <div class="opation">
            <%= order_list[i].status_html %>
        </div>
    </header>
    <a href="/order/detail?order_id=<%= order_list[i].order_id %>" class="to-link">
    <section class="order-details">
        <div class="serv-wrap">
            <div class="serv-time clear">
                <span>服务时间 : </span>
                <span><%= order_list[i].service_time_b %></span>
            </div>
            <div class="serv-addr clear">
                <span>服务地址 : </span>
                <span><%= order_list[i].detail %></span>
            </div>
        </div>

        <ol class="project-list">
            <% for(var j = 0; j < order_list[i].service_item.length; j++){ %>
            <li class="per-project clear">
                <h3><%= order_list[i].service_item[j].name %></h3>
                <em>￥<%= order_list[i].service_item[j].price/100 %>/ *<%= order_list[i].service_item[j].times %></em>
            </li>
            <% } %>
        </ol>
    </section>
    <div class="real-pay">
        应付 : <span>￥<%= order_list[i].pay_amount/100 %></span>
    </div>
    </a>
    <footer class="<%= order_list[i].button_class %> clear">
        <a href="<%= order_list[i].button_href %>" class="borR-8"><%= order_list[i].desc %></a>
    </footer>
</li>
<% } %>