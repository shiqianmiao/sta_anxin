<% if (data){ %>
    <% data.forEach(function (item) { %>

    <div class="dz-common">
      <a href="<%= item.url %>">
        <div class="dz-common-con">
           <%= item.brief %>
        </div>
      </a>
    <div class="vote-wrap" data-widget="com/mobile/page/misc/weiba/page/detail_page.js#like" data-aid="<%= item.article_id %>" data-origin="dz_list" data-url="http://3g.ganji.com/wb/ajax/?action=praise">
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
    <% }); %>
<% } %>