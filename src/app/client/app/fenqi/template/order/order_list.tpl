<% if(data) { %>
<!-- section start -->
<header class="yxc-brand">
    <a class="arrow-wrapper" onclick="history.go(-1)">
        <i class="bt-brand-back"></i>
    </a>
    <span>我的账单</span>
</header>

        <section class="order">
            <div class="order-list">
                    <% var stateClasses = ['','status-fail-edit','status-fail-over','status-fail-edit','status-pass-doing','status-pass-doing','status-fail-over','status-fail-over','status-fail-over', 'status-fail-edit'] %>
                    <% data.forEach(function (item) { %>
                        <div class="order-item <% if ( item.status && ',2,3,6,7,8'.indexOf(item.status) > 0 ) { %> grayscale <% } %>" >
                                <% var target_url = 'app/client/app/fenqi/view/order_detail.js'; %>
                                <% if (item.status === '3') { %>
                                    <% target_url = 'app/client/app/finance/fenqi/controller/apply.js' %>
                                <% } %>
                                <a href="http://sta.ganji.com/ng/app/client/common/index.html?&redirect=true#<%= target_url %>?apply_no=<%=item.apply_no %>"
                                data-native-a="<%= target_url %>?apply_no=<%=item.apply_no %>" class="order-infor">
                                <div class="order-status <%= stateClasses[item.status] %>">
                                    <%= item.status_text %>
                                </div>
                                <div class="order-info">
                                    <span>账单号:</span><span><%= item.apply_id %></span>
                                </div>
                                <% if (item.repayment_time) { %>
                                    <div class="order-info">
                                        <span>账单日期:</span><%= item.repayment_time %>
                                    </div>
                                <% } %>
                                <% if (item.status_message) { %>
                                    <div class="order-info"><%= item.status_message%></div>
                                <% } %>
                                <div class="order-info">
                                    <span>商品信息:</span><%= item.product_tag %>
                                </div>
                                <div class="order-info row">
                                    <div class="col-6">
                                        <span>总金额:</span>￥<%= item.repayment_amount %>
                                    </div>
                                    <div class="col-6">
                                        <% if (!!(parseInt(item.repayment_left, 10))) { %>
                                            <span>剩余还款:</span><b>￥</b><strong><%= item.repayment_left %></strong>
                                        <% } %>
                                    </div>
                                </div>
                                <% if (!!(item.repayment_day_count)){ %>
                                <div class="order-info">
                                    <span>距下期还款:</span><b><%= item.repayment_day_count %></b><span>天</span>
                                </div>
                                <% } %>
                            </a>
                        </div>
                    <% }) %>
            </div>
        </section>
<% } else { %>
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
<% } %>

        <!-- section end -->
