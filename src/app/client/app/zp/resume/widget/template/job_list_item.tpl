<%if(!resumes || resumes.length<=0){%>暂无<%}%>
<% _.each(resumes, function (resume) { %>
<li data-data='<%= JSON.stringify(resume) %>'
    data-role="post"
    data-puid="<%= resume.puid %>"
>
    <a href="javascript: void(0);"
        class="list-cont"
        data-role="link"
    >
        <h2 <% if (resume.auth_phone) {%>class="icon-place"<% } %>>
            <span><%= resume.person %></span>
            <span><%= resume.sex %></span>
            <span><%= resume.age %></span>
            <%if (resume.category_name){%><span>求职<%= resume.category_name[0] %></span><%}%>
            <% if (resume.auth_phone) { %>
            <i class="icon icon-renz"></i>
            <% } %>
            <% if (is_need_top && resume.is_top) { %>
            <i class="icon icon-push"></i>
            <% } %>
        </h2>
        <p><%if(job_type === 'findjob' || !job_type){%><%='全职'%><%}else{%><%='兼职'%><%}%> <%= resume.degree %> <%= resume.period %> <%= resume.salary %></p>
        <p><%= resume.post_time%> 期望工作地点：<%= resume.place %></p>
    </a>
    <a href="javascript:void(0);" class="list-opt" data-role="download">下载</a>
</li>
<% }) %>