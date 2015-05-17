<!-- section start -->
<section class="case">
    <div class="case-detail">
        <div class="case-cont <% if(detailInfo.isActive == 1){ %>sale<% } %>">
            <h2 class="title"><%= detailInfo.name %></h2>
            <% if(detailInfo.case_status - 0 === 1) { %>
            <div class="time"><i class="icon icon-sandglass"></i><span>剩余时间:</span><span data-widget="app/client/app/finance/widget/loan.js#countdown" data-count="<%= detailInfo.count_time %>"></span></div>
            <% } %>
            <div class="price"><span>例子售价:</span><%= detailInfo.price %>元</div>
            <% if(detailInfo.isActive == 1){ %>
            <div class="price-sale">庆生价:<%= detailInfo.active_price %>元</div>
            <% } %>
        </div>
        <% if(detailInfo.comment) { %>
        <div class="case-comment">
            <h2 class="title">贷多多点评</h2>
            <div class="content"><%= detailInfo.comment %></div>
        </div>
        <% } %>
        <div class="form-widget detail-widget">
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">贷款金额</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.loan_money %>万元</div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">贷款期限</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.loan_month %>个月</div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">贷款类型</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.xd_type_text %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">贷款方式</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.loan_type %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">申请贷款城市</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.loan_city %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">两年内信用记录</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.card_record %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">年　　龄</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.age %>岁</div>
                        </div>
                    </div>
                </div>
                <% if(detailInfo.xd_type - 0 === 1) { %>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">单位性质</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.geren_company_type %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">工作时长</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.geren_work_time %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">工资发放形式</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.geren_salary_type %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">月&nbsp;&nbsp;收&nbsp;&nbsp;入</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.geren_salary %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">本地社保缴纳时长</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.geren_shebao %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">公积金缴纳时长</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.geren_gjj %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">名下房产</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.geren_fang %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">名下车辆</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.geren_che %></div>
                        </div>
                    </div>
                </div>
            </div>
            <% } else{ %>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">申请人类型</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.qiye_type %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">现公司经营时长</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.qiye_time %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">现公司半年流水</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.qiye_money %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">名下房产</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.qiye_fang %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">名下车辆</label>
                        <div class="form-control">
                            <div class="form-text"><%= detailInfo.qiye_che %></div>
                        </div>
                    </div>
                </div>
            <% } %>

            <div class="form-opt" data-widget="app/client/app/finance/widget/loan.js#weixinBuy" data-user-id="<%= userId %>">
                <% if(detailInfo.case_status - 0 !== 2) { %>
                <button
                    type="button"
                    class="btn btn-primary btn-large js-touch-state <% if(detailInfo.case_status - 0 !=1){%> disabled <% } %>"
                    data-role="detailBuy"
                    data-name="<%= detailInfo.name %>"
                    <% if(detailInfo.isActive == 1){ %>
                    data-price="<%= detailInfo.active_price %>"
                    <% } else { %>
                    data-price="<%= detailInfo.price %>"
                    <% } %>
                    data-case-id="<%= detailInfo.case_id %>"
                    data-status="<%= detailInfo.case_status %>"
                    ><%= detailInfo.btn_text %></button>
                <% } %>
                <a
                    class="btn btn-primary btn-large js-touch-state js-phone"
                    style="<% if(detailInfo.case_status - 0 !== 2) { %>display: none;<% } %>"
                    href="tel:<%= detailInfo.mobile %>" >拨打电话</a>
            </div>

        </div>
    </div>
</section>
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


<!-- section end -->
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
<div class="mask"></div>