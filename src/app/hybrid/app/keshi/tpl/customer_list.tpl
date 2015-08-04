<% for(var i = 0; i < customer_list.length; i++) { %>
<li class="per-hz">
    <a href="<%= customer_list[i].detail_url %>">
        <img src="<%= customer_list[i].face_url %>" class="head-pic borR-50" />
        <div class="hz-txt-wrap"><%= customer_list[i].real_name %></div>
    </a>
</li>
<% } %>