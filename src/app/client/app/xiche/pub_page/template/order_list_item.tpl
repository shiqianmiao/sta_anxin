<% list.forEach(function (item) { %>
    <ul class="yxc-order-common <% if (['4', '2'].indexOf(item.needsStatus) !== -1) { %>disable<% } %>"
        data-role="item"
        data-id="<%= item.needs_puid %>"
        data-status="<%= item.needsStatus%>"
    >
        <li>
            <b class="order-status <%= ({4: 'status-gray', 0: 'status-orange', 2: 'status-gray'})[item.needsStatus] || 'status-green' %>"><%= item.needsStatusText %></b>
            <span class="yxc-order-time"><%= item.jobTime %></span>
        </li>
        <li><i class="icon-style"></i><%= item.serviceName %></li>
        <li><i class="icon-zone"></i><p class="order-zone-con"><%= item.address %></p></li>
        <li><i class="icon-plate"></i><%= item.car_number %></li>
    </ul>
<% }) %>