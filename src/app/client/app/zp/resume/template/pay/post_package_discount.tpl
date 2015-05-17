<section class="section" data-widget="app/client/app/zp/resume/view/prepaid_page.js#form" data-type="point">
<!-- project start -->
    <div class="project">
        <div class="project-head">
            <h2 class="project-title">国庆特惠，活动截止到10.10</h2>
        </div>
        <div class="project-body">
            <ul class="project-items">
                <% var first = true;%>
                <% _.each(list, function (item) {%>
                    <li>
                        <label class="radio-group">
                            <input type="radio"
                            data-role="input"
                            name="radio"
                            <%if(first){%>
                                <% first = false %>
                                checked="checked"
                            <%}%>
                            value="<%= item.id%>">
                            <span><%=item.info.price%>元/<%=item.info.name%>
                                <%if(item.info.add_free_points >0){%>
                                <small class="tip">
                                        赠送
                                        <em><%=item.info.add_free_points%></em>份简历
                                        <%if (item.info.sms_quantity > 0){%>
                                            、<em>
                                                <%=item.info.sms_quantity%>
                                            </em>条面试邀请短信
                                        <%}%>
                                </small>
                                <%}else{%>
                                    <br>
                                <%}%>
                                <strong class="sale"><em><%=item.info.unit_price%></em>元/份</strong>
                                <b class="cost"><%=item.info.origin_unit_price%>元/份</b>
                            </span>
                        </label>
                    </li>
                <%});%>
            </ul>
        </div>
        <div class="project-bar">
            <button  data-role="submit" class="btn btn-primary btn-large">提交</button>
        </div>
    </div>
<!-- project end -->
</section>