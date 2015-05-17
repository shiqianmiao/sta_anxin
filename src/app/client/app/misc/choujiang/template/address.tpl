<div class="outer-wrap">
    <div class="inner-wrap">
        <form id="form" action="" data-disabled-submit="1"
            data-widget="app/client/app/misc/choujiang/view/address.js#form"
            data-is-mod="<%= data.is_mod %>">
        <input type="hidden" data-role="input" name="user_id" value="<%= data.user_id %>" >
        <div class="addr-box">
            <% if (data.is_mod) { %>
                <% if (!data.is_first) { %>
                     <p class="congra">请修改您的地址</p>
                <% } else { %>
                     <p class="congra">请填写个人信息方便我们邮寄奖品</p>
                <% } %>
            <% } else { %>
                <p class="congra">恭喜你抽中<%= data.name %>，<br>请填写个人信息方便我们邮寄奖品</p>
            <% } %>
            <div class="form-box">
                <div class="form-p " data-widget="app/client/common/view/account/widget/widget.js#inputField" data-role="field" data-name="express_consignee">
                    <p>姓名<span class="error " data-role="tipSpan">*请补充信息后再进行提交</span></p>
                    <input autocomplete="off" type="text" name="express_consignee" value="<%= data.express_consignee %>" class="input-text">
                </div>
                <div class="form-p" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-role="field" data-name="express_address">
                    <p>地址<span class="error" data-role="tipSpan">*请补充信息后再进行提交</span></p>
                    <textarea data-role="input" name="express_address"><%= data.express_address %></textarea>
                </div>
                <div class="form-p" data-widget="app/client/common/view/account/widget/widget.js#inputField" data-role="field" data-name="express_phone">
                    <p>手机<span class="error" data-role="tipSpan">*请补充信息后再进行提交</span></p>
                    <input autocomplete="off"  type="tel" data-role="input" name="express_phone" value="<%= data.express_phone %>" class="input-text">
                </div>
            </div>
        </div>
        <div class="sumbit-box">
            <button data-role="subBtn" type="submit" class="btn js-touch-state">确认提交</button>
        </div>
        </form>
    </div>
</div>
<footer>
    赶集网—最全的生活分类信息网
</footer>
