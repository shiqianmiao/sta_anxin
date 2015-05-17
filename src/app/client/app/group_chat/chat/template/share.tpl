<!-- section start -->
<section class="share">
    <div class="detail">
        <div class="form-widget">
            <div class="pic-group">
                <div class="mod-list">
                    <%_.each(data.picUrls, function(url, index){%>
                        <div class="list-item"><img src="http://image.ganjistatic1.com/<%= url.replace(/(\\d*)-(\\d*)_(\\d)-(\\d)/, '73-73c_9-$4') %>" alt=""></div>
                    <%});%>
                </div>
            </div>
            <h2 class="form-heading"><%= data.name %></h2>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">群&nbsp;&nbsp;账&nbsp;号</label>
                        <div class="form-control">
                            <div class="form-text"><%= data.groupId %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">群&nbsp;&nbsp;等&nbsp;&nbsp;级</label>
                        <div class="form-control">
                            <i class="icon icon-octagonal-sm"><%= data.level %></i>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">群&nbsp;&nbsp;位&nbsp;&nbsp;置</label>
                        <div class="form-control">
                            <div class="form-text address"><%= data.location %><i class="icon icon-location"></i></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">群　　主</label>
                        <div class="form-control">
                            <div class="form-text"><img src="http://image.ganjistatic1.com/<%= data.owner.avatar.replace(/(\\d*)-(\\d*)_(\\d)-(\\d)/, '28-28c_9-$4') %>" alt="" class="avatar"><%= data.owner.nickName %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">群&nbsp;&nbsp;成&nbsp;&nbsp;员</label>
                        <div class="form-control">
                            <div class="form-text"><%= data.currentCount %>人</div>
                            <div class="avatar-group">
                                <div class="mod-list">
                                    <%_.each(data.members, function(item, index){%>
                                        <div class="list-item">
                                            <img src="http://image.ganjistatic1.com/<%= item.avatar.replace(/(\\d*)-(\\d*)_(\\d)-(\\d)/, '35-35c_9-$4') %>" alt=""></div>
                                    <%});%>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">群&nbsp;&nbsp;标&nbsp;&nbsp;签</label>
                        <div class="form-control">
                            <div class="form-text"><%= labels %> </div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">创建时间</label>
                        <div class="form-control">
                            <div class="form-text"><%= createTime %></div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">群&nbsp;&nbsp;简&nbsp;&nbsp;介</label>
                        <div class="form-control">
                            <div class="form-text"><%= data.introduction %></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- section end -->
<!-- footbar start -->
<div class="footbar"
    data-widget="app/client/app/group_chat/chat/view/share.js#main"
    data-weixin-app-url="http://a.app.qq.com/o/simple.jsp?pkgname=com.ganji.android"
    data-ganji-shenghuo-app="ganji://3g.ganji.com/protocol1"
    data-ganji-shenghuo-download="http://3g.ganji.com/bj_down/?sft=0"
>
    <div class="btn-group">
        <a data-role="submit" class="btn btn-primary">申请加入该群</a>
    </div>
</div>
<!-- footbar end -->