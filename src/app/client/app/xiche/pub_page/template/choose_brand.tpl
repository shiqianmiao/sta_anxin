<section class="yxc-models-bg choose_brand">
    <div
        id="list"
        data-widget="app/client/app/xiche/pub_page/view/choose_brand.js#list"
        data-name="brand"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
        data-back-url="app/client/app/xiche/pub_page/view/choose_car_info.js"
    >
        <header class="yxc-brand">
            <a class="arrow-wrapper" data-role="back">
                <i class="bt-brand-back"></i>
            </a>
            <span>选择品牌</span>
        </header>
        <div class="yxc-main">
            <%
            var groups = _.groupBy(Object.keys(models), function (id) {
                return models[id].brand_first_char;
            });

            Object.keys(groups).sort().forEach(function (letter) {
            %>
            <p class="yxc-by-letter" data-role="letter" data-letter="<%= letter %>"><%= letter %></p>
            <ul class="yxc-list">
                <% groups[letter].forEach(function (id) { %>
                <li
                    data-role="item"
                    data-id="<%= models[id].brand_id %>"
                ><a href="javascript: void(0);"><%= models[id].brand_name %></a></li>
                <% }) %>
            </ul>
            <% }) %>
        </div>
        <div id="sider" class="yxc-sider" data-widget="app/client/app/xiche/pub_page/widget/widget.js#letterNav">
            <% Object.keys(groups).sort().forEach(function (letter) { %>
                <span data-role="letter" data-letter="<%= letter %>"><%= letter %></span>
            <% }) %>
        </div>
    </div>
</section>