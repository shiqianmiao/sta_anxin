<section class="yxc-body-bg index-section">
    <% if (showDownload) { %>
    <div class="banner-wrap" data-widget="app/client/app/xiche/pub_page/view/index.js#download_banner">
        <a href="http://xiche.ganji.com/down">
            <img src="http://sta.ganjistatic1.com/src/image/mobile/touch/milan/yixiche_m/banner_download.png" >
        </a>
        <span data-role="close" class="bt-close"></span>
    </div>
    <% } %>
    <div class="yxc-top">
        <% if (!isGanjiAPP) { %>
        <span class="yxc-city" id="choose-city"
            data-url="app/client/app/xiche/pub_page/view/choose_city.js"
        ><%= cityInfo.city_name %></span>
        <i class="bt-yxc-city"></i>
        <% } %>
        <a class="bt-yxc-order"
            data-widget="app/client/app/xiche/pub_page/widget/widget.js#link"
            data-url="app/client/app/xiche/pub_page/view/profile.js"
        >个人中心</a>
    </div>
    <div class="company-intro" style="display: none;">
      <span></span>
      赶集易洗车—由赶集网（山景科创网络技术  （北京）有限公司）自营，致力于打造互联网思维的洗车服务模式，让您足不出户，告别等待，一键下单，轻松享受专业的洗车服务！
    </div>
    <form action="" method="post" id="form"
        data-widget="app/client/app/xiche/pub_page/view/index.js#form"
        data-params='<%= JSON.stringify(params).replace(/\'/g, "`") %>'
    >
        <input type="hidden" name="cityId" value="<%= cityInfo.city_id %>">
        <input type="hidden" name="userId" value="<%= userCenterInfo.user_id %>">
        <input type="hidden" name="payAmount" value="">
        <input type="hidden" name="carNumber" value="<%= carNumber %>" >
        <input type="hidden" name="carModelId" value="<%= series.series_id %>" >
        <input type="hidden" name="carBrandId" value="<%= brand %>">
        <input type="hidden" name="carCategory" value="<%= series.auto_type %>">
        <input type="hidden" name="carColorId" value="<%= colorId %>">
        <input type="hidden" name="province" value="<%= cityInfo.province %>">
        <input type="hidden" name="latlng" value="<%= addressInfo.latlng %>">
        <input type="hidden" name="addressComment" value="<%= addressInfo.addressComment %>">
        <input type="hidden" name="address" value="<%= addressInfo.address %>">
        <ul class="yxc-attr-list">
            <li
                <% if (!userCenterInfo.phone) { %>
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/login.js?form=index&action=<%= loginType %>"
                <% } %>
            >
                <i class="icon-phone"></i>
                <p class="cover<% if (userCenterInfo.phone) { %> no-arrow<% } %>">
                    <input
                        class="ipt-attr"
                        type="text"
                        name="phone"
                        value="<%= userCenterInfo.phone %>"
                        placeholder="请输入手机号"
                        readonly
                    >
                    <% if (userCenterInfo.phone && !isGanjiAPP) { %>
                    <span class="bt-yxc-modify"
                        data-role="select"
                        data-url="app/client/app/xiche/pub_page/view/login.js?form=index"
                    >修改</span>
                    <% } %>
                </p>
            </li>
            <li
                data-role="select"
                data-url="app/client/app/xiche/pub_page/view/choose_car_info.js"
            >
                <i class="icon-plate-num"></i>
                <p class="cover">
                    <input
                        class="ipt-attr"
                        type="text"
                        name="carInfo"
                        value="<%= carInfo %>"
                        placeholder="请填写车辆信息"
                        readonly
                    >
                </p>
            </li>
            <li
                data-role="select"
                data-is-constant="<%= addressInfo.isConstant %>"
                data-tip-text="<%= addressInfo.tipText %>"
                data-url="app/client/app/xiche/pub_page/view/choose_position.js"
            ><i class="icon-position"></i>
                <p class="cover">
                    <input
                        class="ipt-attr"
                        type="text"
                        name="addressName"
                        value="<%= addressInfo.addressName %>"
                        placeholder="请选择车辆位置"
                        readonly
                    >
                </p>
            </li>
        </ul>
        <div class="yxc-space"></div>
        <div class="tit-select-service">选择服务</div>
        <div class="comm-service"
            data-role="select"
            data-url="app/client/app/xiche/pub_page/view/choose_package.js"
        >
            <span><em>&yen;</em><%= promotion.price %></span>
            <div class="con-service">
                <div class="con-service-inner"><%= promotion.description %></div>
            </div>
        </div>
        <div class="yxc-space space-six border-t-no"></div>
        <ul class="yxc-attr-list">
            <li
                data-widget="app/client/app/xiche/pub_page/view/index.js#choose_time"
                data-latlng="<%= addressInfo.latlng %>"
                data-product-code="<%= params.productCode %>"
                data-map-type="<%= addressInfo.mapType %>"
            >
                <script type="text/template" data-role="timelineTemplate">
                    <%= '<' + '% timeline.forEach(function (group) { %' + '>' %>
                    <dl>
                        <%= '<' + '% group.forEach(function (item) { %' + '>' %>
                        <dd
                            data-role="item"
                            data-peroid="<%= '<' + '%= item.peroid %' + '>' %>"
                            <%= '<' + '% if (item.isFull || item.isPast) { %' + '>' %>
                            class="disable"
                            <%= '<' + '% } %' + '>' %>
                        ><%= '<' + '%= item.peroid %' + '>' %><br>
                        <%= '<' + '% if (item.isFull || item.isPast) { %' + '>' %>
                            不<%= '<' + '% } %' + '>' %>可预约</dd>
                        <%= '<' + '% }) %' + '>' %>
                    </dl>
                    <%= '<' + '% }); %' + '>' %>
                </script>
                <i class="icon-time"></i>
                <p data-role="label" class="cover no-arrow">
                    <input
                        class="ipt-attr"
                        type="text"
                        name="jobTimeText"
                        data-role="text"
                        value="<%= jobTimeText %>"
                        placeholder="你希望的服务时间"
                        readonly
                    >
                </p>
                <input data-role="input" type="hidden" name="peroid" value="<%= peroid %>">
                <input data-role="input" type="hidden" name="jobDate" value="<%= jobDate %>">
                <div class="yxc-pop-mask" data-role="panel" style="display: none;">
                    <div class="yxc-time-wrap">
                        <div class="yxc-time-top">
                            <span data-role="cancel">取消</span>选择洗车时间
                        </div>
                        <div class="yxc-time-con">
                            <dl>
                                <dt
                                    class="active"
                                    data-role="date"
                                    data-text="今天"
                                    data-date="<%= dates[0].join('-') %>"
                                >
                                    今天
                                    <span><%= dates[0][1] %>月<%= dates[0][2] %>日</span>
                                </dt>
                            </dl>
                            <dl>
                                <dt
                                    data-role="date"
                                    data-text="明天"
                                    data-date="<%= dates[1].join('-') %>"
                                >
                                    明天
                                    <span><%= dates[1][1] %>月<%= dates[1][2] %>日</span>
                                </dt>
                            </dl>
                            <dl>
                                <dt
                                    data-role="date"
                                    data-text="后天"
                                    data-date="<%= dates[2].join('-') %>"
                                >
                                    后天
                                    <span><%= dates[2][1] %>月<%= dates[2][2] %>日</span>
                                </dt>
                            </dl>
                            <dl>
                                <dt
                                    data-role="date"
                                    data-text="<%= dates[3].join('-') %>"
                                    data-date="<%= dates[3].join('-') %>"
                                >
                                    <span class="last-colum"><%= dates[3][1] %>月<%= dates[3][2] %>日</span>
                                </dt>
                            </dl>
                        </div>
                        <div class="yxc-time-con" data-role="timeline">
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div style="<%= defaultWashInterior ? 'display: none;' : '' %>">
            <div class="yxc-space space-six"></div>
            <ul class="yxc-service-list edition2-interior">
                <li>
                    <label class="pay-type" for="is-wash-interior">需要清理内饰<input name="isWashInterior" id="is-wash-interior" type="checkbox" value="1" <%= defaultWashInterior || isWashInterior ? 'checked' : '' %>>
                        <span class="bt-interior"></span>
                    </label>
                </li>
            </ul>
        </div>
        <div style="<%= showInviteCode ? '' : 'display: none;' %>">
            <div class="yxc-space space-six border-t-no"></div>
            <div class="code-invitation">
                邀请码<input type="text" name="inviteCode" value="" placeholder="邀请码或邀请人手机号，可不填" class="ipt-attr" ><a class="tip-code-invite" data-role="invitationHint">?</a>
            </div>
        </div>
        <div class="foot-index">
            <a class="bt-sub-order"
                data-role="submit"
            >
                立即下单
            </a>
            <p class="yxc-logo center-logo"></p>
            <div class="car-info-fixed">
                <em>©赶集易洗车2015</em>
                <span>客服电话：<a href="tel:4007335500" class="bt-telphone">4007-335-500</a></span>
            </div>
        </div>
    </form>
</section>
