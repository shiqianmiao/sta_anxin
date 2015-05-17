<!-- 任务介绍页 -->
<!-- http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/sm/view/task/task_intro_page.js -->

<!-- section start -->
<section class="task">
    <div class="summary">
        <div class="mod-column">
            <div class="column-head">
                <h2 class="column-title">任务介绍</h2>
            </div>
            <div class="column-body">
                <p>积分奖励：<b><%= data.credit %>积分</b></p>
                <p>任务规则：<%= data.description %></p>
            </div>
        </div>
        <% if (data.brief) {%>
            <div class="blank"></div>
            <div class="mod-column">
                <div class="column-head">
                    <h2 class="column-title">任务说明</h2>
                </div>
                <div class="column-body">
                    <%= data.brief%>
                </div>
            </div>
        <% } %>
    </div>
</section>
<!-- section end -->
<div class="tip" style="display: none;"></div>
