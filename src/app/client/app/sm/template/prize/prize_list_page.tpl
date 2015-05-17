<!-- 我的奖品列表 -->
<!--http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/sm/view/prize/prize_list_page.js?user_id=8241 -->
<!-- section start -->
<section class="prize">
    <% if (!data || data.length <= 0) { %>
    <div class="guide active">
        <div class="page-status status-nothing">
            <div class="status-tips">暂无奖品</div>
        </div>
        <a href="javascript:;" data-native-a="#app/client/app/sm/view/index_page.js" class="btn btn-primary btn-large">去兑换</a>
    </div>
    <% } else{ %>
    <div class="list">
        <div class="mod-column">
            <div class="column-head">
                <h2 class="column-title">奖品列表</h2>
            </div>
            <div class="column-body">
                <div id="feedList" class="mod-list">
                    <% data.forEach(function (item) { %>
                    <div class="list-item">
                        <a href="javascript:;" data-native-a='#app/client/app/sm/view/detail_page.js?product_id=<%= item.product_id %>' class="list-cont">
                            <div class="list-image"><img src="<%= item.img_url %>" alt="<%= item.name %>"></div>
                            <h3 class="list-title"><%= item.name %></h3>
                            <div class="list-value"><b><%= item.price %></b>积分</div>
                            <div class="list-info">兑换日期：<%= item.openDate %></div>
                            <% if (item.endDate) { %>
                                <div class="list-info">过期日期：<%= item.endDate %></div>
                            <% } %>
                        </a>
                        <% if (parseInt(item.product_type) === 10) { %>
                        <div class="list-address">
                            <h3 class="address-head">收货信息</h3>
                            <div class="address-item"><span>联系人</span><%= item.express_consignee %>　　<%= item.express_phone %></div>
                            <div class="address-item"><span>收货地址</span><%= item.express_address %></div>
                        </div>
                        <% } else { %>

                        <div class="list-code">
                            <% if (item.product_code) { %>
                                <div class="code-item">
                                        <label>
                                        <input  type="text" readonly="" style="border:none; width: 50px; color:#999;" value="兑换码：">
                                            <%= item.product_code %>
                                        </label>
                                </div>
                            <% } %>
                            <% if (item.address) { %>
                                <div class="code-item">
                                    <span style="width:70px;">
                                        兑换地址：
                                    </span>
                                    <a href="<%= item.address %>"><%= item.address %></a>
                                </div>
                            <% } %>
                        </div>
                        <% } %>
                    </div>
                    <% }) %>
                </div>
            </div>
        </div>
    </div>
    <% } %>
</section>
<!-- section end -->
<div class="tip" style="display: none;"></div>
