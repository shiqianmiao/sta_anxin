<!-- section start -->
<section class="section">
<!-- filter start -->
    <div class="filter" id="filter"
        data-widget="app/client/app/zp/resume/view/list_page.js#filter">
        <ul class="filter-nav">
            <li class="js-touch-state" ><b  data-for="area" data-role="title"><%= query.area || '区域'%></b></li>
            <% _.each(filters, function (filter) { %>
                <li class="js-touch-state" >
                    <b data-for="<%= filter.name %>" data-role="title">
                    <% if (typeof query[filter.name] === 'undefined') { %>
                        <%= filter.title %>
                    <% } else {
                        var option = _.find(filter.options, function (option) {
                            return option.value === query[filter.name];
                        }) || {};
                    %>
                        <%= (option.title && option.title !== '不限') ? option.title : filter.title %>
                    <% } %>
                    </b>
                </li>
            <% }); %>
            <li class="more" data-role="advance"><b>筛选</b></li>
        </ul>
        <div class="filter-cont"
            data-widget="app/client/app/zp/resume/view/list_page.js#comboFilter"
            data-name="area"
            data-role="filter"
            data-selected='<%= JSON.stringify({district_id: query.district_id, street_id: query.street_id}) %>'
        >
            <div class="js-need-iscroll filter-wrap" data-role="panel">
                <ul class="filter-menu"
                    data-source="controller=Resume&action=getCitys&type=district&city_id=<%= query.city_id %>"
                    data-role="select"
                    data-name="district_id"
                    data-for="street_id"
                >
                </ul>
            </div>
            <div class="js-need-iscroll filter-wrap" style="display: none" data-role="panel">
                <ul class="filter-submenu"
                    data-source="controller=Resume&action=getCitys&type=street&city_id=<%= query.city_id %>"
                    data-role="select"
                    data-name="street_id"
                >
                </ul>
            </div>
        </div>
        <% _.each(filters, function (filter) { %>
            <div class="filter-cont"
                data-widget="app/client/app/zp/resume/view/list_page.js#singleFilter"
                data-name="<%= filter.name %>"
                data-role="filter"
                data-title="<%= filter.title %>"
            >
                <div class="js-need-iscroll filter-wrap" data-role="panel">
                    <ul class="filter-menu" data-role="select" data-name="<%= filter.name %>">
                        <% _.each(filter.options, function (option) { %>
                        <li
                            data-value="<%= option.value %>"
                            data-role="option"
                            <% if (query[filter.name] === option.value || (typeof query[filter.name] === 'undefined' && option.value === -1)) { %>
                            class="js-touch-state active"
                            <% } else { %>
                            class="js-touch-state"
                            <% } %>
                        ><%= option.title %></li>
                        <% }) %>
                    </ul>
                </div>
            </div>
        <% }) %>
        <div class="mask" data-role="mask"></div>
    </div>
</section>
<!-- filter end -->
<!-- list start -->
<section class="section">
    <div class="list" data-widget="app/client/app/zp/resume/view/list_page.js#postList" id="postList"
        data-query='<%= JSON.stringify(_.extend({'controller': 'Resume','action': 'getResumeList', 'job_type': jobType}, query)) %>'
    >
        <ul class="list-items" data-role="list">

        </ul>
        <div data-role="more" class="more">
            加载中...
        </div>
    </div>
<!-- list end -->
<!-- nav-bar start -->
<% if (showTab) { %>
<div class="nav-bar" id="tab" data-widget="app/client/app/zp/resume/view/list_page.js#tab">
    <div class="nav-list">
        <a href="javascript:;"
            <% if (!jobType || jobType === 'findjob') { %>
            class="active"
            <% } %>
            data-job-type="findjob"
            data-role="tab"
            data-direction="right"
        >全职</a>
        <a href="javascript:;"
            <% if (jobType && jobType === 'parttime') { %>
            class="active"
            <% } %>
            data-job-type="parttime"
            data-role="tab"
            data-direction="left"
        >兼职</a>
    </div>
</div>
<% } %>
<!-- nav-bar end -->
</section>