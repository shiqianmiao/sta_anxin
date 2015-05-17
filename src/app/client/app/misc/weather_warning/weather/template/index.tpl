<!-- 分享-->
<!-- section start -->
<section class="section" data-widget="app/client/common/widget/share.js#share">
    <% if (~isappinstalled < 0) {%>
        <!-- app guide start -->
        <div class="app-guide">
            <a href="javascript:;" class="guide-cont clear">
                <img src="http://sta.ganjistatic1.com/src/image/mobile/touch/guide/logo_app_gjsh.png" alt="" class="guide-logo" />
                <div class="guide-slogon">赶集生活</div>
                <div class="guide-dc">看天气、看空气、看星座</div>
            </a>
            <% if (isappinstalled === 1) { %>
                <a href="javascript:;" class="guide-btn" data-role="appstart" data-gjalog="yujing_app_start">打开</a>
            <% } else if (isappinstalled === 0) { %>
                    <% if (env === 'android') { %>
                        <a href="javascript:;" data-href="http://sj.qq.com/myapp/detail.htm?apkName=com.ganji.android" class="guide-btn" data-role="downloadapp" data-gjalog="yujing_app_download">下载</a>
                    <% } else { %>
                        <a href="javascript:;" data-href="http://mp.weixin.qq.com/mp/redirect?url=http://itunes.apple.com/cn/app/gan-ji-sheng-huo-zhao-pin/id388932995?mt=8" class="guide-btn" data-role="downloadapp" data-gjalog="yujing_app_download">下载</a>
                    <% } %>
            <% } %>
        </div>
        <!-- app guide end -->
    <% } %>
    <div class="list">
        <% _.each(data.data, function(item){ %>
            <div class="list-item level-<%= item.warningColor %>">
                <div class="list-head">
                    <div class="list-pic"><i class="icon-weather icon-<%= item.warningDesc %>"></i></div>
                    <h3 class="list-title"><%= item.warningSignalCode.desc %><%= item.warningSignalLevel.desc %>预警</h3>
                    <div class="list-info">中央气象局<%= item.updateTime %>发布</div>
                </div>
                <div class="list-body">
                    <p><%= item.desc %></p>
                </div>
            </div>
        <% });%>
    </div>
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
</section>
<!-- section end -->