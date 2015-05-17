<section>
    <div
        data-widget="app/client/app/xiche/pub_page/widget/widget.js#list"
        data-name="seriesId"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
        data-next-url="app/client/app/xiche/pub_page/view/choose_car_info.js"
        data-back-url="app/client/app/xiche/pub_page/view/choose_brand.js"
    >
        <header class="yxc-brand">
            <a class="arrow-wrapper" data-role="cancel">
                <i class="bt-brand-back"></i>
            </a>
            <span>选择车系</span>
        </header>
        <ul class="yxc-series-list content">
            <% Object.keys(brand.seriesList).forEach(function (id) { %>
                <% if (brand.seriesList[id].status === 1) { %>
                    <li
                        data-role="item"
                        data-id="<%= id %>"
                    >
                        <a><%= brand.seriesList[id].series_name %></a>
                    </li>
                <% } else { %>
                    <li class="series-dis">
                        <a><span class="tip-series">暂不支持此车型</span><%= brand.seriesList[id].series_name %></a>
                    </li>
                <% } %>
            <% }) %>
        </ul>
    </div>
</section>