<!-- section start -->
<section class="personal">
    <div class="history">
        <div class="history-list" data-user-id="<%= user_id %>" data-widget="app/client/app/finance/widget/loan.js#loadChargeLog">
            <% if(moneyLog.length) { %>
            <% $.each(moneyLog, function(i, item) { %>
                <div class="history-item">
                    <h3 class="history-title"><%= item.category %></h3>
                    <div class="history-value"><b class="<%= item.className %>"><%= item.money %></b>元</div>
                    <div class="history-info"><%= item.create_time %></div>
                </div>
            <% }) %>
            <% } else { %>
                 <div class="history-item">暂无充值、消费记录</div>
            <% } %>
        </div>
    </div>
</section>
<!-- section end -->