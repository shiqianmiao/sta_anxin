<!-- section start -->
<section class="section">
<!-- form start -->
    <div class="form-status status-failed">
        <div class="status-tips">刷新点数剩余<%= data.point %>点，刷新失败！</div>
        <div class="status-cont">
            <p>请开通<strong>赶集帮帮</strong>或者购买<strong>刷新点数</strong>。</p>
        </div>
        <div class="status-opt" data-widget="app/client/app/fw/service/view/refresh.js#getRefreshPoint"><button class="btn btn-primary btn-large" data-role="bangbang">开通帮帮</button><button class="btn btn-primary btn-large" data-role="getpoint">购买刷新</button></div>
    </div>
<!-- form end -->
</section>
<!-- section end -->
<!-- popup start -->
<div class="mask"></div>
<!-- popup end -->