<div class="center-pop"
    data-widget="app/client/app/misc/car_share/view/group_join.js#joinGroup"
    data-weixin-app-url="http://a.app.qq.com/o/simple.jsp?pkgname=com.ganji.android"
    data-ganji-shenghuo-app="ganji://3g.ganji.com/protocol1"
    data-ganji-shenghuo-download="http://3g.ganji.com/bj_down/?sft=0">
    <a href="javascript:;" class="close-btn"></a>
    <div class="group-info">
         <ul class="group-base">
            <li><span>群账号</span><%= data.groupId %></li>
            <li><span>群等级</span><i class="level"><%= data.level %></i></li>
            <li><span>群位置</span><span class="address"><%= data.location %></span><i class="icon-addr"></i></li>
         </ul>
         <div class="blank"></div>
         <ul class="group-about">
            <li>
                <span class="main-group fl">群主</span>
                <div class="information fl"><img src="http://image.ganjistatic1.com/<%= data.owner.avatar.replace(/(\\d*)-(\\d*)_(\\d)-(\\d)/, '28-28c_9-$4') %>" alt=""><em><%= data.owner.nickName %></em></div>
            </li>
            <li>
                <span>群成员</span>
                <em><%= data.currentCount %>人</em>
                <div class="groups">
                    <div>
                        <%_.each(data.members, function(item, index){%>
                        <img src="http://image.ganjistatic1.com/<%= item.avatar.replace(/(\\d*)-(\\d*)_(\\d)-(\\d)/, '35-35c_9-$4') %>" alt="">
                        <%});%>
                    </div>
                </div>
            </li>
         </ul>
    </div>
    <div class="down-info" data-role="wapFooter">
        <p class="need">需下载赶集生活app并在群组中加群</p>
        <a href="javascript:;" class="btn" data-role="wapBtn">去下载</a>
        <p class="how"> 如何加群？</p>
        <div class="dowm-tip">首先复制本页面顶部群账号，之后下载app后打开，进去右下角群组界面，点击“发现-搜索”，输入群账号搜索加入即可</div>
    </div>
    <div class="down-info" data-role="appFooter">
        <a href="javascript:;" class="btn" data-role="appBtn">申请加入群组</a>
    </div>
</div>