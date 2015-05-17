<!-- section start -->
<section class="section" data-widget="app/client/app/zp/resume/view/prepaid_page.js#form" data-type="point">
<!-- project start -->
    <div class="project">
        <div class="project-head">
            <h2 class="project-title">请选择简历套餐</h2>
        </div>
        <div class="project-body">
            <ul class="project-items">
                <% var first = true;%>
                <% _.each(list, function (item) { %>
                    <li>
                        <label class="radio-group">
                            <input type="radio" name="radio"
                                data-role="input"
                                value="<%= item.id %>"
                                <% if (first) { %>
                                    <% first = false %>
                                checked="checked"
                                <% } %>
                            />
                            <span><em><%= item.info.price %></em>元/<%= item.info.name %><b class="cost"><em><%= item.info.unit_price %></em>元/份</b>
                            </span>
                        </label>
                    </li>
                <% }); %>
            </ul>
        </div>
        <div class="project-bar">
            <button class="btn btn-primary btn-large" data-role="submit">提交</button>
        </div>
    </div>
<!-- project end -->
</section>
<!-- section end -->