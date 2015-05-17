<!-- 奖品兑换 -->
<!-- section start -->
<section class="exchange">
    <div class="deliver">
        <h2 class="deliver-title"><i class="icon icon-ticks"></i>恭喜您，<% if (data.is_from_choujiang) { %>领取<% } else { %> 兑换 <% } %>奖品成功！</h2>
        <p class="deliver-tip">已放在“我的奖品”中</p>
    </div>
    <div class="content">
        <div class="content-image"><img src="<%= data.img_url %>" alt="<%= data.name %>"></div>
        <h3 class="content-title"><%= data.name %></h3>
        <div class="content-value"><b><%= data.price %></b>积分</div>
        <div class="content-info">兑换日期：<%= data.openDate %></div>
        <% if (data.endDate) { %>
            <div class="content-info">过期日期：<%= data.endDate %></div>
        <% } %>
        <% if (data.product_type && parseInt(data.product_type) === 10) { %>
            <div class="content-address">
                <h3 class="address-head">收货信息</h3>
                <div class="address-item"><span>联系人</span><%= data.express_consignee %>　　<%= data.express_phone %></div>
                <div class="address-item"><span>收货地址</span><%= data.express_address %></div>
            </div>
        <% } else { %>
            <div class="content-code">
                <% if (data.product_code) { %>
                    <div class="code-item">
                            <label>
                            <input type="text" readonly="" style="border:none; width: 65px; color:#999;" value="兑换码 "><%= data.product_code %>
                            </label>
                    </div>
                <% } %>
                <% if (data.address) { %>
                    <div class="code-item">
                        <span>
                            兑换地址
                        </span>
                        <a href="<%= data.address %>"><%= data.address %></a>
                    </div>
                <% } %>
            </div>
        <%}%>
    </div>
    <div class="summary">
        <div class="mod-column">
            <div class="column-head">
                <h2 class="column-title">奖品详情</h2>
            </div>
            <div class="column-body">
                <p><%= data.discribe %></p>
            </div>
        </div>
    </div>
</section>
<!-- section end -->
<div class="tip" style="display: none;"></div>
