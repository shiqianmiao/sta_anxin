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

<% for(var i = 0; i < list.length; i++){ %>
<li class="per-reply">
        <div class="reply-peo-intr clear">
            <a href="<%= list[i].worker_url%>">
            <img src="<%= list[i].head_url%>" class="reply-peo-pic borR-50">
            </a>
            <div class="reply-per-txt">
                <h3><%= list[i].from_username%></h3>
                <p><%= list[i].create_time%></p>
            </div>
        </div>
        <p class="reply-content"><%= list[i].content%></p>
        <ul class="pic-list clear">
			<% for(var j = 0; j < list[i].images; j++){ %>
                <li class="per-pic change-bg-pic" data-url="<%= list[i].images[j]%></li>
            <% } %>
        </ul>
		<% if(list[i].can_answer){ %>
	        <section class="reply-opa-wrap">
	            <a href="javascript:;" class="to-reward" data-answer="<%= list[i].id%>" >酬谢</a>
	            <a href="javascript:;" class="to-thank <%= list[i].praise_class%>" data-answer="<%= list[i].id">送花</a>
	            <a href="/question/addPage?question_id=<%= list[i].question_id%>&to_user_id=<%= list[i].to_user_id%>;">回复</a>
	        </section>
        <% } %>
    </li>
<% } %>
