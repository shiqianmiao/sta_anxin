<body>
    <!-- notice -->
    <section class="notice">
        <div class="notice-title">中奖进行时：</div>
        <div class="notice-wrap"
            data-widget="com/mobile/widget/marquee/marquee.js#normal"
           data-direction="left"
           data-speed="3000"
           data-gap="0"
           data-delay="1000"
           data-is-pause="false"
           data-animate-mode="linear">
            <ul class="notice-list">
                <%if (data.list) {%>
                    <% data.list.forEach(function (item) { %>
                    <li><%= item.user_name %> 获得 <%= item.product_name %></li>
                    <% }); %>
                <% } %>
            </ul>
        </div>
    </section>
    <!-- /notice -->

    <!-- header -->
    <header>
        <div class="head-tit"></div>
        <div class="floor">
            <!-- 默认轻晃 -->
            <!-- 手机摇动时 + active-->
            <!-- 摇动后 去掉active + static -->
            <div class="tree <% if (!data.times || parseInt(data.times.lottery_remain) <=0) { %> static <% } %>"
                data-widget="app/client/app/misc/new_choujiang/view/index_page.js#lottery"
                data-sensitivity="40"
                data-shake-abled="<%= data.user_id %>"
                data-count="<%= data.times && data.times.lottery_remain %>"
                >
                <div class="leaf"></div>
                <span class="gift1 animation giftDown"></span>
                <span class="gift2 animation giftDown"></span>
                <span class="gift3 animation giftDown"></span>
                <span class="gift4 animation giftDown"></span>
                <span class="gift5 animation giftDown"></span>
                <span class="gift6 animation giftDown"></span>
            </div>
        </div>
    </header>
    <!-- /header -->

    <!-- main -->
    <section class="main">
        <!-- 参与抽奖 -->
        <div class="join-lottery" data-widget="app/client/app/misc/new_choujiang/view/index_page.js#info">
            <% if (data.user_id) { %>
            <p>
                <em>摇一摇</em>即中奖，您还有<em id="count" data-count="<%= data.times && data.times.lottery_remain %>"><%= (data.times && data.times.lottery_remain) || 0 %></em>次机会
            </p>
            <% } else { %>
                <button href="javascript:;" class="btn" data-gjalog="100000000232000100000010" data-role="login">登录摇奖</button>
            <% } %>
            <div class="rule-lott"><span>规则：</span>每天可摇奖5次，首次0积分，之后每次消耗3积分</div>

            <!-- 图片滚动 -->
            <div class="scroll-wrap"
                   data-widget="com/mobile/widget/marquee/marquee.js#normal"
                   data-direction="left"
                   data-speed="1000"
                   data-gap="0"
                   data-delay="1000"
                   data-is-pause="false"
                   data-animate-mode="linear">
                <div class="scroll-box">
                    <ul>
                        <li>
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/p1.jpg" width="84" alt="">
                            <span>iPhone</span>
                        </li>
                        <li>
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/p2.jpg" width="84" alt="">
                            <span>京东购物卡</span>
                        </li>
                        <li>
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/yusan.jpg" width="84" alt="">
                            <span>赶集雨伞</span>
                        </li>
                        <li>
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/kouzhao.jpg" width="84" alt="">
                            <span>防雾霾口罩</span>
                        </li>
                        <li>
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/dianhuaka.jpg" width="84" alt="">
                            <span>呼应电话卡</span>
                        </li>
                        <li>
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/p6.jpg" width="84" alt="">
                            <span>商城积分</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- /图片滚动 -->
        </div>
        <!-- /参与抽奖 -->

        <!-- 群主福利 -->
        <div class="group-fuli">
            <div class="group-box">
                <div class="part">
                    <p class="tit2">如何参与</p>
                    <p>1、拿起手机在当前页面摇一摇，礼品树晃动后随机掉落奖品，100%中奖，就是这么任性！</p>
                    <p>2、每位用户每天可摇奖5次，首次0积分，之后将每次耗费3积分</p>
                    <p>3、摇到的积分会实时发放，实物奖品会在7个工作日内发放，请您耐心等待</p>
                    <p>4、作弊用户将取消活动资格，并加入活动黑名单</p>
                    <p>5、本活动最终解释权归赶集网所有</p>
                </div>

            </div>
        </div>
        <!-- /群主福利 -->
    </section>
    <!-- /main -->
    <!-- 弹层 -->
    <div id="errorPop" class="float-bg" data-widget="app/client/app/misc/new_choujiang/widget/base_page.js#alertPop">
        <div class="popup popup-box">
            <a href="javascript:;" data-role="close" class="close-btn"></a>
            <div class="content-box" data-wideget="app/client/app/misc/new_choujiang/view/index_page.js#toQunliao">
                <p class="tit-con" style="text-align: center" data-role="content">点击“我要加群”进入群组页面，加入喜欢的群并发言，就能获得摇奖机会啦
                </p>
                <div class="float-btn">
                    <a href="javascript:;" style="display: none;" data-role="confirm" data-gjalog="100000000232000500000010" class="btn">赚积分</a>
                    <a href="javascript:;" data-role="close" data-gjalog="100000000232000500000010" class="btn">知道了</a>
                </div>
            </div>
        </div>
    </div>
    <div id="info" class="float-bg" data-widget="app/client/app/misc/new_choujiang/widget/base_page.js#alertPop">
        <div class="popup popup-rule" style="height: 100px">
            <a href="javascript:;" data-role="close" class="close-btn"></a>
            <div class="content-box">
                <div class="tit2">温馨提示</div>

                <div style="height: 100px">
                    <div data-role="content">
                        每天可参与5次摇奖，首次免费哦，之后每次需消耗3积分
                    </div>
                    <a href="javascript:;" data-role="close" data-gjalog="100000000232000500000010" class="btn">知道了</a>
                </div>
            </div>
        </div>
    </div>
    <div id="lottery" class="float-bg" data-widget="app/client/app/misc/new_choujiang/widget/base_page.js#alertPop">
        <div class="popup popup-prize">
            <a href="javascript:;" data-role="close" class="close-btn"></a>
            <div class="content-box" data-role="content">

            </div>
        </div>
    </div>
    <!-- /弹层 -->
<footer>
    本活动由赶集网官方主办
</footer>