<section class="yxc-models-bg choose_brand">
    <div
        id="list"
        data-widget="app/client/app/xiche/pub_page/view/choose_city.js#list"
        data-name="brand"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
    >
        <header class="yxc-brand yxc-brand-models">
            <a class="arrow-wrapper" data-role="back">
                <i class="bt-brand-back"></i>
            </a>
            <span>选择城市</span>
        </header>
        <div class="content">
            <p class="yxc-by-letter">当前城市</p>
            <ul class="yxc-city-list">
                <li><a href="javascript:void(0)"><%= currentCity.city_name %></a></li>
            </ul>
            <p class="yxc-by-letter">已开通服务城市</p>
            <% citygroups.forEach(function (group) { %>
            <p class="yxc-by-letter" data-role="letter" data-letter="<%= group.firstLetter %>"><%= group.firstLetter %></p>
            <ul class="yxc-list">
                <% group.groupList.forEach(function (city) { %>
                <li
                    data-role="item"
                    data-id="<%= city.city_id %>"
                    data-domain="<%= city.city_domain %>"
                ><a href="javascript: void(0);"><%= city.city_name %></a></li>
                <% }) %>
            </ul>
            <% }) %>
        </div>
        <div id="sider" class="yxc-sider" style="display: none;" 
            data-widget="app/client/app/xiche/pub_page/widget/widget.js#letterNav"
        >
            <% citygroups.forEach(function (group) { %>
                <span data-role="letter" data-letter="<%= group.firstLetter %>"><%= group.firstLetter %></span>
            <% }) %>
        </div>
    </div>
</section>