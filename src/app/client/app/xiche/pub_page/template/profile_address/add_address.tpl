<section class="yxc-payment-bg pad-bot-comm">
    <div class="yxc-pay-main"
        data-widget="app/client/app/xiche/pub_page/view/profile_address/add_address.js#form"
        data-id="<%= id %>"
        data-type="<%= type %>"
    >
        <header class="yxc-brand">
            <a class="arrow-wrapper"
                data-widget="app/client/app/xiche/pub_page/widget/widget#link"
                data-url="app/client/app/xiche/pub_page/view/profile_address/address_main.js"
            >
                <i class="bt-brand-back"></i>
            </a>
            <span>常用地址</span>
        </header>
        <ul class="yxc-attr-list posi-commonly-list"
            data-widget="app/client/app/xiche/pub_page/view/profile_address/add_address.js#address"
            data-city-id="12"
            data-city-name="<%= cityInfo.cityName %>"
        >
            <li>
                <i class="icon-phone icon-posi-name"></i>
                <p class="<%= (type === 1 || type === 2) ? 'cover' : '' %> no-arrow">
                    <input data-role="address" class="ipt-attr" type="text" name="phone" value="<%= addressInfo.address || title || '' %>" placeholder="起个好记的名字吧（学校/公司）">
                </p>
            </li>
            <li>
                <i class="icon-plate-num icon-posi-select"></i>
                <p class="no-arrow">
                    <input data-role="addressName" type="text" name="series-name" value="<%= addressInfo.address_name || address_name %>" placeholder="请您选择地址" class="ipt-attr">
                </p>
                <div data-role="list"></div>
                <script type="text/template" data-role="listTemplate">
                    <%= '<' + '% list.forEach(function (item) { %' + '>' %>
                    <div class="posi-list posi2-list"
                        data-role="item"
                        data-latlng="<%= '<' + '%= item.location.lat + "," + item.location.lng %' + '>' %>"
                        data-name="<%= '<' + '%= item.name %' + '>' %>"
                        data-address="<%= '<' + '%= item.address %' + '>' %>"
                    >
                        <h3><%= '<' + '%= item.name %' + '>' %></h3>
                        <%= '<' + '%= item.address %' + '>' %>
                    </div>
                    <%= '<' + '% }) %' + '>' %>
                </script>
            </li>
            <li>
                <i class="icon-position icon-posi-tips"></i>
                <p class="no-arrow">
                    <input data-role="addressRemark" data-latlng="<%= addressInfo.latlng || latlng || '' %>" type="text" name="series-name" value="<%= addressInfo.address_remark || address_remark %>" placeholder="填写备注，方便找到您的车辆" class="ipt-attr">
                </p>
            </li>
        </ul>
        <a class="bt-sub-order" data-role="submit">保存</a>
    </div>
    <div class="car-info-fixed">
      <em>©赶集易洗车2015</em>
      <span>客服电话：<a href="tel:4007335500" class="bt-telphone">4007-335-500</a></span>
    </div>
</section>