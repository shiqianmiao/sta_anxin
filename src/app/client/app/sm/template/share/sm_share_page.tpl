<section class="share">
    <%if (data) {%>
    <div class="content">
        <div class="content-image">
        <% if (data.imgUrl) { %>
            <img src="<%= data.imgUrl %>" alt="">
        <% } else { %>
            <img src="http://sta.ganjistatic1.com/src/image/mobile/app/LV_Mall/cover_01.jpg" alt="">
        <% } %>
        </div>
        <div class="content-ds">
            Ta在赶集积分商城兑换了<b><%= data.product_name %></b>，很容易哦，你也来试试~
        </div>
    </div>
    <div class="blank"></div>
    <% } %>
    <div class="guide">
        <div class="guide-ds">赶集积分商城，轻轻松松赚积分，变身高富帅~</div>
        <div class="guide-image"><img src="http://sta.ganjistatic1.com/src/image/mobile/app/LV_Mall/guide.png" alt=""></div>
    </div>
    <div class="download">
        <a href="http://wap.ganji.com/wdnow.php?ignoreUA=0&pr=1&ca_name=wap_yunying_qunzu" class="btn btn-primary">下载赶集生活</a>
        <div class="download-ds">即刻兑奖变土豪</div>
    </div>
</section>
