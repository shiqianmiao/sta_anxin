<!-- 任务积分 -->
<!-- http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/sm/view/task/task_page.js?user_id=8241 -->

<!-- section start -->
<section class="task">
    <div class="mod-banner"><a href="javascript:;"><img src="http://sta.ganjistatic1.com/src/image/mobile/app/LV_Mall/banner03.png" alt=""></a></div>
    <div class="list">
        <div class="mod-column">
            <div class="column-head">
                <h2 class="column-title">任务列表</h2>
            </div>
            <div class="column-body">
                <div class="mod-list">
                    <% if (data) { %>
                        <% var info = { 'once' : '一次性任务','day' : '每日1次','week' : '每周1次' } %>
                        <% data.forEach(function (item) { %>
                        <%if (item.is_login) { %>
                            <% if (item.can) { %>
                                <% item.class = ''; item.sta_text = '未完成'; %>
                            <% } else {%>
                                <%  item.class = 'active'; item.sta_text = '已完成' %>
                            <% } %>
                        <% } %>
                        <div class="list-item">
                            <a href="javascript:;"
                            class="list-cont <%= item.class %>"
                            data-widget="app/client/app/sm/view/task/task_page.js#redirect"
                            data-task-id="<%= item.id %>"
                            <% console.log(item.jump_url)%>
                            data-jump-url="<%= item.jump_url %>">
                                <h3 class="list-title">
                                    <%= item.name %>
                                </h3>
                                <div class="list-value">
                                <b><%= item.credit %>
                                    </b>积分
                                </div>
                                <div class="list-info">
                                    <%= info[item.frequency] %>
                                    <%  if(item.sta_text) { %>
                                        ，<%= item.sta_text %>
                                    <% } %>
                                </div>
                            </a>
                        </div>
                        <% }); %>
                    <%}%>
                </div>
            </div>
        </div>
    </div>
    <div class="mod-holder"
        data-widget="app/client/app/sm/widget/subscribe.js#forPush">
        <div class="holder-cont">每日提醒</div>
        <label for="check_push" data-role="tabWrap" class="holder-group">
            <input data-role="tab" checked="checked" name="check_push" type="checkbox" value="none">
            <span></span>
        </label>
    </div>
    <div class="mod-holder" data-widget="app/client/app/sm/widget/subscribe.js#subscribe">
        <div class="holder-cont"> 任务完成时，显示加分提示 </div>
        <label for="check" data-role="tabWrap" class="holder-group">
            <input data-role="tab" checked="checked" name="check" type="checkbox" value="none"><span></span>
        </label>
    </div>
</section>
<!-- section end -->
<div class="tip" style="display: none;"></div>
