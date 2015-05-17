<section class="application" data-widget="app/client/app/finance/fenqi/widget/fenqi.js#goUrl">
    <div class="form-deliver">
        <div class="deliver-body"><i class="icon icon-succeed"></i>申请已提交</div>
        <div class="deliver-tips">请耐心等待工作人员的审核，后续结果会在1个工作日内以短信通知您!</div>
    </div>
    <div class="order-group">
        <img src="http://image.ganjistatic1.com/<%= productDetail.cover %>" alt="" class="order-image">
        <div class="order-title"><%= productDetail.title %></div>
    </div>
    <div class="form-opt">
        <button class="btn btn-common btn-large js-touch-state" data-role="toUrl" data-url="app/client/app/finance/fenqi/controller/index_page.js"  type="button">回到首页</button>
        <button class="btn btn-primary btn-large js-touch-state" data-role="toUrl" data-url="app/client/app/fenqi/view/order_list.js" type="button">账单详情</button>
    </div>
</section>