<% var i; %>
<section
    data-widget="app/client/app/xiche/pub_page/view/order_detail.js#detail"
    data-needs-info='<%= JSON.stringify(post) %>'
    data-needs-puid='<%= needsPuid %>'
>
    <header class="yxc-brand">
        <a class="arrow-wrapper" data-role="back">
            <i class="bt-brand-back"></i>
        </a>
        <span>订单详情</span>
    </header>
    <div class="content">
    <% if (post.needsStatus === '0') { %>
        <ul class="yxc-order-common yxc-order-detail">
            <li class="order2-status"><b class="order-status status-orange"><%= post.needsStatusText %></b></li>
            <li><i class="icon-style"></i><%= post.serviceName %></li>
            <li><i class="icon-date"></i><%= post.jobTime %></li>
            <li><i class="icon-zone"></i><p class="order-zone-con"><%= post.address %></p></li>
            <li><i class="icon-plate"></i><%= post.car_number %></li>
            <% if(post.washInterior) { %>
            <li><p class="order2-detail-e">内饰清洗: <%= post.washInterior %></p></li>
            <% } %>
        </ul>
        <div class="control-wrap">
            <a data-role="cancelNeedsBtn">取消订单</a>
            <a data-role="payBtn">立即付款</a>
        </div>
    <% } else { %>
        <% if (post.employeeInfo) { %>
            <div class="worker-info"
                data-role="employeeInfo"
                data-id="<%= post.employeeInfo.id %>"
            >
                <h3 class="worker-name"><%= post.employeeInfo.name %></h3>
                <span>
                <% for (i = 1; i <= 5; i ++ ) { %>
                    <% if (i <= post.employeeInfo.starLevel) { %>
                    <i class="icon-star active"></i>
                    <% } else { %>
                    <i class="icon-star"></i>
                    <% } %>
                <% } %>
                </span>
                服务了<span><%= post.employeeInfo.serviceNum %></span>次
                <p class="worker-tip">师傅会在预约时间内为您服务，请等待</p>
                <a href="javascript:void(0)" class="bt-contack"
                    data-role="phoneBtn"
                    data-phone="<%= post.employeeInfo.phone %>"
                ></a>
            </div>
        <% } %>
        <% if (post.needsStatus === '20') { %>
        <form class="fm-evaluate">
            <p class="fm-eval-top">
                评价师傅
                <span data-role="starWraper" class="star-wraper">
                    <i data-role="star" class="icon-star active"></i>
                    <i data-role="star" class="icon-star active"></i>
                    <i data-role="star" class="icon-star active"></i>
                    <i data-role="star" class="icon-star active"></i>
                    <i data-role="star" class="icon-star active"></i>
                </span>
                <input type="hidden" name="starInput" data-role="starInput" value="5">
            </p>
            <textarea data-role="commentText" class="fm-eveal-area" placeholder="给师傅一些建议或评价吧～"></textarea>
            <input name="" type="button" class="bt-sub-eveal" value="提交评价" data-role="submitCommentBtn">
        </form>
        <% } %>
        <ul class="yxc-progress">
        <% post.statusLine.reverse().forEach(function (item, index) { %>
            <li data-status="<%= item.needsStatus%>">
                <p class="progress-time"><%= item.time %></p>
                <p><%= item.prompt %></p>
            <% if (item.needsStatus === '15') { %>
                <p class="pregress-pic-top">洗车前照片</p>
            <% } else if (item.needsStatus === '20') { %>
                <p class="pregress-pic-top">洗车后照片</p>
            <% } %>
            <% if (item.images) { %>
                <div class="pregress-pic-wrap">
                    <p>
                        <% item.images.forEach(function (image) { %>
                        <img src="<%= image %>" data-role="image">
                        <% }) %>
                    </p>
                </div>
            <% } %>

            <% if (item.needsStatus === '210') { %>
                <p class="fm-eval-top">
                <% for (i = 1; i <= 5; i ++ ) { %>
                    <% if (i <= parseInt(item.commentInfo.starLevel)) { %>
                        <i class="icon-star active"></i>
                    <% } else { %>
                        <i class="icon-star"></i>
                    <% } %>
                <% } %>
                </p>
                <p><%= item.commentInfo.content %></p>
            <% } %>
                <span class="progress-status <%= index === 0 ? 'active' : '' %>"></span>
            </li>
        <% }) %>
        </ul>
    <% } %>
    <% if (post.employeeInfo) { %>
        <div class="pop-tel-wrap js-popup" data-role="phoneDialog" style="display: none">
            <div class="pop-tel-con">
                <p class="pop-tel-top">拨打电话</p>
                <p class="pop-tel-num"><%= post.employeeInfo.phone %></p>
                <p class="pop-tel-bt">
                    <span class="js-cancel">取消</span>
                    <span class="bt-dail">
                        <a href="tel:<%= post.employeeInfo.phone %>" data-role="confirmBtn">
                            拨打
                        </a>
                    </span>
                </p>
            </div>
        </div>
    <% } %>
        <div class="pop-tel-wrap js-popup" data-role="cancelOrderDialog" style="display: none">
            <div class="pop-tel-con pop-notel-con">
                <p class="pop-tel-top">确定要取消该订单吗？</p>
                <p class="pop-tel-bt">
                    <span class="js-cancel">取消</span>
                    <span class="bt-dail" data-role="confirmBtn">确定</span>
                </p>
            </div>
        </div>
        <div class="show-mask js-popup" data-role="bigImageDialog" style="display: none;">
        </div>
    </div>
</section>