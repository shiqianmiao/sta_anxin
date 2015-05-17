<header class="yxc-brand">
    <a class="arrow-wrapper" onclick="history.go(-1)">
        <i class="bt-brand-back"></i>
    </a>
    <span>账单详情</span>
</header>

<% if (!data) { %>
    <section class="section nothing-section" style="display: block;">
        <div class="page-status status-nothing" style="z-index: 1;">
            <div class="status-tips js-nothing-tip">
                <a href="http://sta.ganji.com/ng/app/client/common/index.html?&redirect=true#app/client/app/finance/fenqi/controller/index.js"
                data-native-a="app/client/app/finance/fenqi/controller/index.js"
                >
                    你没有任何分期账单哦~去 <strong style="color: red;">赶集商城</strong> 看看吧！
                </a>
            </div>
        </div>
    </section>
<% } else {%>
<section class="order <% if ( data.status && ',2,3,6,7,8'.indexOf(data.status) > 0 ) { %> grayscale <% } %>" >
    <% var statusMap = ['','fenqi-early','fenqi-doing','fenqi-overdue'] %>
    <% var stateClasses = ['','status-fail-edit','status-fail-over','status-fail-edit','status-pass-doing','status-pass-doing','status-fail-over','status-fail-over','status-fail-over', 'status-fail-edit'] %>
    <div class="order-detail">
        <div class="order-infor">
            <div class="order-status <%= stateClasses[data.status] %>"><%= data.status_text %></div>
            <div class="order-info"><span>账单号:</span><span><%= data.apply_id %></span></div>
            <% if(data.repayment_time) {%>
                <div class="order-info"><span>账单日期:</span><%= data.repayment_time %></div>
            <% } %>
            <div class="order-info row">
                <% if (parseInt(data.repayment_amount, 10)) { %>
                    <div class="col-6"><span>总金额:</span>￥<%= data.repayment_amount %></div>
                <% } %>
                <% if ( parseInt(data.repayment_left, 10) ) { %>
                    <div class="col-6"><span>剩余还款:</span><b>￥</b><strong><%= data.repayment_left %></strong></div>
                <% } %>
            </div>
            <% if ( parseInt(data.repayment_day_count, 10) ) { %>
                <div class="order-info"><span>距下期还款:</span><b><%= data.repayment_day_count %></b><span>天</span></div>
            <% } %>
        </div>
        <div class="order-infor order-infor2">
            <nav class="tab" data-widget="com/mobile/widget/tab.js">
                <a href="javascript:;" class="tab-item active" data-role="tabTitle" data-for="#order_fenqi">分期信息</a>
                <a href="javascript:;" class="tab-item" data-role="tabTitle" data-for="#order_data">订单信息</a>
            </nav>
            <div class="tab-content active" id="order_fenqi">
                <% if(data.block_repayment.length > 0) { %>
                <div class="order-fenqi">
                    <div class="fenqi-count"><span>每期</span> ￥<%=data.block_repayment[0]['repayment_money']%> × <%= data.month %>期 = ￥<%= data.block_repayment[0]['repayment_money'] * data.month %></div>
                        <div class="fenqi-list">
                                <% data.block_repayment.forEach(function (item, index) { %>
                                    <div class="fenqi-item">
                                        <div class="fenqi-infor <%= statusMap[item.status] %>">
                                            <div class="fenqi-title">第 <%= item.num_show %> 期</div>
                                            <div class="fenqi-info"><span>还款日期:</span><%= item.time_str %></div>
                                            <div class="fenqi-info"><span>还款金额:</span><b>￥<%= item.repayment_money %></b></div>
                                            <div class="fenqi-status"><%= item.status_text %></div>
                                        </div>
                                    </div>
                                <% }); %>
                        </div>
                    </div>
                <% } else { %>
                    <% var status_text = [ '','审核中，审核通过并放款后开始计算利息。有疑问请联系客服：400-108-7667 ', '审核未通过，您暂时不符合申请条件。有疑问请联系客服：400-108-7667 ', '您的申请信息有误，请等待客服电话联系您核实后修改。有疑问请联系客服：400-108-7667 ','','','','','账单异常，请联系客服400-108-7667'] %>
                    <div class="order-data">
                    <div class="data-infor">
                        <% if (status_text[data.status]) { %>
                            <%= status_text[data.status]%>
                        <% } else { %>
                            暂无相关分期信息
                        <%} %>
                    </div>
                    </div>
                <% } %>
            </div>
            <div class="tab-content" id="order_data">
                <div class="order-data">
                    <% if (data.block_order) { %>
                        <div class="data-infor">
                            <div class="data-info"><span>商品信息:</span><%= data.block_order.product_title %></div>
                            <div class="data-info"><span>收 件 人:</span><%= data.block_order.target_name %></div>
                            <div class="data-info"><span>联系电话:</span><%= data.block_order.target_phone %></div>
                            <div class="data-info"><span>收货地址:</span><%= data.block_order.target_address %></div>
                        </div>
                        <% if(data.block_order.ship_list) { %>
                            <div class="data-log">
                                <% data.block_order.ship_list.forEach(function (item) { %>
                                    <div class="log-item">
                                        <%= item.description %><span> <%= item.time_str %> </span>
                                    </div>
                                <% }) %>
                            </div>
                        <% } %>
                    <% } %>
                </div>
            </div>
        </div>
    </div>
</section>
<% } %>