<!-- http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/sm/view/index_page.js -->
<!-- section start -->
<section class="index">
    <div class="user"
        data-widget="app/client/app/sm/view/index_page.js#user">
        <a data-role="userInfo" href="javascript:;" class="user-info">
            <div class="user-avatar"><img src="http://sta.ganjistatic1.com/src/image/mobile/app/LV_Mall/avatar.png" alt=""></div>
            <div class="user-name">登录</div>
        </a>
        <div class="user-option">
            <div class="mod-list">
                <div data-role="earnPoint" class="list-item">
                    <a href="javascript:;" class="list-cont option1"><i class="icon icon-rmb"></i>赚积分</a>
                </div>
                <div data-role="myPrize" class="list-item">
                    <a href="javascript:;" class="list-cont option2"><i class="icon icon-gift"></i>我的奖品</a>
                </div>
            </div>
            <div class="mod-banner">
                <a href="javascript:;"
                    data-evlog="mod_banner"
                    data-native-a='#app/client/app/misc/new_choujiang/view/index_page.js'>
                    <img src="http://m.ganjistatic1.com/d502ac816aa722730ca38707bb3cf622/banner_yqs1.jpg" alt="">
                </a>
            </div>
        </div>
    </div>
    <div class="blank"></div>
    <div class="category">
        <div class="mod-column">
            <div class="column-head">
                <h2 class="column-title"><i class="icon icon-gift-sm"></i>兑奖品</h2>
                <div class="column-ds" data-widget="app/client/app/sm/view/index_page.js#productNews"></div>
            </div>
            <div class="column-body">
                <div data-widget="app/client/app/sm/view/index_page.js#bannerList">
                </div>
                <div class="mod-list">
                    <% if (list) { %>
                    <% var tagMap = ['','特惠','秒杀','限时','抽奖']; %>
                    <% list.forEach(function (item) { %>
                        <div class="list-item" data-product-id="<%= item.user_id%>">
                            <a href="javascript:;"
                                data-native-a='#<%= list.detailPageLink %>?product_id=<%= item.id %>&clock_code=<%= item.clockCode %>&time_str=<%= item.timeStr %>&end_str=<%= item.endStr %>'
                                class="list-cont">
                                <div class="list-image"><img src="<%= item.img_url%>" alt=""></div>
                                <h3 class="list-title"><%= item.name %></h3>
                                <div class="list-value">
                                    <b><%= item.price %></b>积分
                                    <% if (item.icon_tag) { %>
                                        <i class="icon-tag"><%= tagMap[item.icon_tag] %></i>
                                    <% } %>
                                </div>
                                <% if (item.clockCode) {%>
                                    <div class="list-info">
                                        <i class="icon icon-clock"></i>
                                        <% if (item.clockCode === 1004) {%>
                                            兑换时间：<%= item.timeStr %> ~ <%= item.endStr%>
                                        <% } else { %>
                                            兑换时间：<%= item.timeStr %> 开始
                                        <% } %>
                                    </div>
                                <% } else { %>
                                    <% if ((item.remain) > 0) { %>
                                    <div class="list-info"> 剩余<%= item.remain %>件</div>
                                    <% } else { %>
                                    <div class="list-info">
                                        <i class="icon icon-clock"></i>今日已兑完，明日再来
                                    </div>
                                    <% } %>
                                <% } %>
                            </a>
                        </div>
                    <% }) %>
                    <% } %>
                </div>
            </div>
        </div>
    </div>
    <div data-widget="app/client/app/sm/view/index_page.js#hotProductList"
        data-type="hot"
        style="display: none;">
        <div class="blank"></div>
        <div class="topic">
            <div class="mod-column">
                <div class="column-head">
                    <h2 class="column-title"><i class="icon icon-fire"></i>正在热抢</h2>
                </div>
                <div class="column-body"
                    data-widget="com/mobile/widget/marquee.js"
                    data-direction="X"
                    data-gap="5"
                    data-is-pause="true"
                    data-item-name="div[data-role='item']">
                    <div class="mod-list"
                        data-role="scrollWrap">
                        暂无
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- section end -->
<!-- footer start -->
<footer class="footer" >
    <% if ($.os.ios) { %>
        <p class="copyright">本活动由赶集网提供，与设备生产商Apple Inc.公司无关</p>
    <% } else { %>
        <p class="copyright">本活动由赶集网官方主办</p>
    <% } %>
</footer>
<!-- footer end -->
<!-- popup end -->