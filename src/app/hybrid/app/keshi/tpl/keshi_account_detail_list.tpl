<% for(var i = 0; i < detail_list.length; i++) { %>
    <li class="per-record">
        <a href="<%= detail_list[i].detail_url %>">
            <h3><%= detail_list[i].type_text %></h3>
            <time><%= detail_list[i].create_time %></time>
            <section class="amount flex-center"><%= detail_list[i].amount %></section>
        </a>
    </li>
<% } %>