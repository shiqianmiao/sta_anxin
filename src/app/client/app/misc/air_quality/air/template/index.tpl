<!-- 分享-->
<!-- section start -->
<div class="air_quality" data-widget="app/client/common/widget/share.js#share">
    <ul class="page_wrapper">
        <section class="section">
            <!-- refresh start -->
            <div class="refresh" id="refresh">
                <div class="refresh-body"><span class="refreshtip">下拉刷新</span><span class="refreshtime"></span></div>
            </div>
            <!-- refresh end -->
            <% if (~isappinstalled < 0) {%>
                <!-- app guide start -->
                <div class="app-guide">
                    <a href="javascript:;" class="guide-cont clear">
                        <img src="http://sta.ganjistatic1.com/src/image/mobile/touch/guide/logo_app_gjsh.png" alt="" class="guide-logo" />
                        <div class="guide-slogon">赶集生活</div>
                        <div class="guide-dc">看天气、看空气、看星座</div>
                    </a>
                    <% if (isappinstalled === 1) { %>
                        <a href="javascript:;" class="guide-btn" data-role="appstart" data-gjalog="tianqi_app_start">打开</a>
                    <% } else if (isappinstalled === 0) { %>
                        <% if (env === 'android') { %>
                            <a href="javascript:;" data-href="http://sj.qq.com/myapp/detail.htm?apkName=com.ganji.android" class="guide-btn" data-role="downloadapp" data-gjalog="tianqi_app_download">下载</a>
                        <% } else { %>
                            <a href="javascript:;" data-href="http://mp.weixin.qq.com/mp/redirect?url=http://itunes.apple.com/cn/app/gan-ji-sheng-huo-zhao-pin/id388932995?mt=8" class="guide-btn" data-role="downloadapp" data-gjalog="tianqi_app_download">下载</a>
                        <% } %>
                    <% } %>
                </div>
                <!-- app guide end -->
            <% } %>
            <div class="info">
                <div class="info-date">
                    <p>今天</p>
                    <p><%= data.day_today %></p>
                </div>
                <div class="info-data">
                    <strong><%= data.pm25 %></strong>
                </div>
                <div class="info-stat">
                    <strong><%= data.desc.level %></strong>
                    <span><%= data.updatetime_txt %></span>
                </div>
            </div>
            <ul class="report">
                <!--<li>
                    <b>PM2.5</b>
                    <span>入肺颗粒物</span>
                    <strong class="fc-red"><%= data.real_pm25 %></strong>
                    <span>μg/m³</span>
                </li>
                <li>
                    <b>PM10</b>
                    <span>可吸入颗粒物</span>
                    <strong class="fc-purple"><%= data.real_pm10 %></strong>
                    <span>μg/m³</span>
                </li>
                <li>
                    <b>NO<sub>2</sub></b>
                    <span>二氧化氮</span>
                    <strong class="fc-orange"><%= data.real_no2 %></strong>
                    <span>μg/m³</span>
                </li>
                <li>
                    <b>SO<sub>2</sub></b>
                    <span>二氧化硫</span>
                    <strong class="fc-green"><%= data.real_so2 %></strong>
                    <span>μg/m³</span>
                </li>-->
                <li>
                    <b>PM2.5</b>
                    <span>入肺颗粒物</span>
                    <strong class="fc-red"><% if (data.real_pm25 == 0) { %> <%= '——' %> <% } else {%><%= data.real_pm25 %><%}%></strong>
                    <span>μg/m³</span>
                </li>
                <li>
                    <b>PM10</b>
                    <span>可吸入颗粒物</span>
                    <strong class="fc-purple"><% if (data.real_pm10 == 0) { %> <%= '——' %> <% } else {%><%= data.real_pm10 %><%}%></strong>
                    <span>μg/m³</span>
                </li>
                <li>
                    <b>NO<sub>2</sub></b>
                    <span>二氧化氮</span>
                    <strong class="fc-orange"><% if (data.real_no2 == 0) {%> <%= '——' %> <% } else {%><%= data.real_no2 %><%}%></strong>
                    <span>μg/m³</span>
                </li>
                <li>
                    <b>SO<sub>2</sub></b>
                    <span>二氧化硫</span>
                    <strong class="fc-green"><% if (data.real_so2 == 0) {%> <%= '——' %> <% } else {%><%= data.real_so2 %><%}%></strong>
                    <span>μg/m³</span>
                </li>
            </ul>
            <div class="notice">
                <h2 class="notice-title"><i class="icon-heart"></i>健康提示</h2>
                <div class="notice-body">
                    <p><%= data.desc.tip %></p>
                </div>
            </div>
            <div class="chart">
                <h2 class="chart-title">过去一周</h2>
                <div class="chart-body">
                    <ul class="chart-list">
                        <% _.each(data.levels, function(item, index){ %>
                            <li class="<%= item %>">
                                <span class="chart-date"><%= item.weekday%></span>
                                <span class="chart-degree" style="height:<%= data.lastweek[index].aqi / 4 %>px;"><strong><%= data.lastweek[index].aqi %></strong></span><!-- //height的值为pm2.5值的1/4 -->
                            </li>
                        <% }); %>
                    </ul>
                </div>
            </div>
        </section>
        <!-- section end -->
        <!-- footer start -->
        <%if (nativeApiIsSupport) {%>
        <footer class="footer" data-widget="app/client/app/misc/air_quality/air/view/index.js#link">
            <div class="mod-bingo"><a data-role="link" data-href="<%= data.moreurl %>" href="javascript:;">查看更多监控点数据</a></div>
            <div class="copyright">空气质量数据由PM2.5监测网提供</div>
        </footer>
        <%}%>
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
    </ul>
</div>