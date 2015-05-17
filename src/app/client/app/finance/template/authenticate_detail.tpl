<!-- section start -->
<section class="renzheng">
    <!-- form start -->
    <form action="">
        <div class="form-widget detail-widget">
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">姓　　名</label>
                        <div class="form-control">
                            <div class="form-text">
                                <%= real_name %>
                                <span class="status-text status-<%=listing_status %>"><%= statusText %></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">身份证号</label>
                        <div class="form-control">
                            <div class="form-text"><%= id_card %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">城　　市</label>
                        <div class="form-control">
                            <div class="form-text"><%= city_name %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">机构类型</label>
                        <div class="form-control">
                            <div class="form-text">银行</div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">所属机构</label>
                        <div class="form-control">
                            <div class="form-text"><%= jigou_name %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">机构地址</label>
                        <div class="form-control">
                            <div class="form-text"><%= jigou_addr %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">机构电话</label>
                        <div class="form-control">
                            <div class="form-text"><%= jigou_phone %></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group upload-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">身份证正面</label>
                        <div class="form-control">
                            <div class="pic-group active">
                                <img src="<%= real_img_back %>" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">身份证反面</label>
                        <div class="form-control">
                            <div class="pic-group active">
                                <img src="<%= real_img_front %>" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">工卡/名片</label>
                        <div class="form-control">
                            <div class="pic-group active">
                                <img src="<%= real_img_work %>" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
    <!-- form end -->
</section>
<!-- section end -->
<!-- footbar start -->
<div class="footbar">
    <nav class="nav" data-widget="app/client/app/finance/widget/loan.js#goUrl">
        <% if(listing_status && listing_status != 1) { %>
        <a href="javascript:;" class="nav-item" data-role="toUrl" data-url="app/client/app/finance/controller/authenticate.js?edit=true"><i class="icon icon-pen"></i>编辑</a>
        <% } %>
        <a href="###" data-role="toUrl" data-url="app/client/app/finance/controller/vip_contact.js" class="nav-item"><i class="icon icon-headphone"></i>联系我们</a>
    </nav>
</div>
<!-- footbar end -->