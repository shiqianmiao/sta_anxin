<section class="yxc-payment-bg pad-bot-comm">
    <div class="yxc-pay-main"
        data-widget="app/client/app/xiche/pub_page/widget/widget.js#list"
        data-back-url="app/client/app/xiche/pub_page/view/profile.js"
    >
        <header class="yxc-brand">
            <a class="arrow-wrapper" data-role="cancel">
                <i class="bt-brand-back"></i>
            </a>
            <span>常用地址</span>
        </header>
        <div class="yxc-space border-t-no"></div>
        <div class="top-mycar">
            <% if(addressList.length < 5) { %>
            <a class="bt-add-car"
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/profile_address/add_address.js"
            >添加</a>
            <% } %>
            <i class="icon-circle"></i>常用地址
        </div>
        <ul class="mycar-common my-posi-commonly">
            <li
                data-role="select"
                data-id="<%= homeAddress.id %>"
                data-title="<%= homeAddress.address %>"
                data-type="1"
                data-url="app/client/app/xiche/pub_page/view/profile_address/add_address.js"
            >
                <b>家</b><input class="ipt-attr ipt-posi" type="text" name="phone" value="<%= homeAddress.address_name %>" placeholder="请设置家庭地址" readonly>
            </li>
            <li
                data-role="select"
                data-id="<%= officeAddress.id %>"
                data-title="<%= officeAddress.address %>"
                data-type="2"
                data-url="app/client/app/xiche/pub_page/view/profile_address/add_address.js"
            >
                <b>公司</b><input class="ipt-attr ipt-posi" type="text" name="phone" value="<%= officeAddress.address_name %>" placeholder="请设置公司地址" readonly>
            </li>
            <% addressList.forEach(function(item) { %>
                <% if (String(item.address_type) !== '1' && String(item.address_type) !== '2') { %>
                <li
                    data-role="select"
                    data-id="<%= item.id %>"
                    data-title="<%= item.address %>"
                    data-type="3"
                    data-url="app/client/app/xiche/pub_page/view/profile_address/add_address.js"
                ><b><%= item.address %></b><input class="ipt-attr ipt-posi" type="text" name="phone" value="<%= item.address_name %>" placeholder="请设置地址" readonly></li>
                <% } %>
            <% }) %>
        </ul>
        <% if(addressHistoryList.length) { %>
        <div class="yxc-space"></div>
        <div class="top-mycar">
            <i class="icon-circle"></i>历史地址
        </div>
        <ul class="mycar-common mycar-histoy myposi-already">
            <% addressHistoryList.forEach(function (item) { %>
            <li
                data-role="select"
                data-latlng="<%= item.latlng %>"
                data-name="<%= item.addressName %>"
                data-address="<%= item.addressComment %>"
                data-type="4"
                data-url="app/client/app/xiche/pub_page/view/profile_address/add_address.js"
            ><b></b><input class="ipt-attr ipt-posi" type="text" name="phone" value="" placeholder="<%= item.addressName + '    ' + item.addressComment %>" readonly></li>
            <% }) %>
        </ul>
        <% } %>
    </div>
    <div class="car-info-fixed">
      <em>©赶集易洗车2015</em>
      <span>客服电话：<a href="tel:4007335500" class="bt-telphone">4007-335-500</a></span>
    </div>
</section>