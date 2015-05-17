<!-- section start -->
<section class="wrap" data-widget="app/client/app/misc/project_tmall/view/index.js#index">
    <div class="mod-banner"><img src="http://m.ganjistatic1.com/abe89a280fe28c9a600063fad5e6f491/zhongjiu_toutu.jpg" alt=""></div>
    <div class="category">
        <div class="mod-column">
            <div class="column-head">
                <h2 class="column-title"><i class="icon icon-gift-sm"></i>积分秒好礼</h2>
            </div>
            <div class="column-body">
                <div class="mod-list">
                    <%_.each(data, function(item, index){%>
                        <div class="list-item">
                            <a href="javascript:;" class="list-cont" data-id="<%= item.id %>" data-role="detailLink">
                                <div class="list-image"><img src="<%= item.img_url %>" alt=""></div>
                                <h3 class="list-title"><%= item.name %></h3>
                                <div class="list-value"><b><%= item.price %></b>积分<i class="icon-tag"><%= item.icon_text %></i></div>
                                <div class="list-info">剩余<%=  item.day_limit - item.sold %>件</div>
                            </a>
                        </div>
                    <%});%>
                </div>
            </div>
        </div>
        <div class="mod-btn-group">
            <a href="javascript:;" data-role="indexLink" class="btn btn-info btn-large">返回商城查看更多给力商品</a>
        </div>
    </div>
</section>