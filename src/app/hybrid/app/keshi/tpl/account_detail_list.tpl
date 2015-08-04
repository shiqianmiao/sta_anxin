<% for(var i = 0; i < detail_list.length; i++) { %>
    <li class="per-account">
        <a href="<%= detail_list[i].detail_url %>">
            <h3 class="account-title"><%= detail_list[i].type_text %></h3>
            <time class="account-time"><%= detail_list[i].create_time %></time>
            <em class="money"><%= detail_list[i].amount %></em>
        </a>
        <span class="go-icon"></span>
    </li>
<% } %>