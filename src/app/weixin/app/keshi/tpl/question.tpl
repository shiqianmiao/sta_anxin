<% for(var i = 0; i < list.length; i++){ %>
<a href="/question/desc?question_id=<%= list[i].id%>">
    <li class="per-ques">
        <img src="<%= list[i].head_url%>" class="head-pic borR-50" />
        <div class="ques-con-wrap">
            <h3 class="noWrapEllipsis <%= list[i].read_class%>"><%= list[i].content%></h3>
            <time><%= list[i].create_time%>　回复：<%= list[i].answer_count%></time>
        </div>
    </li>
</a>
<% } %>
