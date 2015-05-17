<% if (data) { %>
    <% data.forEach(function (item) { %>
        <tr>
            <td><%= item.name %></td>
            <td><%= item.bought_date %></td>
            <td><%= item.product_code || '无' %></td>
        </tr>
    <% }); %>
<% } %>