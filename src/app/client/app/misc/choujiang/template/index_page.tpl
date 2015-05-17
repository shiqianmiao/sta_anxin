<body>
    <!-- notice -->
    <section class="notice">
        <div class="notice-title">中奖进行时：</div>
        <div class="notice-wrap">
            <ul class="notice-list">
                <%if (data.winning_list) {%>
                    <% data.winning_list.forEach(function (item) { %>
                    <li><%= item %></li>
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
            <div class="tree <% if (parseInt(data.lottery_times) <=0) { %> static <% } %>"
                data-widget="app/client/app/misc/choujiang/view/index_page.js#lottery"
                data-sensitivity="15"
                data-count="<%= data.lottery_times %>"
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
        <div class="join-lottery" data-widget="app/client/app/misc/choujiang/view/index_page.js#info">
        <p><em>摇一摇</em>即抽奖，您还有<em id="count" data-count="<%= data.lottery_times %>"><%= data.lottery_times %></em>次机会</p>
            <% if (data.task_times > 0) { %>
                <button href="javascript:;" class="btn" data-gjalog="100000000232000100000010" data-role="participate">参与活动,获得摇奖机会</button>
             <% } else { %>
                <button href="javascript:;" class="btn" disabled="disabled">参与活动,获得摇奖机会</button>
             <% } %>
            <div class="handle">
                <a href="javascript:;" data-role="info" class="fl">如何参与？</a>
                <a href="javascript:;" data-role="prize" class="fr">查看我的奖品</a>
            </div>

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
                    <li style="margin-left: 0px;">
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/p1.jpg" width="84" alt="">
                            <span>10台</span>
                        </li><li style="margin-left: 0px;">
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/p2.jpg" width="84" alt="">
                            <span>1000张</span>
                        </li><li style="margin-left: 0px;">
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/p7.jpg" width="84" alt="">
                            <span>5000张</span>
                        </li><li style="margin-left: 0px;">
                            <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/p6.jpg" width="84" alt="">
                            <span>不限量</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- /图片滚动 -->
        </div>
        <!-- /参与抽奖 -->

        <!-- 群主福利 -->
        <div class="group-fuli">
            <div class="tit"></div>
            <div class="group-box" data-widget="app/client/app/misc/choujiang/view/index_page.js#getPrize">
                <div class="part">
                    <p class="tit2">一重礼</p>
                    <p>条件：活动期间您的任意群组中新增  人数>=5人</p>
                    <p>福利：有机会获得百元京东购物卡 共50份</p>
                    <% if (data.benefits_status['1']) { %>
                        <button data-tag="1" disabled="disabled" class="btn"> 报名成功 </button>
                     <% } else { %>
                        <button data-role="part" data-tag="1" data-gjalog="100000000232000200000010" class="btn"> 我要购物卡 </button>
                     <% } %>
                </div>
                <div class="part">
                    <p class="tit2">二重礼</p>
                    <p>条件：活动期间您的任意群组中新增  人数>=10人</p>
                    <p>福利：有机会获得iPhone 6手机一部，共3台</p>
                    <% if (data.benefits_status['2']) { %>
                        <button data-tag="2" disabled="disabled" class="btn"> 报名成功 </button>
                     <% } else { %>
                        <button data-role="part" data-gjalog="100000000232000300000010" data-tag="2" class="btn"> 我要iphone </button>
                     <% } %>
                </div>
            </div>
        </div>
        <!-- /群主福利 -->

        <!-- 其他小技巧 -->
        <div class="skill-box">
            <div class="other-box">
                <div class="part">
                    <p class="tit2">群主福利小技巧</p>
                    <p>
                        相信你有很多办法能拉人，我们也为你提供一个拉人小技巧<br>
                        <br> 1、进入群组消息页面
                        <br> 2、点击你担任群主的群组，并进入群资料页
                        <br> 3、点击群帐号，出现分享弹层
                        <br> 4、将群组信息分享给任一社交产品的好友即可
                    </p>
                </div>
                <div class="part">
                    <p class="tit2">群主福利规则</p>
                    <p>
                        群主专属福利活动规则：
                        <br /> 1、点击“我要购物卡”/“我要iphone”，即可成功报名本活动。
                        <br /> 2、达到一重礼/二重礼的抽奖条件，自动获得相对应的抽奖机会！两次抽奖机会可重叠！
                        活动截止时，系统会在拥有抽奖机会的用户中抽取幸运大奖！梦想还是要有的，万一中了呢！
                        <br /> 3、在活动结束10个工作日内，我们将公布获奖名单。所有奖品将在活动结束后20个工作日内发放完成，请您耐心等待。若因故延期，我们会提前通知您。
                        <br /> 4、在活动中，若发现作弊等违规行为我们将取消奖励或追回奖励并永久加入活动黑名单。
                        <br /> 5、活动时间：2015年3月26日-4月17日
                        <br /> 6、赶集网可根据活动实际情况，在法律允许范围内，对本活动规则和活动时间进行调整。赶集网对本活动拥有最终解释权。
                    </p>
                </div>
            </div>
        </div>
        <!-- /其他小技巧 -->

    </section>
    <!-- /main -->
    <!-- 弹层 -->
    <div id="participate" class="float-bg" data-widget="app/client/app/misc/choujiang/widget/base_page.js#alertPop">
        <div class="popup popup-box">
            <a href="javascript:;" data-role="close" class="close-btn"></a>
            <div class="content-box" data-wideget="app/client/app/misc/choujiang/view/index_page.js#toQunliao">
                <p class="tit-con" >点击“我要加群”进入群组页面，加入喜欢的群并发言，就能获得摇奖机会啦</p>
                <a href="javascript:;" data-key="toQunliao" data-role="confirm" data-gjalog="100000000232000500000010" class="btn">我要加群</a>
            </div>
        </div>
    </div>
    <div id="info" class="float-bg" data-widget="app/client/app/misc/choujiang/widget/base_page.js#alertPop">
        <div class="popup popup-rule">
            <a href="javascript:;" data-role="close" class="close-btn"></a>
            <div class="content-box">
                <div class="tit2">活动规则</div>

                <div class="rule-box">
                    <div>
                        <br> 1、活动期间，您每成功【加入一个群组并在该群组中发言】便可获得3次抽奖机会。点击下方【参与活动】按钮，赶紧加入你的群组吧！重复加群不算哟~
                        <br> 2、拿起手机摇一摇礼品树，随机掉落奖品！100%中奖！就是这么任性！
                        <br> 3、每天最多完成2次任务，即最多获得6次抽奖机会。活动期间最多完成10次任务，即最多获得30次抽奖机会。
                        <br> 4、实物奖品将在活动结束后20个工作日内发放完毕，请您耐心等待。若因故延期，我们会提前通知您。积分在24小时内会发放到您的账号。虚拟奖品请看详细额使用规则。
                        <br> 5、在活动中，若发现作弊等违规行为我们将取消奖励或追回奖励并永久加入活动黑名单。
                        <br> 6、活动时间：2015年3月26日-4月17日
                        <br> 7、赶集网可根据活动实际情况，在法律允许范围内，对本次活动规则和活动时间进行调整。赶集网对本活动拥有最终解释权。
                    </div>

                </div>
            </div>
        </div>
    </div>
    <div id="failPop" class="float-bg" data-widget="app/client/app/misc/choujiang/widget/base_page.js#alertPop">
        <div class="popup popup-box">
            <a href="javascript:;" data-role="close" class="close-btn"></a>
            <div class="content-box">
                <p class="tit-con">您还尚未成为群主，还在等什么，更多的小伙伴，还有专属福利送</p>
                <a href="javascript:;" data-role="confirm" data-gjalog="100000000232000400000010" data-key="toQunliao" class="btn">成为群主</a>
            </div>
        </div>
    </div>
    <div id="lottery" class="float-bg" data-widget="app/client/app/misc/choujiang/widget/base_page.js#alertPop">
        <div class="popup popup-prize">
            <a href="javascript:;" data-role="close" class="close-btn"></a>
            <div class="content-box" data-role="content">
                <p class="tit3">恭喜您获得iphone手机一部</p>
                <p class="tit-con">奖品说明：活动期间您的任意群组中新增人数>=10人福利将有机会获得iphone6,手机</p>
                <div class="prize-img">
                    <img src="http://stacdn201.ganjistatic1.com/att/project/touch/join_group/img/p1.png" width="82" alt="">
                </div>
                <a href="javascript:;" data-role="confirm" class="btn">填写地址</a>
            </div>
        </div>
    </div>
    <div id="successPop" class="float-bg" data-widget="app/client/app/misc/choujiang/widget/base_page.js#alertPop">
        <div class="popup popup-box">
            <a href="javascript:;"data-role="close" class="close-btn"></a>
            <div class="content-box">
                <p class="tit-con">恭喜您成功参与活动！</p>
                <a href="javascript:;" data-role="confirm" class="btn">确定</a>
            </div>
        </div>
    </div>
    <!-- /弹层 -->
<footer>
    赶集网—最全的生活分类信息网
</footer>