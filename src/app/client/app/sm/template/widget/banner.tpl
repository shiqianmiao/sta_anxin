<% if (list) { %>
<div class="focus-wrap">
    <% if (list.length === 1) { %>
        <div class="mod-focus">
            <ul class="focus-pics" style="width: 100%; max-height: 52px;">
                <li data-role="item">
                    <a href="javascrpt:;"
                        data-evlog="banner_0"
                        data-native-a='<%= list[0].detail.jump_url %>'>
                        <img src="<%= list[0].img_url %>">
                    </a>
                </li>
            </ul>
        </div>
    <% } else { %>
        <div class="mod-focus"
        data-widget="com/mobile/widget/responsiveBanner.js"
        data-interval="3000">
            <ul class="focus-pics" data-role="list" style="width: 100%; max-height: 52px;">
                <% list.forEach(function (item, index) { %>
                    <li data-role="item">
                        <a href="javascrpt:;"
                            data-evlog="banner_<%= index %>"
                            data-native-a='<%= item.detail.jump_url %>'>
                            <img src="<%= item.img_url %>">
                        </a>
                    </li>
                <% }); %>

            </ul>
            <div class="focus-indexs" id="focusIndexs">
                <% for (var i =0; i < list.length; i++) { %>
                    <i data-slide-to="<%= i %>" class="<% if (i === 0) { %> active <% } %>"></i>
                <% } %>
            </div>
        </div>
    <% } %>
</div>
<% } %>