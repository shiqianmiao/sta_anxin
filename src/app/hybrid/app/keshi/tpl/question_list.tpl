<% for(var i = 0; i < question_list.length; i++) { %>
<li class="per-ques borR-3" data-id="<%= question_list[i].id %>" data-jslink="<%= question_list[i].detail_url %>">
    <div class="ques-title clear">
        <a href="<%= question_list[i].customer_info.detail_url %>"><img data-flag="true" src="<%= question_list[i].customer_info.head_url %>" class="ques-head-pic" /></a>
        <div class="title-content">
            <a href="<%= question_list[i].customer_info.detail_url %>"><span data-flag="true" ><%= question_list[i].customer_info.real_name %></span></a>
            <% if (question_list[i].answer_count == 0) { %>
                <p class="answer-label">待回答</p>
            <% } %>

            <% if (is_manager) { %>
            <div class="opation-wrap" data-flag="true" >
                <div class="alert-opa borR-3" data-show="false">
                    <span class="to-public" data-flag="true" data-open="<%= question_list[i].open %>"><%= question_list[i].open_text %></span>
                    <span class="to-delete" data-flag="true">删除</span>
                </div>
            </div>
            <% } %>
        </div>
    </div>
    <p class="ques-txt"><%= question_list[i].content %></p>
    <footer class="ques-footer">
        <time class="ques-time"><%= question_list[i].create_time %></time>
        <a href="javascript:;" class="reply-num-btn borR-3" data-flag="true" >回复 <%= question_list[i].answer_count %></a>
    </footer>
</li>
<% } %>