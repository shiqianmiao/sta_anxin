<div id="history" class="history"
    data-widget="app/client/app/zp/resume/view/index_page.js#history"
>
    <p class="tips">足迹：您最近访问的类别会显示在这里</p>
    <div class="items" data-role="list">

    </div>
    <i class="icon icon-close" data-role="close">关闭</i>
</div>
<div class="category">
    <h2 class="head">最热职位</h2>
    <ul class="list" data-role="hotJobList">
    <% _.each(hotJobs, function (job) { %>
        <li>
            <a
                data-role="link"
                data-query='{"category_type": "<%= job.url%>", "job_type": "findjob"}'
                data-name="<%= job.name === '全部' ? subCate.name : job.name  %>"
                href="javascript: void(0);"
            >
                <%= job.name %>
            </a>
        </li>
    <% }) %>
    </ul>
</div>
<% _.each(allJobs, function (cate) {%>
    <div class="category" data-widget="app/client/app/zp/resume/view/index_page.js#allJobWidget">
        <h2 class="head"><%= cate.name %></h2>
        <% _.each(_.groupBy(cate.subClass, function (x, i) { return parseInt(i / 3)}), function (subCates, i) { %>
            <ul class="list">
                <% _.each(subCates, function (subCate) { %>
                    <li class="js-touch-state" data-for="<%= subCate.url %>" data-role="title"><b><%= subCate.name %></b></li>
                <% }) %>
            </ul>
            <% _.each(subCates, function (subCate) { %>
            <div data-name="<%= subCate.url %>" data-role="list" class="dropdown">
                <% var total = Math.ceil(subCate.subClass.length/12) %>
                <div class="dropdown-cont" style="width: <%= width * total %>px;" data-role="slide">
                    <% _.each(_.groupBy(subCate.subClass, function (x, i) {return parseInt( i / 12)}), function (jobs, i) { %>
                    <ul class="list <% if (i === 1) {%>active<%}%>" style="width:<%= width %>px;" data-role="slideItem">
                        <% _.each(jobs, function (job) { %>
                            <li data-data='<%= JSON.stringify(job) %>'>
                                <a href="javascript: void(0);"
                                    data-role="link"
                                    data-query='{"category_type": "<%= job.url%>", "job_type": "findjob"}'
                                    data-name="<%= job.name === '全部' ? subCate.name : job.name  %>"
                                ><%= job.name %></a>
                            </li>
                        <% }) %>
                    </ul>
                    <% }) %>
                </div>
                <div class="dropdown-ctrl">
                    <% for(var index = 0; index < total; index ++) { %>
                        <span data-index="<%= index %>" <% if (!index){ %>class="active"<% } %>></span>
                    <% } %>
                </div>
            </div>
            <% }) %>
        <% }); %>
    </div>
<% }); %>
<%
if (['785', '885'].indexOf(appId) === -1) {
    if (
        appId !== '705' ||
        (appId === '705' && parseInt(appVersion[0]) === 5 && parseInt(appVersion[1]) >= 5) ||
        (appId === '705' && parseInt(appVersion[0]) >= 6)
    ) {
%>
<div style="height: 100px; width: 100%">
    <a href="javascript: void(0);" class="btn btn-pub" data-widget="app/client/app/zp/resume/view/index_page.js#pubBtn">发布招聘</a>
</div>
<%
    }
}
%>