<section class="yxc-body-bg car-info-bg">
    <form action="" method="post"
        data-widget="app/client/app/xiche/pub_page/view/choose_car_info.js#form"
        data-back-url="<%= params.fromUrl %>"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
    >
        <header class="yxc-brand">
            <a class="arrow-wrapper" data-role="back">
                <i class="bt-brand-back"></i>
            </a>
            <span>车辆信息</span>
        </header>
        <ul class="yxc-attr-list car-info-list">
            <li>
                <i class="icon-plate-num"></i>
                <p class="field no-arrow">
                    <a href="javascript: void(0);"
                        data-role="select"
                        data-url="app/client/app/xiche/pub_page/view/choose_province.js"
                    >
                        <b data-role="province" class="yxc-car-zone"><%= cityInfo.province %></b>
                        <span class="bt-zone-tip"></span>
                    </a>
                    <input data-role="carNumber" class="input-plate" value="<%= carNumber %>" type="text" maxlength="6" name="carNumber" placeholder="请输入车牌号码">
                </p>
            </li>
            <li
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/choose_brand.js"
            >
                <i class="icon-series"></i>
                <p class="cover">
                    <input
                        data-role="carModelName"
                        class="ipt-attr"
                        type="text"
                        name="carModelName"
                        value="<%= series.series_name %>"
                        placeholder="请选择车系"
                        readonly
                    >
                </p>
            </li>
            <li
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/choose_color.js"
            >
                <i class="icon-color"></i>
                <p class="cover">
                    <input
                        data-role="colorName"
                        class="ipt-attr"
                        type="text"
                        name="carColorId"
                        value="<%= colorName %>"
                        placeholder="请选择车身颜色"
                        readonly
                    >
                </p>
            </li>
        </ul>
        <a class="bt-sub-order"
            data-role="submit"
            data-url="app/client/app/xiche/pub_page/view/index.js"
        >
            确定
        </a>
        <% if(carList.length + carHistoryList.length) { %>
        <ul class="car-commonly">
            <span class="tit-commonly">常用车辆</span>
            <% carList.forEach(function(carInfo) { %>
            <li
                data-role="item"
                data-car-number="<%= carInfo.car_number %>"
                data-brand-id="<%= carInfo.car_brand_id %>"
                data-series-id="<%= carInfo.car_model_id %>"
                data-series-name="<%= carInfo.car_model_name %>"
                data-color-name="<%= carInfo.car_color_name %>"
                data-color-id="<%= carInfo.car_color_id%>"
            >
                <div>
                    <b><%= carInfo.car_number %></b>
                    <p><%= carInfo.car_model_name %> <%= carInfo.car_color_name %></p>
                </div>
            </li>
            <% }) %>
            <% carHistoryList.forEach(function(carInfo) { %>
            <li class="already"
                data-role="item"
                data-car-number="<%= carInfo.carNumber %>"
                data-brand-id="<%= carInfo.brandId %>"
                data-series-id="<%= carInfo.seriesId %>"
                data-series-name="<%= carInfo.seriesName %>"
                data-color-name="<%= carInfo.colorName %>"
                data-color-id="<%= carInfo.colorId%>"
            >
                <div>
                    <b><%= carInfo.carNumber %></b>
                    <p><%= carInfo.seriesName %> <%= carInfo.colorName %></p>
                </div>
            </li>
            <% }) %>
        </ul>
        <% } %>
    </form>
</section>

