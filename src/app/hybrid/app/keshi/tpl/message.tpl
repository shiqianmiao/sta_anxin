<% for(var i = 0; i < message_list.length; i++) { %>
    <li class="per-msg">
        <a href="<%= message_list[i].url %>"><p <%= message_list[i].is_read == 0 ? 'class="to-bold"' : '' %>><%= message_list[i].content %></p>
        <time><%= message_list[i].create_time_text %></time>
        </a>
    </li>
<% } %>