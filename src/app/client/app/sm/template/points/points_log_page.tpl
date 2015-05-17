<!-- 积分明细 -->
<!-- section start -->
<!-- http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/sm/view/points/points_log_page.js?user_id=8241&page_index=0&credit=3203 -->

<section class="log">
    <% if (data.length <= 0) { %>
        <div class="guide active">
            <div class="page-status status-nothing">
                <div class="status-tips">暂无积分</div>
            </div>
            <a href="javascript:;"  data-native-a="#app/client/app/sm/view/task/task_page.js" class="btn btn-primary btn-large">立即去赚积分</a>
        </div>
    <% } else { %>
        <div class="list">
            <div class="mod-column">
                <div class="column-head">
                    <h2 class="column-title">积分余额<b><%= credit %></b></h2>
                </div>
                <div class="column-body">
                    <% if (data) { %>
                    <div id="feedList" class="mod-list">
                        <% data.forEach(function (item) { %>
                        <div class="list-item" data-json-args="JSON.stringify(item)">
                            <div class="list-cont">
                                <div class="list-value">
                                    <% if (item.credit_change <= 0) { %>
                                        <b class="lose">
                                        <% if (item.credit_change == 0) { %>
                                        -<% } %><%= item.credit_change %>

                                        </b>
                                    <% } else { %>
                                        <b class="add">+<%= item.credit_change %>
                                        </b>
                                    <% } %>
                                积分</div>
                                <h3 class="list-title"><%= item.task_name %></h3>
                                <div class="list-info"><%= item.openDate %></div>
                            </div>
                        </div>
                        <% }); %>
                    </div>
                    <% if(data.length >= 30) { %>
                    <div class="mod-loading"
                        style="text-align:center; color: #999; line-height: 44px;"
                        data-widget="app/client/app/sm/view/points/points_log_page.js#loadMore"
                        data-user-id="<%= userInfo.user_id %>"
                        data-scroll-able="true"
                    ><i class="zoom-in"></i><i class="zoom-out"></i></div>
                    <% } %>
                    <% } %>
                </div>
            </div>
        </div>
    <% } %>
</section>
<!-- section end -->
