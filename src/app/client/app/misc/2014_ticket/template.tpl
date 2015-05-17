<%
    var today = new Date();
    today = new Date([
        today.getFullYear(),
        today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1,
        today.getDate()
    ].join('-'));
%>
<!-- header -->
<header>
    <div class="winner-wrap">
        <div class="winner-con"><%= data.theWinners %></div>
    </div>
    <img src="http://sta.ganjistatic1.com/att/project/app/ticket/img/banner.jpg" class="h-banner">
</header>
<!-- /header -->
<!--拼车-->
<% if ((appVersion[0] >= 5 && appVersion[1] > 8) || appVersion[0] > 5) { %>
<section class="sect-rop">
    <div class="tit-wrap">
        <h2>拼车，任性到家</h2>
    </div>
    <div class="carpool-info">
        <div class="carpool-txt">已有<b><%= data.carSharingCount %>+</b>人参加了拼车行动</div>
        <% if (appId === '705' || appId === '801') { %>
        <a class="bt-carpool" href="javascript: void(0);"
            data-widget="app/client/app/misc/2014_ticket/index.js#link"
            data-url='<%= data.buyTicket.carSharing %>'
            data-type="nativeview"
            data-gjalog="100000000113000100000010"
        >马上拼车</a>
        <% } else { %>
        <div>点击赶集生活首页【拼车】按钮，速速加入</div>
        <a class="bt-carpool" href="javascript: void(0);"
            href="javascript: void(0);"
            data-widget="app/client/app/misc/2014_ticket/index.js#link"
            data-url="<%= appUrl %>"
            data-type="webview"
            data-gjalog="100000000121000100000010">快来赶集！过年回家"拼起来" &gt;&gt;</a>
        <% } %>
    </div>
    <% if (appId === '705' || appId === '801') { %>
    <a class="bt-invite" href="javascript:;"
        data-widget="app/client/app/misc/2014_ticket/index.js#share"
    >邀请好友参加“万人拼车”</a>
    <% } %>
</section>
<% } %>
<!--抢票-->
<section>
    <div class="tit-wrap rob-wrap">
        <h2> 抢票，妥妥到家</h2>
    </div>
    <div class="date-box">
        <% if (appId !== '705' && appId !== '801') { %>
        <a class="bt-carpool" href="javascript: void(0);"
            data-widget="app/client/app/misc/2014_ticket/index.js#weixinShare"
            data-gjalog="100000000122000100000010"
        >告诉小伙伴，可以赢免单</a>
        <% } %>
        <div class="now-date">
            <span>今日</span>
            <p><%= data.todayTicket.gregorianCalendar %></p>
            <span><%= data.todayTicket.weekday %></span>
        </div>
        <!-- buy-date -->
        <div class="buy-date">
            <p>
                <span class="s1">电话，网络购票：</span>
                <span><%= data.todayTicket.ticketSite.gregorianCalendar %> <%= data.todayTicket.ticketSite.lunarCalendar %></span>
            </p>
            <p>
                <span class="s1">车站代售点购票：</span>
                <span><%= data.todayTicket.ticketAgent.gregorianCalendar %> <%= data.todayTicket.ticketAgent.lunarCalendar %></span>
            </p>
        </div>
        <% if (appId === '705' || appId === '801') { %>
        <!-- /buy-date -->
        <div class="remind-wrap" id="notify-btn">
            <a class="bt-carpool" href="javascript: void(0);"
                data-gjalog="100000000114000100000010"
            >设置抢票提醒</a>
            <span>开抢前一天和当天两次提醒</span>
        </div>
        <% } %>
    </div>
</section>
<!--日历-->
<section class="kalendar">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="kalendar-tab">
        <caption align="top">2014年12月</caption>
        <tbody>
            <tr>
                <th>日</th>
                <th>一</th>
                <th>二</th>
                <th>三</th>
                <th>四</th>
                <th>五</th>
                <th>六</th>
            </tr>
            <% dec.forEach(function (week, i) { %>
            <tr>
                <% week.forEach(function (day) { %>
                    <% var date = new Date(day.date); %>
                    <td
                        <% if (today.getTime() > date.getTime()) { %>
                        class="disabled"
                        <% } else if (today.getTime() === date.getTime()) { %>
                        class="active"
                        <% } else if (date.getDate() === 21) { %>
                        class="new-year"
                        <% } %>
                    >
                        <% if (day.date) { %>
                        <%= date.getDate() %><span>抢<%= day.for %></span>
                        <% } else { %>
                        &nbsp;
                        <% } %>
                    </td>
                <% }) %>
            </tr>
            <% }) %>
    </tbody></table>
</section>
<section class="sect-rop">
    <ul class="ticket-type">
        <li class="type-train"
            data-widget="app/client/app/misc/2014_ticket/index.js#link"
            data-url="<%= data.buyTicket.train %>"
            data-title="坐火车回家"
            data-type="webview"
            data-gjalog="100000000117000100000010"
        ><a class="" href="javascript: void(0);"><i class="icon-t-train">购买火车票</i></a></li>
        <li class="type-vehicle"
            data-widget="app/client/app/misc/2014_ticket/index.js#link"
            data-url="<%= data.buyTicket.car %>"
            data-title="坐汽车回家"
            data-type="webview"
            data-gjalog="100000000118000100000010"
        ><a class="" href="javascript: void(0);"><i class="icon-t-vehicle">购买汽车票</i></a></li>
        <li class="type-plain"
            data-widget="app/client/app/misc/2014_ticket/index.js#link"
            data-url="<%= data.buyTicket.airplane %>"
            data-title="坐飞机回家"
            data-type="webview"
            data-gjalog="100000000119000100000010"
        ><a class="" href="javascript: void(0);"><i class="icon-t-plain">购买飞机票</i></a></li>
    </ul>
