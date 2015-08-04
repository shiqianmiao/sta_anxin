<% for(var i = 0; i < question_list.length; i++) { %>
<li class="per-records clear" data-jslink="<%= question_list[i].detail_url %>">
    <a href="<%= question_list[i].customer_info.detail_url %>"><img data-flag="true" src="<%= question_list[i].customer_info.head_url %>" class="head-pic borR-50" /></a>
    <div class="records-content">
        <h2><a data-flag="true" href="<%= question_list[i].customer_info.detail_url %>"><%= question_list[i].customer_info.real_name %></a><em><%= question_list[i].create_time %></em></h2>
        <p>问：<%= question_list[i].content %></p>
    </div>
</li>
<% } %>