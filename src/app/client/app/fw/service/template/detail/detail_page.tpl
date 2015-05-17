<!-- section start -->
<section class="section">
<!-- detail start -->
    <div class="detail">
        <div class="detail-group">
            <h2 class="detail-title"><%= detail.title %></h2>
            <div class="detail-cont">
                <p class="detail-meta"><label>提问者</label><strong><%= detail.username %></strong></p>
                <p class="detail-meta"><label>提问时间</label><%= detail.post_at %></p>
                <p class="detail-meta"><label>浏览量</label><%= detail.come_num %></p>
                <p class="detail-meta"><label>分　　类</label><%= detail.category_name %>-<%=detail.major_category_name %></p>
            </div>
            <div class="detail-content">
                <p><%= detail.content %></p>
            </div>
        </div>
    </div>
<!-- detail end -->
<!-- comment start -->
    <div class="comment list">
        <div class="comment-head">
            <h2 class="comment-title"><%= detail.answer_num %>个回答</h2>
        </div>
        <div class="comment-body" data-role="listwrap" data-maxpage="<%= detail.page_info.max_page %>" data-page="<%= detail.page_info.page %>">
            <% _.each(detail.list, function (item) { %>
                <div class="comment-item">
                     <div class="comment-author"><%= item.username %></div>       
                     <div class="comment-meta"><%= item.post_at %></div>
                     <div class="comment-cont">
                         <p><%= item.content %></p>
                     </div>
                </div>
            <% }); %>
        </div>
        <span data-role="more" class="more hide">
            加载中...
        </span>
    </div>
<!-- comment end -->
</section>
<!-- section end -->