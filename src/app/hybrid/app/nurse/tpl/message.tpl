<% for(var i = 0; i < message_list.length; i++) { %>
    <li class="per-msg">
        <a href="<%= message_list[i].url %>"><p><%= message_list[i].content %></p></a>
        <time><%= message_list[i].create_time_text %></time>
    </li>
<% } %>