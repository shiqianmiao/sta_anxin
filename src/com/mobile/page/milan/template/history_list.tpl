<!-- section start -->
<div id="postList" data-widget="com/mobile/page/milan/history_page.js#historyOperate"
 class="post-widget">
    <%if(data.list && data.list.length >0){%>
        <%var listCount = 0%>
        <div data-role="list" class="post-lists">
        <%data.list.forEach(function (item, index) {%>
            <%listCount++%>
            <div data-role="item" class="post-list <%if(listCount >= 20){%> hide <%}%>">
                <a href="<%=item.href%>" class="post-item">
                    <h2 class="post-title"><%=item.title%></h2>
                    <p class="post-info">
                        <span><%=item.district%></span>
                        <span><%=item.majorCategoryName%></span>
                        <span><%=item.date%></span>
                    </p>
                    <p class="post-info">
                        <%if(item.price){%>
                        <span class="fc-yellow">
                            <%if(/^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(item.price)){%>
                            <%=item.price%>
                            元
                            <%}else{%>
                                <%=item.price%>
                            <%}%>
                        </span>
                        <%}%>
                    </p>
                </a>
            </div>
        <%})%>
        </div>
        <%if (listCount >= 20){%>
        <div data-role="loadMore" class="load js-touch-state">查看更多<i class="icon-load"></i></div>
        <%}%>
        <div class="post-opt">
          <button data-role="delete" class="btn btn-default js-touch-state">清除全部</button>
        </div>
    <%}else{%>
    <div class="post-nodata">
        <img src="http://sta.ganjistatic1.com/src/image/mobile/touch/milan/search/no_pic.png" alt="">
        <p>您还没有浏览记录</p>
    </div>
    <%}%>
</div>
<!-- section end --> 