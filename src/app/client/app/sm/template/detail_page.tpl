<!-- 商品明细 -->
<!-- http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/sm/view/detail_page.js -->
<!-- section start -->
<section class="detail">
    <div class="content"
        data-widget="app/client/app/sm/view/detail_page.js#exchange"
        data-product-id ="<%= data.id%>"
        data-product-type ="<%= data.product_type%>"
        data-product-name ="<%= data.name %>"
        data-refer="#confirmPop"
        data-price="<%= data.price %>"
        data-tip-refer="#alertPop">
        <% var rest = data.remain %>
        <div class="content-image"><img src="<%= data.detail_img_url %>" ></div>
        <h3 class="content-title"><%= data.name %></h3>
        <div class="content-value"><span>兑换价</span><b ><%= data.price %></b>积分</div>
        <div class="content-info">剩余 <span data-role="rest"><%= rest < 0 ? 0 : rest %></span> 件</div>
        <div class="content-info">总量 <%= data.day_limit %>件</div>
        <% if (data.clock_code) {%>
            <% if (data.clock_code === 1001 || data.clock_code === 1003) {%>
                <div class="content-opt">
                    <button type="button" class="btn btn-primary btn-large js-touch-state" disabled="">
                        <%= data.time_str %> 开始兑换
                    </button>
                </div>
            <% } else if (data.clock_code === 1004) { %>
                <div class="content-opt">
                    <button type="button" class="btn btn-primary btn-large js-touch-state" disabled="">
                        兑换时间 <%= data.time_str %> ～ <%= data.end_str %>
                    </button>
                </div>
            <% } else {%>
                <div class="content-opt">
                    <button data-role="btn" type="button" class="btn btn-primary btn-large js-touch-state">
                    兑换
                    </button>
                </div>
            <% } %>
        <% } else if(rest > 0) { %>
            <div class="content-opt">
                <button data-role="btn" type="button" class="btn btn-primary btn-large js-touch-state">
                兑换
                </button>
            </div>
        <% } else { %>
            <div class="content-opt">
                <button type="button" class="btn btn-primary btn-large js-touch-state" disabled="">今日奖品已兑完，明日再来</button>
            </div>
        <% } %>
    </div>
    <div class="blank"></div>
    <div class="summary">
        <div class="mod-column">
            <div class="column-head">
                <h2 class="column-title">奖品详情</h2>
            </div>
            <div class="column-body">
                <p><%= data.discribe %></p>
            </div>
        </div>
        <div class="mod-column">
            <div class="column-head">
                <h2 class="column-title">兑换规则</h2>
            </div>
            <div class="column-body">
                <p><%= data.rules %></p>
            </div>
        </div>
        <% if (data.other_discribe) { %>
            <div class="mod-column">
                <div class="column-head">
                    <h2 class="column-title">其他说明</h2>
                </div>
                <div class="column-body">
                    <p><%= data.other_discribe %></p>
                </div>
            </div>
        <% } %>
    </div>
</section>
<!-- section end -->
<!-- popup start -->
<div id="confirmPop" class="popup popup-confirm" style="margin-top: -75px;"
    data-widget="com/mobile/widget/pop_up_window.js#confirmPop"
    data-refer="">
    <div class="popup-head">
        <h2>提示</h2>
    </div>
    <div class="popup-body" data-role="content">
        <p>本次兑换将消耗<%= data.price %>积分，</p>
        <p>是否确认兑换？</p>
    </div>
    <div class="popup-bar">
        <a href="javascript:;" data-role="cancel" class="btn">取消</a>
        <a href="javascript:;" data-role="confirm" class="btn btn-primary" data-evlog="exchange">兑换</a>
    </div>
</div>

<div id="alertPop" class="popup popup-confirm" style="margin-top: -118px;"
    data-widget="com/mobile/widget/pop_up_window.js#alertPop">
    <div class="popup-head">
        <h2 data-role="title">提示</h2>
    </div>
    <div class="popup-body" data-role="content">
        <p>积分不足，无法兑换</p>
        <small>多赚点积分再来领我走吧</small>
    </div>
    <div class="popup-bar vertical">
        <a class="btn btn-primary" data-native-a="#app/client/app/sm/view/task/task_page.js" href="javascript:;" data-role="confirm" data-evlog="exchange_fail_lack_0">赚取积分</a>
        <a href="javascript:;" data-role="confirm" data-native-a="#app/client/app/sm/view/index_page.js" data-evlog="exchange_fail_lack_1" class="btn">返回商城</a>
        <a data-role="confirm" href="javascript:;" class="btn">知道了</a>
    </div>
</div>
<div id="errorPop" class="popup popup-confirm" style="margin-top: -118px;"
    data-widget="com/mobile/widget/pop_up_window.js#alertPop">
    <div class="popup-head">
        <h2 data-role="title">提示</h2>
    </div>
    <div class="popup-body" data-role="content">
        <p>不符合兑换规则，无法兑换</p>
        <small>可在奖品详情兑换规则中查看</small>
    </div>
    <div class="popup-bar vertical">
        <a data-role="confirm" href="javascript:;" class="btn">知道了</a>
    </div>
</div>
<div id="mask" class="mask"></div>
<!-- popup end -->

