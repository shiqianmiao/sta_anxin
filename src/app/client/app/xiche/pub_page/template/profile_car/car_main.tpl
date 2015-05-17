<section class="yxc-payment-bg">
    <div class="yxc-pay-main"
        data-widget="app/client/app/xiche/pub_page/widget/widget.js#list"
        data-back-url="app/client/app/xiche/pub_page/view/profile.js"
    >
        <header class="yxc-brand">
            <a class="arrow-wrapper" data-role="cancel">
                <i class="bt-brand-back"></i>
            </a>
            <span>我的车辆</span>
        </header>
        <div id="tour-guide" style="<%= carList.length === 0 ? '' : 'display: none;' %>">
            <div class="boder-top"></div>
            <div class="order-spance"></div>
            <i class="icon-error"></i>
            <div class="error-tip error-mycar">还没有添加车辆，快来添加常用车辆吧！</div>
            <a class="bt-sub-order bt-sub-mycar"
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/choose_car_info.js?fromUrl=app/client/app/xiche/pub_page/view/profile_car/car_main.js"
            >添加</a>
        </div>
        <div id="main" style="<%= carList.length === 0 ? 'display: none;' : '' %>">
            <div class="yxc-space border-t-no"></div>
            <div class="top-mycar">
                <% if(carList.length < 5) { %>
                <a class="bt-add-car"
                    data-role="select"
                    data-url="app/client/app/xiche/pub_page/view/choose_car_info.js?fromUrl=app/client/app/xiche/pub_page/view/profile_car/car_main.js"
                >添加</a>
                <% } %>
                <i class="icon-circle"></i>我的车辆
            </div>
            <ul class="mycar-common">
                <% carList.forEach(function(item) { %>
                <li
                    data-role="select"
                    data-car-id="<%= item.id %>"
                    data-car-number="<%= item.car_number.slice(1) %>"
                    data-brand="<%= item.car_brand_id %>"
                    data-series-id="<%= item.car_model_id %>"
                    data-series-name="<%= item.car_model_name %>"
                    data-color-id="<%= item.car_color_id %>"
                    data-province="<%= item.car_number[0] %>"
                    data-url="app/client/app/xiche/pub_page/view/choose_car_info.js?fromUrl=app/client/app/xiche/pub_page/view/profile_car/car_main.js"
                ><b><%= item.car_number %></b><%= item.car_model_name %> <%= item.car_color_name %></li>
                <% }) %>
            </ul>
            <div class="yxc-space"></div>
            <% if(carHistoryList.length) { %>
            <div class="top-mycar">
                <i class="icon-circle"></i>历史车辆
            </div>
            <ul class="mycar-common mycar-histoy">
                <% carHistoryList.forEach(function(item) { %>
                    <li
                        data-role="select"
                        data-car-number="<%= item.carNumber.slice(1) %>"
                        data-series-id="<%= item.seriesId %>"
                        data-series-name="<%= item.seriesName %>"
                        data-color-id="<%= item.colorId %>"
                        data-province="<%= item.carNumber[0] %>"
                        data-url="app/client/app/xiche/pub_page/view/choose_car_info.js?fromUrl=app/client/app/xiche/pub_page/view/profile_car/car_main.js"
                    ><b><%= item.carNumber %></b><%= item.seriesName %> <%= item.colorName %></li>
                <% }) %>
            </ul>
            <% } %>
        </div>
    </div>
</section>