<section class="order-list-section">
    <header class="yxc-brand">
        <a class="arrow-wrapper"
            data-widget="app/client/app/xiche/pub_page/widget/widget#link"
            data-url="app/client/app/xiche/pub_page/view/profile.js"
        >
            <i class="bt-brand-back"></i>
        </a>
        <span>订单中心</span>
    </header>
    <div class="yxc-order-list content"
        data-widget="app/client/app/xiche/pub_page/view/order_list.js#list"
        data-user-id="<%= userId %>"
    >
        <div data-role="list" style="margin: 0 0 52px 0;">

        </div>
        <a href="javascript:void(0)" data-role="loadMoreBtn" class="bt-order-more">查看更多</a>
        <div class="pop-tel-wrap js-popup" data-role="deleteOrderDialog" style="display: none">
            <div class="pop-tel-con pop-notel-con">
                <p class="pop-tel-top" data-role="deleteOrderDialogText">
                    订单已过期，是否删除订单？
                </p>
                <p class="pop-tel-bt">
                    <span class="js-cancel">取消</span>
                    <span class="bt-dail" data-role="confirmBtn">确定</span>
                </p>
            </div>
        </div>
    </div>
</section>