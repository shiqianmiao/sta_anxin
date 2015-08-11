<% for(var i = 0; i < list.length; i++){ %>
<a href="/article/desc?article_id=<%= list[i].id%>">
    <li class="per-zn">
        <img src="<%= list[i].head_pic%>" class="zn-pic">
        <section class="zn-content">
            <h2>【<%= list[i].major_category%>】<%= list[i].title%></h2>
            <time><%= list[i].create_time%></time>
        </section>
    </li>
</a>
<% } %>
