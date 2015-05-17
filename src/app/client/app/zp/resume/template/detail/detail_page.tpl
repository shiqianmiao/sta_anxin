<!-- section start -->
<section class="section">
<!-- detail start -->
    <div class="detail">
        <div class="detail-group">
            <h2 class="detail-title"><span><%= post.person %></span> <span><%= post.sex %></span> <span><%= post.age %></span>
            <% if (post.auth_phone) { %>
                <i class="icon icon-renz">手机认证</i>
            <% } %>
            </h2>
        </div>
        <div class="detail-group">
            <div class="detail-cont">
                <% if (post.period) { %>
                <p class="detail-meta"><label>工作年限</label><%= post.period %></p>
                <% } %>
                <% if (post.degree) { %>
                <p class="detail-meta"><label>学　　历</label><%= post.degree %></p>
                <% } %>
                <% if (post.category_name) { %>
                <p class="detail-meta"><label>求职意向</label><%= Array.isArray(post.category_name) ? post.category_name.join('|') : post.category_name %></p>
                <% } %>
                <p class="detail-meta"><label><%if(job_type === 'findjob'){%><%='期望月薪'%><%}else{%><%='期望日薪'%><%}%></label><%= post.salary %></p>
                <p class="detail-meta"><label>期望区域</label><%= post.place %></p>
                <div class="detail-opt <%if (can_look) { %>active<% } %>"
                    data-widget="app/client/app/zp/resume/view/detail_page.js#showContact"
                    data-puid='<%= post.puid %>'
                    data-pos="middle"
                >
                    <button class="btn btn-primary btn-large show-contact" data-role="show">查看联系方式</button>
                    <button class="btn btn-default btn-large contact-method" data-role="call" data-phone="<%= post.phone %>">联系方式：<span data-role="phone"><%= post.phone %></span><i class="icon icon-phone"></i></button>
                </div>
            </div>

        </div>
        <div data-puid="<%=post.puid%>"
            class="detail-group" <% if(!can_look){ %> style="display:none"<% } %>
            data-widget="app/client/app/zp/resume/view/detail_page.js#showInvitation">
            <a href="javascript:;" class="detail-invitation">发送面试邀请</a>
        </div>
        <%if (post.work_day){ %>
        <div class="detail-group">
            <div class="detail-cont">
                <p class="detail-article"><label>空闲时间</label></p>
                <table class="my-freeTime">
                    <tbody>
                        <tr><td>时间</td><td>上午</td><td>下午</td></tr>
                        <tr><td>星期一</td><td><i <%if(~post.work_day.indexOf(1)){%>class="dg"<%}%>></i></td><td><i <%if(~post.work_day.indexOf(8)){%>class="dg"<%}%>></i></td></tr>
                        <tr><td>星期二</td><td><i <%if(~post.work_day.indexOf(2)){%>class="dg"<%}%>></i></td><td><i <%if(~post.work_day.indexOf(9)){%>class="dg"<%}%>></i></td></tr>
                        <tr><td>星期三</td><td><i <%if(~post.work_day.indexOf(3)){%>class="dg"<%}%>></i></td><td><i <%if(~post.work_day.indexOf(10)){%>class="dg"<%}%>></i></td></tr>
                        <tr><td>星期四</td><td><i <%if(~post.work_day.indexOf(4)){%>class="dg"<%}%>></i></td><td><i <%if(~post.work_day.indexOf(11)){%>class="dg"<%}%>></i></td></tr>
                        <tr><td>星期五</td><td><i <%if(~post.work_day.indexOf(5)){%>class="dg"<%}%>></i></td><td><i <%if(~post.work_day.indexOf(12)){%>class="dg"<%}%>></i></td></tr>
                        <tr><td>星期六</td><td><i <%if(~post.work_day.indexOf(6)){%>class="dg"<%}%>></i></td><td><i <%if(~post.work_day.indexOf(13)){%>class="dg"<%}%>></i></td></tr>
                        <tr><td>星期日</td><td><i <%if(~post.work_day.indexOf(7)){%>class="dg"<%}%>></i></td><td><i <%if(~post.work_day.indexOf(14)){%>class="dg"<%}%>></i></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <% } %>
        <% if (post.work_experience) { %>
        <div class="detail-group">
            <div class="detail-cont">
                <p class="detail-article"><label>工作经历</label></p>
                <% post.work_experience.forEach(function (exp) { %>
                    <p class="exp-detail">
                        <%= exp.from_year %>年<%= exp.from_month %>月
                        <%if (exp.to_now) { %>
                            至今
                        <% } else { %>
                            至 <%= exp.to_year %>年<%= exp.to_month %>月
                        <% } %><br>
                        公司名称: <%= exp.company %><br>
                        公司行业: <%= exp.biz %><br>
                        工作职位: <%= exp.job %><br>
                        工作内容: <%= exp.description %>
                    </p>
                <% }) %>
            </div>
        </div>
        <% } %>
        <% if (post.edu_experience) { %>
        <div class="detail-group">
            <div class="detail-cont">
                <p class="detail-article"><label>教育经历</label></p>
                <% post.edu_experience.forEach(function (exp) { %>
                <p class="exp-detail">
                    <%= exp.from_year %>年<%= exp.from_month %>月
                    <%if (exp.to_now) { %>
                        至今
                    <% } else { %>
                        至 <%= exp.to_year %>年<%= exp.to_month %>月
                    <% } %><br>
                    学校: <%= exp.school %><br>
                    学历: <%= exp.education %><br>
                    专业: <%= exp.specialty %><br>

                </p>
                <% }) %>
            </div>
        </div>
        <% } %>
        <% if (post.description) { %>
        <div class="detail-group">
            <div class="detail-cont">
                <p class="detail-article"><label>自我描述</label></p>
                <p class="detail-article">
                    <%= post.description %>
                </p>
            </div>
        </div>
        <% } %>
        <div class="detail-group" style="display: none;">
            <div class="detail-cont">
                <h3 class="detail-heading">优秀简历推荐</h3>
                <div class="list"
                    id="postList"
                    data-widget="app/client/app/zp/resume/view/detail_page.js#showRecommendList"
                    data-puid="<%= post.puid%>"
                >
                    <ul class="list-items" data-role="list">
                        加载中...
                    </ul>
                </div>
            </div>
        </div>
        <div class="report"
            id="showReport"
            data-widget="app/client/app/zp/resume/view/detail_page.js#showReport"
            data-puid="<%=post.puid%>"
            data-is-my="<%= is_my ? true : false %>"
        >
            <h3 class="report-title"><b>小驴提醒您</b></h3>
            <div class="report-body">
                <p>若您发现该简历是广告或无意义简历，请举报！</p>
                <a href="javascript:void(0);" data-role="report" class="btn btn-info">举报</a>
            </div>
        </div>
    </div>
<!-- detail end -->
</section>
<!-- section end -->
<!-- fixed start -->
<div class="fixed-widget fixed-contact <%if (can_look) { %>active<% } %>"
    data-widget="app/client/app/zp/resume/view/detail_page.js#showContact"
    data-puid="<%= post.puid %>"
    data-pos="bottom"
>
    <div class="fixed-body">
        <p><%= post.person %></p>
        <p class="contact-method"><span data-role="phone"><%= post.phone %></span></p>
    </div>
    <div class="fixed-opt">
        <button class="btn btn-primary show-contact" data-role="show">查看联系方式</button>
        <button class="btn btn-default contact-method" data-phone="<%= post.phone%>" data-role="call">拨打电话<i class="icon icon-phone"></i></button>
    </div>
</div>