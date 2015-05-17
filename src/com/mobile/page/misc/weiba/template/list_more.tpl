<% if (data){ %>
    <% data.forEach(function (item) { %>
            <% if (item.type === 'duanzi') { %>
              <div class="dz-common">
                <a href="<%= item.url %>">
                  <div class="dz-common-con">
                     <%= item.brief %>
                  </div>
                </a>
                <div class="vote-wrap" data-widget="com/mobile/page/misc/weiba/page/detail_page.js#like" data-origin="index_list" data-aid="<%= item.article_id %>" data-url="http://3g.ganji.com/wb/ajax/?action=praise">
                      <span data-role="add" class="<% if (item.haveGoodClick) { %> visited <% } %>">
                          <i class="icon-support"></i><b data-role="praise"><%= item.good_count %></b><u data-role="left" class="">+1</u>
                      </span>
                      <span data-role="sub" class="<% if (item.haveBadClick) { %> visited <% } %>">
                        <i class="icon-oppo"></i><b data-role="tread"><%= item.bad_count %></b><u class="" data-role="right">+1</u>
                      </span>
                     <a href="<%= item.url %>#SOHUCS">
                        <span><i class="icon-common"></i><b><%= item.commentnum %></b></span>
                     </a>
                </div>
              </div>
            <% } else { %>
                <div class="info-common">
                  <a href="<%= item.url %>">
                  <% if (item.images) { %>
                  <img src="<%= item.images %>" class="info-pic">
                  <% } %>
                    <h2 class="info-tit"><%= item.title %></h2>
                    <p class="info-con"><%= item.brief %></p>
                  <div class="info-data-time">
                    <%= item.comment_date%>
                    <span class="info-common-num"><i class="icon-common"></i><%= item.commentnum %></span>
                  </div>
                  </a>
                  <% if (item.comment) {%>
                  <div class="comment-wrap">
                    <span class="triangle"></span>
                    <p class="common-con">
                      <span></span><%= item.comment %>
                    </p>
                  </div>
                  <% } %>
                </div>
            <% } %>
    <% }) %>
<% } %>