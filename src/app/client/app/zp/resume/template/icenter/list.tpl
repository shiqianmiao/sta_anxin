<% _.each(list, function (item) { %>
    <%
    var i = [item.auth_phone, !item.read_status, item.isEntrust].filter(function (i) {
        return !!i;
    }).length;
    i = ['', 'icon-place', 'icon-place2', 'icon-place3'][i];
    %>
    <li class="js-touch-state"
        data-role="post"
        data-puid="<%= item.puid %>"
        data-findjob-puid="<%= item.findjob_puid %>"
        data-wanted-puid="<%= item.wanted_puid %>"
        data-type=<%if (item.resume_type === '兼职'){%><%= "parttime" %><%}else{%><%= "findjob" %><%}%>
    >
        <span class="list-cont" data-role="link">
            <!-- 标题 -->
            <% if (type === 'download') { %>
            <h2 <% if (item.auth_phone) { %>class="icon-place"<% } %>>
                <span><%= item.person %></span>
                <span><%= item.sex %></span>
                <span><%= item.age %>岁</span>
                <span><%= item.degree %></span>
                <% if (item.auth_phone) { %>
                <i class="icon icon-renz"></i>
                <% } %>
            <% } else { %>
            <h2
                class="<%= i %>"
            >
                <span><%= item.person %></span>
                <span><%= item.sex %></span>
                <span><%= item.age %>岁</span>
                <span><%= item.category %></span>
                <% if (item.auth_phone) { %>
                <i class="icon icon-renz"></i>
                <% } %>
                <% if (item.isEntrust) {%>
                <i class="icon icon-weituo"></i>
                <% } %>
                <% if (!item.read_status) { %>
                <i class="icon icon-status"></i>
                <% } %>
            <% } %>
            </h2>
            <!-- 第二行 -->
            <% if (type === 'download') { %>
            <p><%= item.resume_type %> 下载时间: <%= item.date%> <%= item.salary%></p>
            <% } else { %>
            <p><%= item.resume_type %> <%= item.degree %> <%= item.period %> <%= item.salary %></p>
            <% } %>

            <!-- 第三行 -->
            <% if (type === 'download') { %>
            <p>电话: <%= item.phone %></p>
            <% } else { %>
            <p><%= item.date %> 电话: <%= item.phone %></p>
            <% } %>
        </span>
        <nav class="list-opt3">
            <a href="javascript: void(0);" data-role="phone" data-phone="<%= item.phone %>"><i class="icon icon-tel"></i>拨打电话</a>
            <a href="javascript: void(0);" data-role="invitation"><i class="icon icon-mail"></i>面试邀请</a>
        </nav>
    </li>
<% }); %>