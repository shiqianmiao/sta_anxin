<% if (data) { %>
    <% data.forEach(function (item) { %>
    <div class="list-item" data-json-args="JSON.stringify(item)">
        <div class="list-cont">
            <div class="list-value">
                <% if (item.credit_change < 0) { %>
                    <b class="lose"><%= item.credit_change %></b>
                <% } else { %>
                    <b class="add">+<%= item.credit_change %>
                    </b>
                <% } %>
            积分</div>
            <h3 class="list-title"><%= item.task_name %></h3>
            <div class="list-info"><%= item.openDate %></div>
        </div>
    </div>
    <% }); %>
<% } %>