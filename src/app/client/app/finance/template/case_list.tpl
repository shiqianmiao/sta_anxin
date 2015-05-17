<!-- section start -->
<section class="case" data-widget="app/client/app/finance/widget/loan.js#pullRefresh" data-user-id="<%= user_id %>" data-timestamp="<%=timestamp %>">


    <div class="case-list" data-role="items" data-user-id="<%= user_id %>" data-widget="app/client/app/finance/widget/loan.js#weixinBuy">
        <!-- loading start -->

        <div class="loading top-loading" data-role="loading"><i class="icon-loading"></i><span>下拉即可刷新...</span></div>
        <!-- loading end -->
        <div data-role="before"></div>
        <% if(!case_list || !case_list.length) { %>
        <div data-role="nothing" class="page-status status-nothing">
            <div class="status-tips">客户都被其他信贷经理抢走了，过会再来看看吧！</div>
        </div>
        <% } %>
        <% $.each(case_list, function(index, item) {%>
        <div class="case-item">
            <a href="javascript::" data-price="<% if(item.isActive == 1){ %><%= item.active_price %><% } else { %><%= item.price %><% } %>" data-role="item" data-case-id="<%= item.case_id %>" class="case-cont <% if(item.isActive == 1){ %>sale<% } %> <% if(item.isRead == 1){ %>visited<% } %> <% if(item.case_status != 1){ %>disabled<% } %>">
                <h2 class="title"><span class="js-name"><%= item.name %></span>(<%= item.loan_money %>万元</span>/<%= item.loan_month %>个月)</h2>
                <div class="info"><span><%= item.loan_type %></span>  <span><%= item.age %>岁</span>  <span><%= item.salary %></span></div>
                <div class="info"><span><%= item.has_fang_che %></span>  <span><%= item.card_record %></span></div>
                <% $.each(item.template_name, function(k, v) { %>
                <div class="type"><%= v %></div>
                <% }) %>
                <% if(item.isHot) { %>
                <div class="type"><i class="icon icon-hot"></i>热门推广</div>
                <% } %>
                <div class="time"><i class="icon icon-sandglass"></i><span data-widget="app/client/app/finance/widget/loan.js#countdown" data-count="<%= item.count_time %>"></span></div>
                <% if(item.isActive == 1){ %>
                <div class="price-sale">庆生价:<%= item.active_price %>元</div>
                <% } %>
                <div class="price">(<span class="js-price"><%= item.price %></span>元)</div>
                <button type="button" class="btn js-touch-state" data-case-id="<%= item.case_id %>" data-role="buy" <% if(item.case_status != 1){ %>disabled="disabled"<% } else { %> <% } %>><%= item.btn_text %></button>
            </a>
            <a href="tel:<%= item.contact %>" class="case-contact btn btn-primary js-phone <% if(item.case_status == 2){ %>active<% } %>"><i class="icon icon-tel"></i>电话联系</a>
        </div>
        <% }) %>

        <div data-role="after"></div>
        <!-- loading start -->
        <div class="loading bottom-loading"><i class="icon-loading"></i><span>加载中...</span></div>
        <!-- loading end -->
    </div>
</section>
<!-- section end -->
<!-- footbar start -->
<div class="footbar">
    <nav class="nav flex-nav" data-widget="app/client/app/finance/widget/loan.js#goUrl">
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/my_template.js" class="nav-item">
            <i class="icon icon-mold"></i>我的模版
        </a>
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/case_list.js" class="nav-item active">
            <i class="icon icon-cart"></i>例子市场<b class="msg hidden">8</b>
        </a>
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/manage_list.js" class="nav-item">
            <i class="icon icon-business-card"></i>客户管理
        </a>
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/vip.js" class="nav-item">
            <i class="icon icon-avatar"></i>个人中心
        </a>
    </nav>
</div>
<!-- footbar end -->
<!-- bubble start -->
<div class="bubble">亲手慢了，例子已经被别人抢啦！</div>
<div class="bubble">认证还在审核中，请耐心等待。</div>
<div class="bubble">购买成功！</div>
<div class="bubble">抱歉，例子已被抢！</div>
<!-- bubble end -->
<!-- popup start -->
<div id="confirm" data-widget="app/client/app/finance/widget/loan.js#confirmPay">
    <div class="popup popup-confirm" data-role="pay" style="margin-top: -78px;">
        <div class="popup-head">
            <h2>提示</h2>
        </div>
        <div class="popup-body">
            <p>例子<span class="js-name">xxx</span>将消耗金额<span class="js-price"></span>元，确定购买？</p>
        </div>
        <div class="popup-bar">
            <a href="javascript:;" data-role="cancel">取消</a>
            <a href="javascript:;" data-role="confirm">确定购买</a>
        </div>
    </div>
    <div class="popup popup-confirm" data-role="chong" style="margin-top: -66px;">
        <div class="popup-head">
            <h2>提示</h2>
        </div>
        <div class="popup-body">
            <p>账户余额不足，请先去充值。</p>
        </div>
        <div class="popup-bar">
            <a href="javascript:;" data-role="cancel">取消</a>
            <a href="javascript:;" data-role="confirm">确定充值</a>
        </div>
    </div>
    <div class="popup popup-confirm" data-role="auth" style="margin-top: -66px;">
        <div class="popup-head">
            <h2>提示</h2>
        </div>
        <div class="popup-body">
            <p>用户未认证，请先去认证。</p>
        </div>
        <div class="popup-bar">
            <a href="javascript:;" data-role="cancel">随便逛逛</a>
            <a href="javascript:;" data-role="confirm">去认证</a>
        </div>
    </div>
    <div class="mask" data-role="mask"></div>
</div>