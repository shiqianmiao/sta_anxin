<header class="yxc-brand">
    <a class="arrow-wrapper" onclick="history.go(-1)">
        <i class="bt-brand-back"></i>
    </a>
    <span>商品详情</span>
</header>
<section class="product fixed-show" data-widget="app/client/app/finance/fenqi/widget/fenqi.js#detailBuy" data-total-price="<%= productDetail.market_price %>" data-product-id="<%= productDetail.product_id %>">
    <div class="product-detail">
        <div class="focus" data-widget="com/mobile/widget/responsiveBanner.js" data-interval="3000">
            <ul class="focus-pics" style="height: 200px; overflow: hidden;" data-role="list">
                <% _.each(productDetail.thumbs_top, function(url) { %>
                <li data-role="item">
                    <a href="javascript:void(0)"><img style="width:200px" src="http://image.ganjistatic1.com/<%= url %>" alt=""></a>
                </li>
                <% }) %>
            </ul>
            <div class="focus-indexs" id="focusIndexs">
                <% _.each(productDetail.thumbs_top, function(url, i) { %>
                    <i data-slide-to="<%= i %>" class="<% if(i==0) { %> active <% } %>"></i>
                <% }) %>
            </div>
        </div>
        <div class="blank"></div>
        <h1 class="product-title"><%= productDetail.title %></h1>
        <div class="product-price">市场价:￥<%= productDetail.market_price %>元</div>
        <div class="product-stage">
            <h3 class="stage-title">首付金额：</h3>
            <div class="stage-list">
                <div class="stage-item active" data-value="0" data-role="downPay">0元</div>
            </div>
            <h3 class="stage-title">分期月数:</h3>
            <div class="stage-list">
                <div class="stage-item" data-value="6" data-role="month">6期</div>
                <div class="stage-item" data-value="12" data-role="month">12期</div>
                <div class="stage-item active" data-value="24" data-role="month">24期</div>
            </div>
        </div>
        <div class="product-sale">
            <label>月供：</label>
            <b>￥</b>
            <strong data-role="monthPayment">888</strong>
            <span>元 × <i data-role="totalMonth">3</i>期</span>
        </div>
    </div>
    <!-- <div class="guide active">
        <span>继续拖动，查看详情</span>
    </div> -->
    <div class="footbar">
        <button class="btn btn-primary btn-large js-touch-state"
            type="button" data-role="confirm">￥立即分期购买</button>
    </div>
</section>


