<li class="per-nurse">
    <div class="nurse-intr">
        <img src="<%= worker_info.head_url %>" class="head-pic">
        <div class="intr-info">
            <p><%= worker_info.worker_name %>　 护士</p>
            <p><em>好评率 <%= worker_info.praise%>%</em>　<span>￥<%= worker_info.price%></span></p>
        </div>
    </div>
    <a href="javascript:void(0);" class="select-btn borR-3" data-worker_id="<%= worker_info.worker_id%>" data-order_id="<%= worker_info.order_id%>">选择</a>
</li>