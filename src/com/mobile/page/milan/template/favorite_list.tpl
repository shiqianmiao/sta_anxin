<!-- section start -->
<div id="postList" data-widget="com/mobile/page/milan/favorite_page.js#favoriteOperate"
 class="post-widget">
    <%if(data.list && data.list.length >0){%>
        <div data-role="list" class="post-lists">
        <%data.list.forEach(function (item, index) {%>
            <div data-role="item" class="post-list">
                <label class="checkbox-group">
                    <input type="checkbox" name="checkbox" <%if(data.list.length===1){%>checked="checked"<%}%> value="<%=item.puid%>">
                    <span></span>
                </label>
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
        <%if (data.pageCount > 1){%>
        <div class="blank"></div>
        <div id="gjPage" class="gj-page" data-widget="com/mobile/page/milan/list_page.js#initPage">
            <a data-widget="pre" class="page-up <%if(data.page===1){%> disable <%}%>"
            href="./?page=<%if(data.page > 1){%><%=data.page-1%><%}else{%>1<%}%>">
                <span>上一页</span>
            </a>
            <a class="page-select-a">
                <span class="change-page">
                    <span class="select-con">
                        <span class="page-num"><%=data.page%>/<%=data.pageCount%></span>
                        <span class="triangle page-triangle"></span>
                    </span>
                    <select class="gj-3g-page-btn" data-role="select">
                        <%for(var i=1; i <= data.pageCount;i++){%>
                        <option <%if(i===data.page){%>selected="true"<%}%> value="./?page=<%=i%>"><%=i%></option>
                        <%}%>
                    </select>
                </span>
            </a>
            <a data-role="next" class="page-down <%if(data.page == data.pageCount){%>disable<%}%>" href="./?page=<%if(data.page < data.pageCount){%><%=parseInt(data.page)+1%><%}else{%><%=data.pageCount%><%}%>">
                <span>下一页</span>
            </a>
        </div>
         <%}if(data.list.length !==1){%>
        <div class="post-opt opt">
            <label class="checkbox-group">
                <input data-role="selectAll" type="checkbox" name="checkbox" value="all">
                <span>全选</span>
            </label>
            <button data-role="cancel" class="btn btn-default js-touch-state">取消</button>
            <button data-role="delete" class="btn btn-primary js-touch-state">删除</button>
        </div>
        <div class="post-opt edit">
            <button data-role="edit" class="btn btn-default js-touch-state">编辑</button>
        </div>
        <%}else{%>
        <div class="post-opt sigle">
            <button data-role="delete" class="btn btn-primary js-touch-state">删除</button>
        </div>
        <%}%>
    <%}else{%>
    <div class="post-list">
        <div class="post-nodata">
            <img src="http://sta.ganjistatic1.com/src/image/mobile/touch/milan/search/no_pic.png" alt="">
            <p>您还没有收藏帖子</p>
        </div>
    </div>
    <%}%>
</div>
<!-- section end --> 