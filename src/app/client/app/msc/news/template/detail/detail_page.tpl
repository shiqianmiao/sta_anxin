<!-- article start -->
<article class="news-detail">
    <div class="detail-head">
        <h2 class="detail-title"><%=title%></h2>
        <div class="detail-info"><%=date%></div>
        <div class="detail-info"><%=source%></div>
    </div>
    <div id="content" class="detail-body">
        <%=content%>
    </div>
    <%if (nativeView){%>
    <a href="javascript:;" data-widget="app/client/app/msc/news/view/detail_page.js#showList" data-url='<%=nativeView%>' class="detail-opt"><%=nativeViewTitle%></a>
    <%}%>
</article>
<!-- article end -->