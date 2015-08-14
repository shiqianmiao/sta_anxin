<% for(var i = 0; i < answer_list.length; i++) { %>
<li class="per-reply">
    <header class="reply-title">
        <a href="<%= answer_list[i]['from_user']['detail_url'] %>"><img src="<%= answer_list[i]['from_user']['face_url'] %>" class="head-pic borR-50" /></a>
        <div class="txt-wrap">
            <a href="<%= answer_list[i]['from_user']['detail_url'] %>"><span class="reply-name"><%= answer_list[i]['from_user']['real_name'] %></span></a>
            <time><%= answer_list[i]['create_time'] %></time>
            <% if (answer_list[i]['allow_delete']) { %>
                <a href="javascript:;" class="delete-btn" data-id="<%= answer_list[i]['id'] %>"></a>
            <% } %>
        </div>
    </header>
    <p class="reply-content"><%= answer_list[i]['content'] %></p>
    <% if (answer_list[i]['images'].length > 0){ %>
    <ul class="pic-list clear add-pd" data-widget="app/hybrid/app/keshi/js/answer.js#swipeImg">
        <% for(var j = 0; j < answer_list[i]['images'].length; j++) { %>
        <li class="per-pic change-bg-pic" data-sort="<%= j %>" data-url="<%= answer_list[i]['images'][j]['big_img'] %>"></li>
        <% } %>
    </ul>
    <% } %>
    <% if (answer_list[i]['is_praise'] || answer_list[i]['reward'] > 0) { %>
    <div class="reply-zan">
        <% if (answer_list[i]['reward'] > 0) { %>
        <span class="pai">￥<%= answer_list[i]['reward'] %></span>
        <% } %>
        <% if (answer_list[i]['is_praise']) { %>
        <span class="hua" <%= answer_list[i]['reward'] > 0 ? '' : 'style="margin-right: 0px;"' %>></span>
        <% } %>
    </div>
    <% } %>
</li>
<% } %>