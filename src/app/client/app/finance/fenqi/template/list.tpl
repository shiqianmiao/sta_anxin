<section class="product" data-widget="app/client/app/finance/fenqi/widget/fenqi.js#goUrl">
    <div class="banner">
        <a href="javascript:void(0)">
            <img src="http://sta.ganji.com/att/project/app/fenqi/banner.png" alt="">
        </a>
    </div>
    <div class="product-list">
        <% _.each(productList, function(item) { %>
        <div class="product-item">
            <a href="#" data-role="toUrl" data-url="app/client/app/finance/fenqi/controller/detail.js?product_id=<%= item.product_id %>" class="product-infor">
                <div class="product-image"><img src="http://image.ganjistatic1.com/<%= item.cover %>" alt=""><i class="icon icon-zero">0首付</i></div>
                <h3 class="product-title"><%= item.title %></h3>
                <div class="product-price">市场价:￥<%= item.market_price %>元</div>
                <div class="product-sale"><b>￥</b><strong><%= item.monthPayment %></strong><span>元/月 起</span></div>
                <div class="product-num">仅剩<%= item.store_num %>台</div>
            </a>
        </div>
        <% }); %>
    </div>
    <div class="box partner">
        <div class="box-head">
            <h2 class="box-title">合作伙伴</h2>
        </div>
        <div class="box-body">
            <div class="partner-list">
                <div class="partner-item"><a href="javascript:void(0)" ><img src="http://sta.ganji.com/att/project/app/fenqi/logo_beiyin.png" alt=""></a></div>
            </div>
        </div>
    </div>
</section>