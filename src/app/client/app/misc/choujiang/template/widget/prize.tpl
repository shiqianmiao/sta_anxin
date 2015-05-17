<p class="tit3">恭喜您获得的奖品为“<%= data.name %>”</p>
<div class="tit-con">奖品说明：<%= data.rules%></div>
<div class="prize-img">
    <img src="<%= data.img_url %>" width="82" alt="">
</div>
<a href="javascript:;" data-role="confirm" class="btn">
    <% if (data.product_type === '10') {%>填写地址<%} else{ %> 使用细则 <% } %>
</a>