</section>
<% if ((appId === '705' || appId === '801') && appVersion[0] <= 5 && appVersion[1] <= 8) { %>
<section class="sect-rop">
    <div class="tit-wrap rob-wrap">
        <h2>拼车，任性到家</h2>
    </div>
    <div class="carpool-info">
        <div class="carpool-txt">已有<b><%= data.carSharingCount %>+</b>人参加了拼车行动</div>
        <div class="carpool-txt2">万人行动，春运拼了</div>
        <div>点击赶集生活首页【拼车】按钮，速速加入</div>
    </div>
    <a class="bt-invite" href="javascript: void(0);"
        data-widget="app/client/app/misc/2014_ticket/index.js#share"
    >邀请好友参加“万人拼车”</a>
</section>
<% } %>
<% if (appId === '705' || appId === '801') { %>
<!-- 订票攻略 -->
<section class="part-box order-plan">
    <div class="tit-wrap rob-wrap">
        <h2>春运要知道</h2>
    </div>
    <ul>
        <% posts.forEach(function (post) { %>
            <li
                data-widget="app/client/app/misc/2014_ticket/index.js#link"
                data-url="<%= post.h5url %>"
                data-type="webview"
            ><a href="javascript: void(0);"><%= post.title %><i>&gt;</i></a></li>
        <% }) %>
    </ul>
</section>
<!-- /订票攻略 -->
<a class="bt-invite bt-share" href="javascript: void(0);"
    data-widget="app/client/app/misc/2014_ticket/index.js#share"
>别拦我，我要把这等好事分享给大家</a>
<% } else { %>
<section class="ticket-footer">
    <a class="bt-carpool" href="javascript: void(0);"
        data-widget="app/client/app/misc/2014_ticket/index.js#link"
        data-url="<%= appUrl %>"
        data-type="webview"
        data-gjalog="100000000121000100000010">快来赶集设置开抢提醒，抢票快人一步!</a>
    <a class="ganji-logo" href="http://3g.ganji.com/"></a>
</section>
<% } %>
<div class="pop-wrap"
    id="share-popup"
    data-widget="app/client/app/misc/2014_ticket/index.js#sharePopup"
>
    <div class="share-guide"></div>
</div>
<div class="pop-wrap"
    id="success-popup"
    data-widget="app/client/app/misc/2014_ticket/index.js#successPopup"
>
    <div class="remind-ok">
        <i class="bt-close" data-role="close"></i>
        <div class="remind-ok-tit">设置提醒成功</div>
        <div class="remind-ok-txt">
            <% if (Math.random() > 0.5) { %>
            黄半仙掐指一算，点击分享<br>抢票成功率翻 10 倍哦~
            <% } else { %>
            去年小红分享了，回家过年了；<br>小明没分享，至今两年没回家过年。
            <% } %>
        </div>
        <a class="bt-carpool" href="javascript: void(0);"
            data-role="shareBtn"
            data-widget="app/client/app/misc/2014_ticket/index.js#share"
        >分享</a>
    </div>
</div>
<div class="pop-wrap"
    id="cal-popup"
    data-widget="app/client/app/misc/2014_ticket/index.js#calPopup"
>
    <section class="kalendar kalendar-share">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="kalendar-tab pop-tab">
            <caption align="top">
                <span>2015年2月</span>设置提醒<b>（选择出发日期）</b>
                <i class="bt-close" data-role="close"></i>
            </caption>
            <tbody>
            <tr>
                <th>一</th>
                <th>二</th>
                <th>三</th>
                <th>四</th>
                <th>五</th>
                <th>六</th>
                <th>日</th>
            <tr>
            <% feb.forEach(function (week, i) { %>
            <tr>
                <% week.forEach(function (day) { %>
                    <% var date = new Date(day.date); %>
                    <td
                        <% if ([
                            '2015-01-26',
                            '2015-01-27',
                            '2015-01-28',
                            '2015-01-29',
                            '2015-01-30',
                            '2015-01-31',
                            '2015-03-01'
                        ].indexOf(day.date) !== -1) { %>
                        class="disabled"
                        <% } else if (data.setRemind.indexOf(day.date) !== -1) { %>
                        class="active"
                        <% } else if (date >= new Date('2015-02-16') &&
                            date <= new Date('2015-02-21')) {
                        %>
                        class="new-year"
                        <% } %>
                        data-role="date"
                        data-date="<%= day.date %>"
                    >
                        <% if (day.date) { %>
                        <%= date.getDate() %><span><%= day.lunar %></span>
                        <% } else { %>
                        &nbsp;
                        <% } %>
                    </td>
                <% }) %>
            </tr>
            <% }) %>
        </tbody></table>
    </section>
</div>