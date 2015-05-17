<ul class="filter-menu" data-role="test">
    <% cityList.forEach(function (item) { %>
    <li data-value="<%= item.city_id %>"><%= item.name %></li>
    <% }) %>
</ul>
