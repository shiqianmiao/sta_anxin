<section>
    <div
        data-widget="app/client/app/xiche/pub_page/widget/widget.js#list"
        data-name="colorId"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
        data-next-url="app/client/app/xiche/pub_page/view/choose_car_info.js"
        data-back-url="app/client/app/xiche/pub_page/view/choose_car_info.js"
    >
        <header class="yxc-brand">
            <span>车身颜色选择</span>
            <a class="bt-yxc-close" data-role="cancel">取消</a>
        </header>
        <ul class="yxc-series-list content">
            <% Object.keys(colors).forEach(function (id) { %>
                <li data-id="<%= id %>" data-role="item">
                    <a href="javascript: void(0);"><%= colors[id].name %></a>
                </li>
            <% }) %>
        </ul>
    </div>
</section>