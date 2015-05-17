<% if (list) { %>
<% list.forEach(function (item) { %>
    <div data-product-id="<%= item.user_id%>" data-role="item" class="list-item js-touch-state"
        data-native-a="#<%= jsALink %>?product_id=<%= item.product_id %>">
        <div class="list-cont">
            <div class="list-image"><img src="<%= item.img_url %>" alt=""></div>
            <div class="list-value"><b ><%=item.price %></b>积分</div>
            <div class="list-info"><%= item.user_name %></div>
        </div>
    </div>
<% }) %>
<% } %>