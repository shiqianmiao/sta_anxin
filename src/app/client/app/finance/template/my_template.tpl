<!-- section start -->
<section class="template" data-widget="app/client/app/finance/widget/template.js#myTemplate" data-user-id=<%= user_id %>>
    <% if(listArr.length) { %>
    <div class="push active" data-widget="app/client/app/finance/widget/loan.js#goUrl">
        <a href="javascript:;" data-role="toUrl" data-url="app/client/app/finance/controller/case_list.js" class="push-cont">例子正在源源不断的进来，先去例子市场逛逛吧！</a>
        <i class="icon icon-close" data-widget="app/client/app/finance/widget/template.js#close">关闭</i>
    </div>
    <div class="template-list">
        <% $.each(listArr, function(index, item) { %>
        <a href="###" class="template-item" data-role="item" data-id="<%= item.id %>">
            <h2 class="title"><%= item.name %></h2>
            <div class="type"><% if(item.xd_type + '' === '1') { %>个人贷 <% } else { %>企业贷<% } %></div>
            <div class="status"><% if(item.listing_status + '' === '5') { %>工作中，正在疯狂筛选客户 <% } else { %>休息中，随时待命<% } %></div>
            <div class="time"><%= item.time %> </div>
            <button class="btn btn-primary js-touch-state <% if(item.listing_status + '' === '5') { %>no-active<% } %>" data-active="<%= item.listing_status %>" data-role="toggleActive">
                <% if(item.listing_status + '' === '5') { %>取消应用<% } else { %>应用<% } %>
            </button>
        </a>
        <% }) %>
        <!-- <div class="form-tips">小贴士：默认只能添加三个模版，根据模版中的选项，设置对贷款人的要求，即可得到相应的例子。</div> -->
    </div>
    <% } %>
    <div class="template-add">
        <% if(listArr.length < 3) { %>
        <div class="form-opt">
            <button class="btn btn-primary btn-large js-touch-state" data-role="add">+添加模版</button>
        </div>
        <% } %>
        <div class="form-tips">小贴士：默认只能添加三个模版，根据模版中的选项，设置对贷款人的要求，即可得到相应的例子。</div>
    </div>
    <!-- popup start -->
    <div class="popup popup-filter" data-role="addWindow">
        <div class="filter-group">
            <div class="filter-head">
                <h2 class="filter-title">贷款类型</h2>
                <button class="filter-opt" data-role="cancel">取消</button>
            </div>
            <div class="filter-wrap">
                <ul class="filter-menu" data-widget="app/client/app/finance/widget/loan.js#goUrl">
                    <li class="js-touch-state" data-role="toUrl" data-url="app/client/app/finance/controller/add_template.js?type=1">个人贷款</li>
                    <li class="js-touch-state" data-role="toUrl" data-url="app/client/app/finance/controller/add_template.js?type=2">企业贷款</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="popup popup-confirm" data-role="useWindow" style="margin-top: -66px;">
        <div class="popup-head">
            <h2>提示</h2>
        </div>
        <div class="popup-body">
            <p>确定<span class="js-text">应用</span>此模版吗</p>
        </div>
        <div class="popup-bar">
            <a href="javascript:;" data-role="cancel">取消</a>
            <a href="javascript:;" data-role="confirmActive">确认</a>
        </div>
    </div>
    <div class="mask" id="mask" data-role="mask"></div>
</section>
<!-- section end -->
<!-- footbar start -->
<div class="footbar">
    <nav class="nav flex-nav" data-widget="app/client/app/finance/widget/loan.js#goUrl">
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/my_template.js" class="nav-item active">
            <i class="icon icon-mold"></i>我的模版
        </a>
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/case_list.js" class="nav-item">
            <i class="icon icon-cart"></i>例子市场<b data-widget="app/client/app/finance/widget/loan.js#newListNum" data-user-id=<%= user_id %> class="msg hidden">8</b>
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