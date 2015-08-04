<% for(var i = 0; i < worker_list.length; i++) { %>
<li class="per-t">
    <a href="<%= worker_list[i]['detail_url'] %>" class="clear">
        <img src="<%= worker_list[i]['face_url'] %>" class="head-pic borR-50" />
        <div class="team-txt-wrap">
            <h3><%= worker_list[i]['real_name'] %></h3>
            <p><%= worker_list[i]['work_title_text'] %></p>
        </div>
        <span class="hua-num"><%= worker_list[i]['flower_count'] %>朵</span>
    </a>
</li>
<% } %>