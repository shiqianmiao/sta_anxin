<% _.each(list, function (item) { %>
<li>
    <a data-href="/ng/app/client/app/fw/index.html#app/client/app/fw/service/view/detail_page.js?ask_id=<%= item.id %>" data-role="itemlink" class="list-cont" data-title="<%= item.title %>">
        <h2><%= item.title %></h2>
        <p class="fl"><span><%= item.post_at_str %></span> <span><%= item.category_name %>-<%= item.major_category_name %></span></p>
        <p class="fr"><span><strong><%= item.answer_num %>条</strong>回答</span></p>
    </a>
</li>
<% }); %>
<!--
    <li>
            <a href="javascript:;" class="list-cont">
                <h2>我想定做实木橱柜，不知道哪家好？</h2>
                <p class="fl"><span>今天</span> <span>建材-其他</span></p>
                <p class="fr"><span><strong>2条</strong>回答</span></p>
            </a>
        </li>-->