<!-- section start -->
<section class="management" data-widget="app/client/app/finance/widget/loan.js#filterCase" data-filter-status="<%= filterStatus %>">
    <div class="filter" data-role="filter">
        <ul class="filter-nav">
            <li class="js-touch-state"><b><%= filterStatusText %></b></li>
        </ul>
        <div class="filter-cont" data-role="childSelect">
            <div class="filter-wrap" data-widget="app/client/app/finance/widget/template.js#initScroll">
                <ul class="filter-menu">
                    <li class="js-touch-state" data-status="0">全部订单</li>
                    <li class="js-touch-state" data-status="1">新订单</li>
                    <li class="js-touch-state" data-status="2">资质不符</li>
                    <li class="js-touch-state" data-status="3">无效电话</li>
                    <li class="js-touch-state" data-status="4">客户放弃</li>
                    <li class="js-touch-state" data-status="5">进件审批</li>
                    <li class="js-touch-state" data-status="6">审批被拒</li>
                    <li class="js-touch-state" data-status="7">审批通过</li>
                    <li class="js-touch-state" data-status="8">放款失败</li>
                    <li class="js-touch-state" data-status="9">放款成功</li>
                </ul>
            </div>
        </div>
        <div class="mask"></div>
    </div>
    <div class="case-list">
        <!-- loading start -->
        <div class="loading"><i class="icon-loading"></i>努力刷新中...</div>
        <!-- loading end -->
        <% if(listData.length) { %>
        <% $.each(listData, function(i, item) { %>
            <div class="case-item" data-role="items">
                <a href="javascript:;" class="case-cont" data-case-id="<%= item.case_id %>">
                    <h2 class="title"><%= item.name %>(<%= item.loan_money %>万元/<%= item.loan_month %>个月)</h2>
                    <% $.each(item.template_name, function(k, v) { %>
                    <div class="type"><%= v %></div>
                    <% }) %>
                    <% if(item.isHot) { %>
                    <div class="type"><i class="icon icon-hot"></i>热门推广</div>
                    <% } %>
                    <div class="status <% if(item.isNew) { %>status-new <% } %>"><%= item.label_text %></div>
                </a>
                <a href="tel:<%= item.mobile %>" class="case-contact btn btn-primary active"><i class="icon icon-tel"></i>电话联系</a>
            </div>
        <% }) %>
        <% } else { %>
        <div class="case-item" style="text-align:center;">暂无订单</div>
        <% } %>
    </div>
</section>
<!-- section end -->
<!-- footbar start -->
<div class="footbar">
    <nav class="nav flex-nav" data-widget="app/client/app/finance/widget/loan.js#goUrl">
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/my_template.js" class="nav-item">
            <i class="icon icon-mold"></i>我的模版
        </a>
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/case_list.js" class="nav-item">
            <i class="icon icon-cart"></i>例子市场<b data-widget="app/client/app/finance/widget/loan.js#newListNum" data-user-id=<%= user_id %> class="msg hidden">8</b>
        </a>
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/manage_list.js" class="nav-item active">
            <i class="icon icon-business-card"></i>客户管理
        </a>
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/vip.js" class="nav-item">
            <i class="icon icon-avatar"></i>个人中心
        </a>
    </nav>
</div>
<!-- footbar end -->