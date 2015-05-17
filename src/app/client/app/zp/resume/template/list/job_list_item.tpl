<% _.each(resumes, function (resume) { %>
<li data-data='<%= JSON.stringify(resume) %>'
    data-role="post"
    data-puid="<%= resume.puid %>"
>
    <a href="javascript: void(0);"
        class="list-cont"
        data-role="link"
    >
        <h2 <% if (resume.auth_phone||resume.is_top) { if(resume.auth_phone&&resume.is_top){
            %>class="icon-place2"<% } else{%>class="icon-place"<%}}%>
            <span><%= resume.person %></span>
            <span><%= resume.sex %></span>
            <span><%= resume.age %></span>
            <%if (resume.category_name){%><span>求职<%= resume.category_name[0] %></span><%}%>
            <% if (resume.auth_phone) { %>
            <i class="icon icon-renz"></i>
            <% } %>
            <% if (resume.is_top) { %>
            <i class="icon icon-push">顶</i>
            <% } %>
        </h2>
        <p><%if(job_type === 'findjob' || !job_type){%><%='全职'%><%}else{%><%='兼职'%><%}%> <%= resume.degree %> <%= resume.period %> <%= resume.salary %></p>
        <p><%= resume.post_time%> 期望工作地点：<%= resume.place %></p>
    </a>
    <a href="javascript:;" class="list-opt" data-role="download">下载</a>
</li>
<% }) %>