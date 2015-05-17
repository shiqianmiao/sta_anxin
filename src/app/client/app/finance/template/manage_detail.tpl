<!-- section start -->
<section class="management">
    <div class="case-detail">
        <div class="case-item">
            <div class="case-cont">
                <h2 class="title"><%= detailInfo.name %></h2><div class="info"><span><%= detailInfo.loan_money %>万元/<%= detailInfo.loan_month %>个月</span></div>
                <% $.each(detailInfo.template_name, function(k, v) { %>
                <div class="type"><%= v %></div>
                <% }) %>
                <% if(detailInfo.isHot) { %>
                <div class="type"><i class="icon icon-hot"></i>热门推广</div>
                <% } %>
                <div class="status <% if(detailInfo.isNew) { %>status-new <% } %>"><%= detailInfo.label_text %></div>
                <div class="contact">手机号码：<%= detailInfo.mobile %></div>
            </div>
            <a href="tel:<%= detailInfo.mobile %>" class="case-contact btn btn-primary active"><i class="icon icon-tel"></i>电话联系</a>
        </div>
        <div class="tab">
            <div class="tab-list" data-widget="com/mobile/widget/tab.js">
                <a class="tab-item <% if(!detailInfo.islog) { %>active <% } %>" data-role="tabTitle" data-for="#content_order">客户需求</a>
                <a class="tab-item" data-role="tabTitle" data-for="#content_baseinfo">客户资质</a>
                <a class="tab-item <% if(detailInfo.islog) { %>active <% } %>" data-role="tabTitle" data-for="#content_track">订单状态</a>
            </div>
            <div class="tab-content <% if(!detailInfo.islog) { %>active <% } %>" id="content_order">
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
                                    <div class="form-text"><%= detailInfo.loan_money %>个月</div>
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
                    </div>
                </div>
            </div>
            <div class="tab-content" id="content_baseinfo">
                <div class="form-widget detail-widget">
                    <div class="form-group">
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
                                    <label class="form-label">工资发放</label>
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
                                    <label class="form-label">社保缴纳时长</label>
                                    <div class="form-control">
                                        <div class="form-text"><%= detailInfo.geren_salary_type %></div>
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
                    </div>
                </div>
            </div>
            <div class="tab-content <% if(detailInfo.islog) { %>active <% } %>" id="content_track">
                <div class="case-track">
                    <div class="track-list">
                        <% $.each(detailInfo.management, function(k, v) { %>
                        <div class="track-item">
                            <div class="track-title"><%= v.order_status_name %></div>
                            <div class="track-date"><%= v.create_time %></div>
                            <% $.each(v.remarks, function(x, y) { %>
                            <div class="track-ds"><%= y %></div>
                            <% }) %>
                        </div>
                        <% }) %>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- section end -->
<!-- footbar start -->
<div class="footbar" data-widget="app/client/app/finance/widget/loan.js#goUrl">
    <% if(detailInfo.isDisable) { %>
    <a href="javascript:;"
        class="btn btn-common js-touch-state"
        disabled="disabled">变更状态</a>
    <% } else { %>
    <a href="javascript:;"
        class="btn btn-common js-touch-state"
        data-role="toUrl" data-url="app/client/app/finance/controller/manage_edit.js?case_id=<%= case_id %>">变更状态</a>
    <% } %>
</div>
<!-- footbar end -->