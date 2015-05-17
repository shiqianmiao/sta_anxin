<!-- section start -->
<section class="section">
<!-- filter start -->
    <div class="filter" data-widget="app/client/app/fw/service/view/list_page.js#filter" data-list="#listwrap" data-cate="<% if (category) {%> <%= category %> <% } %>" data-order="1">
        <ul class="filter-nav">
            <!--<% _.each(data, function (item, index) { %>
                <li data-role="tab" data-for="#filter<%= item.f %>" data-tabname="<%= item.f %>"><b><%= item.n %></b></li>
            <% }); %>-->
            <li data-role="tab" data-for="#filtercategory" data-tabname="category"><b>类型</b></li>
            <li data-role="tab" data-for="#filterorder" data-tabname="order"><b>最新</b></li>
        </ul>
        <% _.each(data, function (item) { %>
            <div class="filter-cont">
                 <div class="filter-wrap" id="filter<%= item.f %>" data-role="filterwrap">
                        <ul class="filter-menu">
                            <% if (item.f === 'category') {%>
                            <li data-role="menuitem" data-tab="<%= item.f %>" <% if (!category) { %>class="active"<% } %>>全部</li>
                            <% } %>
                            <% _.each(item.vs, function (menu) { %>
                                <li data-v="<%= menu.v %>" data-type="<%= item.f %>" data-role="menuitem" data-tab="<%= item.f %>" <% if (menu.v === 1 || menu.v === category){%>class="active"<%}%>><%= menu.n %></li>
                            <% }); %>
                        </ul>
                    <% _.each(item.vs, function (menu) { %>
                    <% if (!menu.vs) return;%>
                    <div class="filter-submenu js-need-iscroll" data-menu="<%= menu.v %>" data-role="submenulist">
                        <ul class="filter-submenu-list">
                            <li data-role="submenuitem" data-v="<%= menu.v %>" data-all="true" data-tab="<%= item.f %>">全部</li>
                            <% _.each(menu.vs, function (submenu) { %>
                                <li data-v="<%= submenu.v %>" data-role="submenuitem" data-tab="<%= item.f %>"><%= submenu.n %></li>
                            <% }); %>
                        </ul>
                    </div>
                    <% }); %>
                </div>
            </div>
        <% }); %>
    </div>
<!-- filter end -->
<!-- list start -->
<div class="list" data-widget="app/client/app/fw/service/view/list_page.js#list">
    <ul class="list-items" id="listwrap" data-maxpage="<%=  page_info.max_page %>" data-page="<%= page_info.page %>">
        <% _.each(list, function (item) { %>
        <li>
            <a data-href="/ng/app/client/app/fw/index.html#app/client/app/fw/service/view/detail_page.js?ask_id=<%= item.id %>" data-role="itemlink" class="list-cont" data-title="<%= item.title %>">
                <h2><%= item.title %></h2>
                <p class="fl"><span><%= item.post_at_str %></span> <span><%= item.category_name %>-<%= item.major_category_name %></span></p>
                <p class="fr"><span><strong><%= item.answer_num %>条</strong>回答</span></p>
            </a>
        </li>
        <% }); %>
    </ul>
    <span data-role="more" class="more hide">
            加载中...
    </span>
</div>
<!-- list end -->
</section>
<!-- section end -->
<!-- popup start -->
<div class="mask"></div>
<!-- popup end -->