<!-- section start -->
<section class="address">
    <form id="form" action="" data-disabled-submit="1"
        data-widget="app/client/app/sm/view/prize/address.js#form">
        <input type="hidden" name="order_id" value="<%= data.order_id%>" >
        <input type="hidden" name="user_id" value="<%= data.user_id %>" >
        <input type="hidden" name="pay_code" value="<%= data.pay_code %>" >
        <div class="form-widget">
            <div class="form-tips">小驴提示：请尽快填写收货信息，若 <span data-widget="app/client/app/sm/view/prize/address.js#countdown" data-count="10">10:00</span> 分钟前未提交，将视您自动放弃<% if (data.is_from_choujiang) { %>领取
            <% } else { %> 兑换 <% } %></div>
            <div class="form-group">
                <div class="form-field" data-widget="app/client/app/sm/widget/forms.js#inputField" data-role="field" data-name="express_consignee">
                    <div class="form-item">
                        <label class="form-label">收&nbsp;&nbsp;货&nbsp;&nbsp;人</label>
                        <div class="form-control" data-role="warning">
                            <label class="input-group">
                                <input data-role="input" class="input-text" name="express_consignee" type="text" value="<%= data.express_consignee %>">
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan">请填写收货人</div>
                </div>
                <div class="form-field" data-widget="app/client/app/sm/widget/forms.js#inputField" data-role="field" data-name="express_phone">
                    <div class="form-item">
                        <label class="form-label">联系电话</label>
                        <div class="form-control" data-role="warning">
                            <label class="input-group">
                                <input data-role="input" class="input-text" type="text" name="express_phone" value="<%= data.express_phone %>">
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan">手机号码格式不对</div>
                </div>
                <div class="form-field" data-widget="app/client/app/sm/widget/forms.js#inputField" data-role="field" data-name="express_address">
                    <div class="form-item">
                        <label class="form-label">收货地址</label>
                        <div class="form-control" data-role="warning">
                            <label class="textarea-group">
                                <textarea data-role="input" class="textarea" name="express_address" rows="" cols=""><%= data.express_address %></textarea>
                            </label>
                        </div>
                    </div>
                    <div class="form-warning" data-role="tipSpan">请填写收货地址</div>
                </div>
            </div>
            <div class="form-opt">
                <button data-role="subBtn" type="submit" class="btn btn-primary btn-large js-touch-state">确认提交</button>
            </div>
        </div>
    </form>
</section>
<div id="errorPop" data-refer="#form" class="popup popup-confirm" style="margin-top: -118px;"
    data-widget="com/mobile/widget/pop_up_window.js#alertPop">
    <div class="popup-head">
        <h2 data-role="title">提示</h2>
    </div>
    <div class="popup-body" data-role="content">
        <p>信息填写超时，请重新兑换奖品！</p>
    </div>
    <div class="popup-bar vertical">
        <a data-role="confirm" href="javascript:;" class="btn">知道了</a>
    </div>
</div>
<div id="mask" class="mask"></div>
<!-- section end -->