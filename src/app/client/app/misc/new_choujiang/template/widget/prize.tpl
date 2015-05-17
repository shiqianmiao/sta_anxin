<% if (data.lottery_product) { %>
    <% var lottery_product = data.lottery_product; %>
    <p class="tit3" style="text-align: center">恭喜您，摇中了 <%= lottery_product.name %>！</p>
    <% if (data.lottery_status === 1) { %>
        <div class="tit-con" style="text-align: center">领取后可在“我的奖品”中进行查看 <br></div>
    <% } %>
    <% if (lottery_product.img_url) { %>
        <div class="prize-img">
            <img src="<%= lottery_product.img_url %>" width="82" alt="">
        </div>
    <% } %>
    <a href="javascript:;" data-role="confirm" class="btn">
    领 取
    </a>
<% } %>
