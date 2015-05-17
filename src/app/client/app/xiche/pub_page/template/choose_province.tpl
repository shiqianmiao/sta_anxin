<section class="yxc-body-bg">
    <div class="yxc-series-wrap"
        data-widget="app/client/app/xiche/pub_page/widget/widget.js#list"
        data-name="province"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
        data-next-url="app/client/app/xiche/pub_page/view/choose_car_info.js"
        data-back-url="app/client/app/xiche/pub_page/view/choose_car_info.js"
    >
        <header class="yxc-brand">
            <span>选择车牌</span>
            <a class="bt-yxc-close" data-role="cancel">取消</a>
        </header>
        <ul class="yxc-license-list boder-top">
            <% provinces.forEach(function (p) { %>
                <li data-role="item" data-id="<%= p %>">
                    <a href="javascript: void(0);"
                        <% if ( p === params.province ) { %>
                        class="touch"
                        <% } %>
                    ><%= p %></a>
            <% }) %>
        </ul>
    </div>
</section>