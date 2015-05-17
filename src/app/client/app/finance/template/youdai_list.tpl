<!-- section start -->
<section class="order">
    <h2 class="heading">我的贷款</h2>
    <div class="order-list">
        <% $.each(listData, function(i, item) { %>
        <div class="order-item">
            <div class="order-title"><span><%= item.loan_type_name %></span><span><b><%= item.loan_money %></b>万元</span><span><%= item.loan_month %>个月</span></div>
            <div class="order-value"><span>姓名:<%= item.name %></span><span>手机:<%= item.phone %></span></div>
            <div class="order-box">
                <div class="order-state"><%= item.list_status_name %></div>
                <div class="order-info"><%= item.list_time %></div>
            </div>
        </div>
        <% }) %>
    </div>
    <div class="page" data-widget="app/client/app/finance/widget/loan.js#goUrl">
        <% if( page && page - 0 !== 1) { %>
        <a href="javascript:;" class="page-item page-prev" data-role="toUrl" data-url="app/client/app/finance/controller/youdai_list.js?page=<%= (page-1) %>">上一页</a>
        <% } %>
        <% if(listData.length >= 15) { %>
        <a href="javascript:;" class="page-item page-next" data-role="toUrl" data-url="app/client/app/finance/controller/youdai_list.js?page=<%= (page+1) %>">下一页</a>
        <% } %>
    </div>
</section>