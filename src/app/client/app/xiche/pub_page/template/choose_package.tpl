<section class="yxc-payment-bg pad-bot-comm">
    <div class="yxc-pay-main"
        data-widget="app/client/app/xiche/pub_page/widget/widget.js#list"
        data-name="productCode"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
        data-next-url="app/client/app/xiche/pub_page/view/index.js"
        data-back-url="app/client/app/xiche/pub_page/view/index.js"
    >
        <header class="yxc-brand">
            <a class="arrow-wrapper" data-role="cancel">
                <i class="bt-brand-back"></i>
            </a>
            <span>选择服务</span>
        </header>
        <ul class="yxc-service-list yxc-package boder-top service-list"
            data-widget="app/client/app/xiche/pub_page/view/choose_package.js#selectList"
        >
            <% list.forEach(function (item, index) { %>
                <li class="<%= index === 0 ? 'active' : '' %>"
                    data-role="item"
                    data-id="<%= item.productCode %>"
                >
                    <label class="pay-type" for="pay-type-<%= index %>">
                        <span class="service-price"><em>¥</em><%= item.payAmount %></span>
                        <div class="service-intro">
                          <h3><%= item.title %></h3>
                          <%= item.content %>
                        </div>
                        <input name="pay-type" id="pay-type-<%= index %>" type="radio" value="" <%= index === 0 ? 'checked' : '' %>>
                        <span class="bt-interior"></span>
                    </label>
                </li>
            <% }) %>
        </ul>
    </div>
    <div class="car-info-fixed">
      <em>©赶集易洗车2015</em>
      <span>客服电话：<a href="tel:4007335500" class="bt-telphone">4007-335-500</a></span>
    </div>
</section>