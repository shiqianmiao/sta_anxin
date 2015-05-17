<!-- section start -->
<section class="section invitation-section">
<!-- form start -->
    <form action=""
        id="form"
        data-widget="app/client/app/zp/resume/view/invitation_page.js#form"
        data-templates='<%- JSON.stringify(tmp_arr) %>'
        data-user-id='<%= userId %>'
        data-sms-count="<%= sms_num %>"
    >
        <input type="hidden" name="user_id" value="<%= userId %>">
        <input type="hidden" name="puid" value="<%= puid %>">
        <div class="form-widget">
            <h2 class="form-heading"><span>受邀人：</span><%= name %></h2>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">邀请职位</label>
                        <div class="form-control">
                            <label class="input-group"><input name="major_name" type="text" class="input-text" placeholder="" value="<%= major_name %>" /></label>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item form-item2">
                        <label class="form-label">面试通知</label>
                        <div class="form-control">
                            <nav class="tab-group">
                                <span class="tab-item<%if (check_tmp_num === 0) {%> active<% } %>" data-index="0">模版一</span>
                                <span class="tab-item<%if (check_tmp_num === 1) {%> active<% } %>" data-index="1">模版二</span>
                                <span class="tab-item<%if (check_tmp_num === 2) {%> active<% } %>" data-index="2">模版三</span>
                                <input type="hidden" data-role="index" name="check_tmp_num" value="<%= check_tmp_num %>">
                            </nav>
                            <div class="textarea-group">
                                <textarea name="text" data-role="text" cols="" rows=""><%= tmp_arr[check_tmp_num || 0] || '' %></textarea>
                            </div>
                            <div class="btn-group">
                                <button type="button" class="btn btn-info js-touch-state" data-role="save">保存模版</button>
                                <span class="text-group">(共<b data-role="textCount">230</b>字)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item3">
                        <div class="text-group"><strong>短信邀请</strong>(此通知共需<b data-role="msgCount">2</b>条短信）</div>
                        <label for="send_sms" class="holder" data-role="switch">
                            <input id="send_sms" name="send_sms" type="checkbox" value="1"
                                <% if (!can_sendMsg) { %>
                                    disabled="disabled"
                                <% } else { %>
                                    checked="checked"
                                <% } %>
                            >
                            <span></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </form>
<!-- form end -->
<!-- summary start -->
<div class="summary">
    <div class="text-group">您剩余的短信数：<b><%= sms_num %></b>条</div>
    <ol class="text-list">
        <li>1，开启“短信邀请”后，面试通知会以短信，邮件，站内信三种方式发送给受邀人；</li>
        <li>2，如未开启“短信邀请”或剩余短信数为0,则面试通知会以邮件，站内信两种方式发给受邀人。</li>
    </ol>
</div>
<!-- summary end -->
</section>
<!-- section end -->
<!-- fixed start -->
<div class="fixed-widget fixed-btn">
    <button class="btn btn-primary btn-large js-touch-state" type="button" id="submit">发送面试邀请</button>
</div>
<!-- fixed start -->