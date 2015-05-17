<!-- 分享-->
<div data-widget="app/client/common/widget/share.js#share">
    <!-- section start -->
    <section class="section">
        <% if (~isappinstalled < 0) {%>
            <!-- app guide start -->
            <div class="app-guide">
                <a href="javascript:;" class="guide-cont clear">
                    <img src="http://sta.ganjistatic1.com/src/image/mobile/touch/guide/logo_app_gjsh.png" alt="" class="guide-logo" />
                    <div class="guide-slogon">赶集生活</div>
                    <div class="guide-dc">看天气、看空气、看星座</div>
                </a>
                <% if (isappinstalled === 1) { %>
                    <a href="javascript:;" class="guide-btn" data-role="appstart" data-gjalog="xingzuo_app_start">打开</a>
                <% } else if (isappinstalled === 0) { %>
                        <% if (env === 'android') { %>
                            <a href="javascript:;" data-href="http://sj.qq.com/myapp/detail.htm?apkName=com.ganji.android" class="guide-btn" data-role="downloadapp" data-gjalog="xingzuo_app_download">下载</a>
                        <% } else { %>
                            <a href="javascript:;" data-href="http://mp.weixin.qq.com/mp/redirect?url=http://itunes.apple.com/cn/app/gan-ji-sheng-huo-zhao-pin/id388932995?mt=8" class="guide-btn" data-role="downloadapp" data-gjalog="xingzuo_app_download">下载</a>
                        <% } %>
                <% } %>
            </div>
            <!-- app guide end -->
        <% } %>
        <div class="info">
            <div class="info-pic"><i class="icon-sign icon-<%= data.pName %>"></i><!-- //星座className由icon-加星座拼音组成，详见附件 --></div>
            <h2 class="info-title"><%= data.name %></h2>
            <div class="info-meta"><%= data.month %></div>
            <div class="info-opt" data-widget="app/client/app/misc/fortune_change/fortune/view/index.js#tab">
                <a data-role="link" href="javascript:;">切换 <i class="icon-arrow">&gt;</i></a>
            </div>
        </div>
        <dl class="dlist">
            <dt><i class="icon icon-mood"></i>心情<span class="mod-rank rank-<%= window.Math.round(data.mood.score/2)%>"></span></dt>
            <dd>
                <p><%= data.mood.desc %></p>
            </dd>
            <dt><i class="icon icon-love"></i>爱情<span class="mod-rank rank-<%= window.Math.round(data.love.score/2) %>"></span></dt>
            <dd>
                <p><%= data.love.desc %></p>
            </dd>
            <dt><i class="icon icon-finance"></i>财运<span class="mod-rank rank-<%= window.Math.round(data.wealth.score/2) %>"></span></dt>
            <dd>
                <p><%= data.wealth.desc %></p>
            </dd>
            <dt><i class="icon icon-bag"></i>工作<span class="mod-rank rank-<%= window.Math.round(data.work.score/2) %>"></span></dt>
            <dd>
                <p><%= data.work.desc %></p>
            </dd>
            <dt><i class="icon icon-cross"></i>健康<span class="mod-rank rank-<%= window.Math.round(data.health.score/2) %>"></span></dt>
            <dd>
                <div class="dlist2">
                    <p><strong>开运颜色：</strong><%= data.luckycolor %></p>
                    <p><strong>开运方位：</strong><%= data.luckydirection %></p>
                    <p><strong>开运物品：</strong><%= data.luckystuff %></p>
                </div>
            </dd>
        </dl>
    </section>
    <!-- section end -->
    <!-- footer start -->
    <footer class="footer" data-widget="app/client/app/misc/fortune_change/fortune/view/index.js#link">
        <div class="mod-bingo"><a data-role="link" data-href="<%= data.moreUrl %>" href="javascript:;">查看更多<%= data.name %>运势</a></div>
        <div class="copyright">星座数据由星吧提供</div>
    </footer>
    <!-- footer end -->
    <!-- popup start -->
    <div class="popup popup-ios" data-role="popup" data-env="ios">
        <ol class="list-guide">
            <li><em class="num">1</em>点击右上角分享按钮<strong>"<i class="icon-menu">菜单</i>"</strong></li>
            <li><em class="num">2</em>在菜单中点击<i class="icon-browser">浏览器</i></li>
            <li><em class="num">3</em>即可打开赶集生活<i class="icon-ganji">赶集生活</i></li>
        </ol>
        <div class="icon-close-container" data-role="closePopup">
            <div class="icon-close" data-role="closePopup">关闭</div>
        </div>
    </div>
    <div class="popup popup-android" data-role="popup" data-env="android">
        <ol class="list-guide">
            <li data-role="closePopup"><em class="num">1</em>点击右上角<i class="icon-menu">菜单</i></li>
            <li><em class="num">2</em>在菜单中点击<i class="icon-browser">浏览器</i></li>
            <li><em class="num">3</em>即可打开赶集生活<i class="icon-ganji">赶集生活</i></li>
        </ol>
        <div class="icon-close-container" data-role="closePopup">
            <div class="icon-close" data-role="closePopup">关闭</div>
        </div>
    </div>
    <div class="mask" data-role="mask"></div>
    <!-- popup end -->
<div>