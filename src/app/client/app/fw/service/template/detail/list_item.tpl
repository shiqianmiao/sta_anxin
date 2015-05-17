<% _.each(detail.list, function (item) { %>
    <div class="comment-item">
         <div class="comment-author"><%= item.username %></div>       
         <div class="comment-meta"><%= item.post_at %></div>
         <div class="comment-cont">
             <p><%= item.content %></p>
         </div>
    </div>
<% }); %>